import React from 'react';

const TABS = [
  { id: 'tree',     icon: 'ti-sitemap',       label: 'Tree' },
  { id: 'timeline', icon: 'ti-calendar-event', label: 'Timeline' },
  { id: 'members',  icon: 'ti-users',          label: 'Members' },
  { id: 'calendar', icon: 'ti-calendar',       label: 'Calendar' },
  { id: 'stats',    icon: 'ti-chart-bar',      label: 'Stats' },
];

export default function Topbar({ tab, setTab, trees, activeTreeId, setActiveTreeId, online, openModal, onExportJSON }) {
  return (
    <div className="topbar">
      <div className="logo">
        <i className="ti ti-tree" />
        FamilyRoots
      </div>

      <select
        className="tree-select"
        value={activeTreeId || ''}
        onChange={e => setActiveTreeId(e.target.value)}
        title="Switch family tree"
      >
        {trees.map(t => (
          <option key={t._id} value={t._id}>{t.name}</option>
        ))}
      </select>

      <button className="tb-btn" onClick={() => openModal('newTree')} title="New family tree">
        <i className="ti ti-plus" /> New Tree
      </button>

      <nav className="topbar-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`nav-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <i className={`ti ${t.icon}`} />{t.label}
          </button>
        ))}
      </nav>

      <div className="topbar-actions">
        <button className="tb-btn" onClick={onExportJSON} title="Export JSON">
          <i className="ti ti-download" /> JSON
        </button>
        <button className="tb-btn primary" onClick={() => openModal('addMember')}>
          <i className="ti ti-plus" /> Add Member
        </button>
        <span
          className={`online-dot ${online ? 'on' : 'off'}`}
          title={online ? 'Backend connected (MongoDB)' : 'Offline – using localStorage'}
        />
      </div>
    </div>
  );
}
