import React from 'react';
import { calcAge, GEN_COLORS } from '../utils/helpers';

export default function StatsView({ ft }) {
  const { members, relationships, generations, trees, activeTreeId } = ft;
  const tree = trees.find(t => t._id === activeTreeId);

  if (!members.length) {
    return (
      <div className="stats-wrap">
        <div className="empty-state">
          <i className="ti ti-chart-bar" />
          <h3>No data yet</h3>
          <p>Add family members to see statistics.</p>
        </div>
      </div>
    );
  }

  const genBuckets = {};
  members.forEach(m => {
    const g = generations[m._id] ?? 0;
    if (!genBuckets[g]) genBuckets[g] = [];
    genBuckets[g].push(m);
  });
  const maxGen = Math.max(...Object.keys(genBuckets).map(Number), 0);

  const withAge   = members.filter(m => m.dob);
  const avgAge    = withAge.length ? Math.round(withAge.map(m => calcAge(m.dob)).reduce((a, b) => a + b, 0) / withAge.length) : 0;
  const marriages = relationships.filter(r => r.type === 'spouse').length;
  const engagements = relationships.filter(r => r.type === 'engaged').length;
  const parentLinks = relationships.filter(r => r.type === 'parent').length;
  const males   = members.filter(m => m.gender === 'M').length;
  const females = members.filter(m => m.gender === 'F').length;
  const others  = members.filter(m => m.gender === 'O').length;

  const maxGenCount = Math.max(...Object.values(genBuckets).map(g => g.length), 1);

  const stats = [
    { val: members.length, label: 'Total Members',     color: 'var(--p)' },
    { val: maxGen + 1,     label: 'Generations',        color: 'var(--t)' },
    { val: avgAge,         label: 'Average Age',        color: 'var(--a)' },
    { val: marriages,      label: 'Marriages',          color: 'var(--r)' },
    { val: engagements,    label: 'Engagements',        color: 'var(--b)' },
    { val: parentLinks,    label: 'Parent-Child Links', color: 'var(--g)' },
  ];

  return (
    <div className="stats-wrap">
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Family Statistics</h2>
        <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 3 }}>{tree?.name || 'Your family'} at a glance</p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Generation bar chart */}
      <div className="chart-card">
        <h3>Members per Generation</h3>
        {Object.entries(genBuckets).map(([g, ms]) => (
          <div key={g} className="bar-row">
            <span style={{ minWidth: 60, color: 'var(--text2)' }}>Gen {parseInt(g) + 1}</span>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${Math.round((ms.length / maxGenCount) * 100)}%`, background: GEN_COLORS[parseInt(g) % GEN_COLORS.length] }} />
            </div>
            <span style={{ minWidth: 24, textAlign: 'right', color: 'var(--text2)' }}>{ms.length}</span>
          </div>
        ))}
      </div>

      {/* Gender distribution */}
      <div className="chart-card">
        <h3>Gender Distribution</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['Male', males, '#2563eb'], ['Female', females, '#e11d48'], ['Other', others, '#7c3aed']].map(([lb, cnt, c]) => (
            <div key={lb} style={{ flex: 1, background: 'var(--surface2)', borderRadius: 9, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: c }}>{cnt}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>{lb}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
                {members.length ? Math.round((cnt / members.length) * 100) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Oldest & youngest */}
      <div className="chart-card">
        <h3>Age Highlights</h3>
        {(() => {
          const sorted = withAge.slice().sort((a, b) => new Date(a.dob) - new Date(b.dob));
          const oldest  = sorted[0];
          const youngest = sorted[sorted.length - 1];
          return (
            <div style={{ display: 'flex', gap: 12 }}>
              {oldest && (
                <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 9, padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Oldest</div>
                  <div style={{ fontWeight: 600 }}>{oldest.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{calcAge(oldest.dob)} years</div>
                </div>
              )}
              {youngest && (
                <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 9, padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Youngest</div>
                  <div style={{ fontWeight: 600 }}>{youngest.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{calcAge(youngest.dob)} years</div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
