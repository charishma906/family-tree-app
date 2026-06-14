export const COLORS = [
  ['#7c3aed', '#ede9fe'], ['#0d9488', '#ccfbf1'], ['#d97706', '#fef3c7'],
  ['#e11d48', '#ffe4e6'], ['#2563eb', '#dbeafe'], ['#16a34a', '#dcfce7'],
  ['#c026d3', '#fae8ff'], ['#ea580c', '#fff7ed'],
];

export const GEN_COLORS = ['#7c3aed','#0d9488','#d97706','#e11d48','#2563eb','#16a34a'];

export function memberColor(m) {
  return COLORS[(m?.color || 0) % COLORS.length];
}

export function initials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
}

export function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function calcAge(dob) {
  if (!dob) return null;
  const n = new Date(), b = new Date(dob + 'T12:00:00');
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T12:00:00');
  const next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  return Math.round((next - now) / 86400000);
}

export function daysTag(n) {
  if (n === 0) return { label: 'Today',  bg: '#dcfce7', color: '#16a34a' };
  if (n <= 7)  return { label: `${n}d`,  bg: '#fef3c7', color: '#d97706' };
  if (n <= 30) return { label: `${n}d`,  bg: '#dbeafe', color: '#2563eb' };
  return             { label: `${n}d`,  bg: '#f4f4f5', color: '#71717a' };
}

export function generateWish(event) {
  const fn = (event.memberName || '').split(' ')[0];
  const pn = (event.partnerName || '').split(' ')[0];
  const msgs = {
    birthday: [
      `🎉 Happy Birthday, ${fn}! Wishing you a wonderful year ahead filled with joy, health, and beautiful moments!`,
      `🎂 Many happy returns, ${fn}! May this year bring you love, laughter, and everything your heart desires.`,
      `🌟 Happy Birthday ${fn}! May every day of your new year be as wonderful as you are to this family.`,
    ],
    anniversary: [
      `💍 Happy Anniversary, ${fn} & ${pn}! Wishing you continued love and countless beautiful memories together.`,
      `🥂 Congratulations on your anniversary, ${fn} & ${pn}! May your bond grow stronger with every passing year.`,
    ],
    engagement: [
      `💕 Happy Engagement Anniversary, ${fn} & ${pn}! May your love continue to blossom and bring endless happiness.`,
    ],
  };
  const arr = msgs[event.type] || msgs.birthday;
  return arr[Math.floor(Math.random() * arr.length)];
}

// Derive generation from relationships (BFS from roots)
export function computeGenerations(members, relationships) {
  const memberMap = {};
  members.forEach(m => { memberMap[m._id] = m; });

  function getParents(id) {
    return relationships.filter(r => r.type === 'parent' && String(r.child) === String(id)).map(r => String(r.parent));
  }

  const cache = {};
  function getGen(id, visited = new Set()) {
    if (cache[id] !== undefined) return cache[id];
    if (visited.has(id)) return 0;
    visited.add(id);
    const parents = getParents(id);
    if (!parents.length) { cache[id] = 0; return 0; }
    const g = 1 + Math.max(...parents.map(p => getGen(p, new Set(visited))));
    cache[id] = g;
    return g;
  }

  const result = {};
  members.forEach(m => { result[m._id] = getGen(String(m._id)); });
  return result;
}

export function getSpouse(memberId, relationships) {
  return relationships.find(r => r.type === 'spouse' && (String(r.a) === String(memberId) || String(r.b) === String(memberId))) || null;
}

export function getEngaged(memberId, relationships) {
  return relationships.find(r => r.type === 'engaged' && (String(r.a) === String(memberId) || String(r.b) === String(memberId))) || null;
}

export function getChildren(memberId, relationships) {
  return [...new Set(
    relationships.filter(r => r.type === 'parent' && String(r.parent) === String(memberId)).map(r => String(r.child))
  )];
}

export function getParents(memberId, relationships) {
  return relationships.filter(r => r.type === 'parent' && String(r.child) === String(memberId)).map(r => String(r.parent));
}

export function getSiblings(memberId, relationships) {
  const parents = getParents(memberId, relationships);
  if (!parents.length) return [];
  const allChildren = relationships
    .filter(r => r.type === 'parent' && parents.includes(String(r.parent)))
    .map(r => String(r.child));
  return [...new Set(allChildren)].filter(c => c !== String(memberId));
}
