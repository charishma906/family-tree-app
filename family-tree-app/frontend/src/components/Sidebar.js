import React from 'react';
import { initials, memberColor, calcAge, GEN_COLORS } from '../utils/helpers';

export default function Sidebar({ members, relationships, generations, selectedId, setSelectedId, search, setSearch, openModal }) {
  const filtered = members.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sb-head">
        <h3>Members <span style={{ color: 'var(--text3)', fontWeight: 400 }}>({members.length})</span></h3>
        <button className="sb-add-btn" onClick={() => openModal('addMember')} aria-label="Add member">
          <i className="ti ti-plus" />
        </button>
      </div>

      <div className="sb-search">
        <i className="ti ti-search sb-search-icon" />
        <input
          placeholder="Search members…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="sb-list">
        {filtered.map(m => {
          const [col, light] = memberColor(m);
          const g = generations[m._id] ?? 0;
          const gc = GEN_COLORS[g % GEN_COLORS.length];
          return (
            <div
              key={m._id}
              className={`sb-item${selectedId === m._id ? ' selected' : ''}`}
              onClick={() => setSelectedId(m._id)}
            >
              <div className="avatar" style={{ width: 34, height: 34, fontSize: 12, background: light, color: col }}>
                {m.photo ? <img src={m.photo} alt={initials(m.name)} /> : initials(m.name)}
              </div>
              <div className="sb-info">
                <div className="sb-name">{m.name}</div>
                <div className="sb-meta">{m.dob ? `${calcAge(m.dob)} yrs · ` : ''}Gen {g + 1}</div>
              </div>
              <span className="gen-badge" style={{ background: `${gc}22`, color: gc }}>G{g + 1}</span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="empty-state" style={{ height: 120 }}>
            <i className="ti ti-search" />
            <p>No results</p>
          </div>
        )}
      </div>
    </div>
  );
}
