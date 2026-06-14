import { useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';
import { daysUntil, computeGenerations } from '../utils/helpers';

const LS_SEED_KEY = 'ft_seeded_v1';

export default function useFamilyTree() {
  const [trees, setTrees]               = useState([]);
  const [activeTreeId, setActiveTreeId] = useState(null);
  const [members, setMembers]           = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [online, setOnline]             = useState(null);

  // ── Bootstrap: load all trees ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setLoading(true);
      const ts = await api.getTrees();
      setOnline(api.backendOnline);

      if (ts.length === 0 && !localStorage.getItem(LS_SEED_KEY)) {
        await seedSampleData();
        localStorage.setItem(LS_SEED_KEY, '1');
        const refreshed = await api.getTrees();
        setTrees(refreshed);
        setActiveTreeId(refreshed[0]?._id || null);
      } else {
        setTrees(ts);
        const saved = localStorage.getItem('ft_activeTree');
        const validId = ts.find(t => t._id === saved)?._id || ts[0]?._id || null;
        setActiveTreeId(validId);
      }
      setLoading(false);
    })();
  }, []);

  // ── Load members + relationships when active tree changes ─────────────────
  useEffect(() => {
    if (!activeTreeId) { setMembers([]); setRelationships([]); return; }
    localStorage.setItem('ft_activeTree', activeTreeId);
    (async () => {
      const full = await api.getFullTree(activeTreeId);
      setMembers(full.members || []);
      setRelationships(full.relationships || []);
    })();
  }, [activeTreeId]);

  // ── Tree CRUD ─────────────────────────────────────────────────────────────
  const addTree = useCallback(async (payload) => {
    const t = await api.createTree(payload);
    setTrees(prev => [t, ...prev]);
    setActiveTreeId(t._id);
    return t;
  }, []);

  const removeTree = useCallback(async (id) => {
    await api.deleteTree(id);
    setTrees(prev => prev.filter(t => t._id !== id));
    if (activeTreeId === id) {
      const remaining = trees.filter(t => t._id !== id);
      setActiveTreeId(remaining[0]?._id || null);
    }
  }, [activeTreeId, trees]);

  // ── Member CRUD ───────────────────────────────────────────────────────────
  const addMember = useCallback(async (payload) => {
    const m = await api.createMember({ ...payload, treeId: activeTreeId });
    setMembers(prev => [...prev, m]);
    return m;
  }, [activeTreeId]);

  const editMember = useCallback(async (id, payload) => {
    const m = await api.updateMember(id, payload);
    setMembers(prev => prev.map(x => x._id === id ? m : x));
    return m;
  }, []);

  const removeMember = useCallback(async (id) => {
    await api.deleteMember(id);
    setMembers(prev => prev.filter(m => m._id !== id));
    setRelationships(prev => prev.filter(r =>
      String(r.parent) !== id && String(r.child) !== id &&
      String(r.a) !== id && String(r.b) !== id
    ));
  }, []);

  // ── Relationship CRUD ─────────────────────────────────────────────────────
  const addRelationship = useCallback(async (payload) => {
    const r = await api.createRelationship({ ...payload, treeId: activeTreeId });
    setRelationships(prev => [...prev, r]);
    return r;
  }, [activeTreeId]);

  const removeRelationship = useCallback(async (id) => {
    await api.deleteRelationship(id);
    setRelationships(prev => prev.filter(r => r._id !== id));
  }, []);

  // ── Derived: generations map ──────────────────────────────────────────────
  const generations = computeGenerations(members, relationships);

  // ── Derived: events ───────────────────────────────────────────────────────
  const events = (() => {
    const evs = [];
    const memberMap = {};
    members.forEach(m => { memberMap[m._id] = m; });

    members.forEach(m => {
      if (m.dob) {
        const d = daysUntil(m.dob);
        evs.push({ type: 'birthday', memberId: m._id, memberName: m.name, date: m.dob, daysUntil: d });
      }
    });
    relationships.forEach(r => {
      if ((r.type === 'spouse' || r.type === 'engaged') && r.date) {
        const ma = memberMap[String(r.a)], mb = memberMap[String(r.b)];
        if (ma && mb && String(r.a) < String(r.b)) {
          evs.push({ type: r.type === 'spouse' ? 'anniversary' : 'engagement', memberId: r.a, memberName: ma.name, partnerId: r.b, partnerName: mb.name, date: r.date, daysUntil: daysUntil(r.date) });
        }
      }
    });
    return evs.sort((a, b) => a.daysUntil - b.daysUntil);
  })();

  return {
    trees, activeTreeId, setActiveTreeId,
    members, relationships, generations, events,
    loading, online,
    addTree, removeTree,
    addMember, editMember, removeMember,
    addRelationship, removeRelationship,
  };
}

// ── Seed sample data on first launch ─────────────────────────────────────────
async function seedSampleData() {
  const tree = await api.createTree({ name: 'Johnson Family', description: 'Sample family tree', coverColor: '#7c3aed' });
  const tid = tree._id;
  const add = (name, dob, gender, color) => api.createMember({ treeId: tid, name, dob, gender, color });

  const [robert, eleanor, david, sarah, michael, emily, james, lily, noah, olivia] = await Promise.all([
    add('Robert Johnson',  '1945-03-12', 'M', 0), add('Eleanor Johnson', '1948-07-22', 'F', 1),
    add('David Johnson',   '1970-11-05', 'M', 2), add('Sarah Johnson',   '1972-04-18', 'F', 3),
    add('Michael Johnson', '1975-09-30', 'M', 4), add('Emily Chen',      '1974-06-14', 'F', 5),
    add('James Johnson',   '1997-02-08', 'M', 0), add('Lily Johnson',    '2000-08-25', 'F', 3),
    add('Noah Johnson',    '1999-12-01', 'M', 2), add('Olivia Johnson',  '2002-05-17', 'F', 1),
  ]);

  const addR = (p) => api.createRelationship({ treeId: tid, ...p });
  await Promise.all([
    addR({ type: 'spouse', a: robert._id, b: eleanor._id, date: '1968-06-15' }),
    addR({ type: 'parent', parent: robert._id,  child: david._id }),
    addR({ type: 'parent', parent: eleanor._id, child: david._id }),
    addR({ type: 'parent', parent: robert._id,  child: michael._id }),
    addR({ type: 'parent', parent: eleanor._id, child: michael._id }),
    addR({ type: 'spouse', a: david._id,   b: sarah._id,   date: '1996-09-20' }),
    addR({ type: 'spouse', a: michael._id, b: emily._id,   date: '1998-03-10' }),
    addR({ type: 'parent', parent: david._id,   child: james._id }),
    addR({ type: 'parent', parent: sarah._id,   child: james._id }),
    addR({ type: 'parent', parent: david._id,   child: lily._id }),
    addR({ type: 'parent', parent: sarah._id,   child: lily._id }),
    addR({ type: 'parent', parent: michael._id, child: noah._id }),
    addR({ type: 'parent', parent: emily._id,   child: noah._id }),
    addR({ type: 'parent', parent: michael._id, child: olivia._id }),
    addR({ type: 'parent', parent: emily._id,   child: olivia._id }),
  ]);
}
