import React, { useState } from 'react';

const REL_TYPES = [
  { id: 'parent',  icon: 'ti-user-up',   label: 'Parent'  },
  { id: 'child',   icon: 'ti-user-down', label: 'Child'   },
  { id: 'spouse',  icon: 'ti-heart',     label: 'Spouse'  },
  { id: 'engaged', icon: 'ti-diamond',   label: 'Engaged' },
];

/** Returns true if adding parentId→childId would create a cycle */
function wouldCreateCycle(parentId, childId, relationships) {
  // BFS/DFS: can we reach parentId starting from childId going DOWN?
  const visited = new Set();
  const queue = [String(childId)];
  while (queue.length) {
    const cur = queue.shift();
    if (cur === String(parentId)) return true;
    if (visited.has(cur)) continue;
    visited.add(cur);
    relationships
      .filter(r => r.type === 'parent' && String(r.parent) === cur)
      .forEach(r => queue.push(String(r.child)));
  }
  return false;
}

export default function RelModal({ members, fromId, relationships, activeTreeId, onSave, onClose }) {
  const [relType, setRelType] = useState('parent');
  const [targetId, setTargetId] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const fromMember = members.find(m => String(m._id) === String(fromId));
  const others = members.filter(m => String(m._id) !== String(fromId));
  const showDate = relType === 'spouse' || relType === 'engaged';

  const handleSave = () => {
    setError('');
    if (!targetId) { setError('Please select a member'); return; }

    // ── Duplicate check ──────────────────────────────────────────────────────
    const exists = relationships.some(r => {
      if (relType === 'parent') return r.type === 'parent' && String(r.parent) === String(fromId) && String(r.child) === String(targetId);
      if (relType === 'child')  return r.type === 'parent' && String(r.parent) === String(targetId) && String(r.child) === String(fromId);
      if (relType === 'spouse' || relType === 'engaged') {
        return r.type === relType && (
          (String(r.a) === String(fromId) && String(r.b) === String(targetId)) ||
          (String(r.a) === String(targetId) && String(r.b) === String(fromId))
        );
      }
      return false;
    });
    if (exists) { setError('This relationship already exists'); return; }

    // ── Circular dependency check ────────────────────────────────────────────
    if (relType === 'parent') {
      if (wouldCreateCycle(fromId, targetId, relationships)) {
        setError('Cannot add: this would create a circular dependency (e.g. A is ancestor of B and B is ancestor of A)');
        return;
      }
    }
    if (relType === 'child') {
      if (wouldCreateCycle(targetId, fromId, relationships)) {
        setError('Cannot add: this would create a circular dependency');
        return;
      }
    }

    // ── Self-reference check ─────────────────────────────────────────────────
    if (String(fromId) === String(targetId)) { setError('A member cannot be related to themselves'); return; }

    let payload = { treeId: activeTreeId, type: relType };
    if (relType === 'parent') payload = { ...payload, parent: fromId, child: targetId };
    else if (relType === 'child') payload = { ...payload, type: 'parent', parent: targetId, child: fromId };
    else payload = { ...payload, a: fromId, b: targetId, date };

    onSave(payload);
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Add Relationship</h2>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x" /></button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
            Adding relationship for <strong>{fromMember?.name}</strong>
          </p>

          <div className="rel-type-grid">
            {REL_TYPES.map(rt => (
              <button
                key={rt.id}
                className={`rel-type-btn${relType === rt.id ? ' selected' : ''}`}
                onClick={() => { setRelType(rt.id); setError(''); }}
              >
                <i className={`ti ${rt.icon}`} />
                {rt.label}
              </button>
            ))}
          </div>

          <div className="form-field" style={{ marginBottom: 14 }}>
            <label className="form-label">Related Member *</label>
            <select className="form-select" value={targetId} onChange={e => { setTargetId(e.target.value); setError(''); }}>
              <option value="">Select member…</option>
              {others.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>

          {showDate && (
            <div className="form-field" style={{ marginBottom: 14 }}>
              <label className="form-label">Date (Optional)</label>
              <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          )}

          {error && (
            <div style={{ background: '#ffe4e6', color: '#be123c', border: '1px solid #fda4af', borderRadius: 8, padding: '9px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ti ti-alert-circle" style={{ fontSize: 15 }} />{error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-ok" onClick={handleSave}>Add Relationship</button>
        </div>
      </div>
    </div>
  );
}
