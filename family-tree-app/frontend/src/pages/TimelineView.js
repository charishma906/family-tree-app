import React, { useState } from 'react';
import { formatDate, daysTag } from '../utils/helpers';

const FILTERS = [
  { id: 'all',         label: 'All Events' },
  { id: 'birthday',    label: 'Birthdays' },
  { id: 'anniversary', label: 'Anniversaries' },
  { id: 'engagement',  label: 'Engagements' },
];

const TYPE_INFO = {
  birthday:    { icon: 'ti-cake',    label: 'Birthday',    bg: '#fef3c7', c: '#d97706' },
  anniversary: { icon: 'ti-heart',   label: 'Anniversary', bg: '#ffe4e6', c: '#e11d48' },
  engagement:  { icon: 'ti-diamond', label: 'Engagement',  bg: '#ede9fe', c: '#7c3aed' },
};

function EventCard({ ev, openModal }) {
  const ti  = TYPE_INFO[ev.type] || TYPE_INFO.birthday;
  const tag = daysTag(ev.daysUntil);
  const person = ev.type === 'birthday' ? ev.memberName : `${ev.memberName} & ${ev.partnerName || ''}`;

  return (
    <div className="ev-card">
      <div style={{ width: 40, height: 40, borderRadius: 10, background: ti.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={`ti ${ti.icon}`} style={{ color: ti.c, fontSize: 20 }} />
      </div>
      <div className="ev-card-left">
        <div className="ev-person">{person}</div>
        <div className="ev-type">{ti.label}{ev.type === 'birthday' ? ` · turns ${ev.daysUntil === 0 ? 'today!' : ''}` : ''}</div>
        <div className="ev-date">{formatDate(ev.date)}</div>
      </div>
      <span className="ev-badge" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>
      <button className="wish-btn" onClick={() => openModal('wish', { event: ev })}>
        <i className="ti ti-sparkles" /> Wish
      </button>
    </div>
  );
}

function Section({ title, events, dotColor, openModal }) {
  if (!events.length) return null;
  return (
    <div className="tl-section">
      <div className="tl-section-hd">
        <span className="tl-dot" style={{ background: dotColor }} />
        {title}
      </div>
      {events.map((ev, i) => <EventCard key={i} ev={ev} openModal={openModal} />)}
    </div>
  );
}

export default function TimelineView({ ft, openModal }) {
  const [filter, setFilter] = useState('all');
  const events = ft.events;
  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

  const today = filtered.filter(e => e.daysUntil === 0);
  const week  = filtered.filter(e => e.daysUntil > 0 && e.daysUntil <= 7);
  const month = filtered.filter(e => e.daysUntil > 7 && e.daysUntil <= 30);
  const later = filtered.filter(e => e.daysUntil > 30);

  return (
    <div className="timeline-wrap">
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Event Timeline</h2>
        <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 3 }}>
          Upcoming birthdays, anniversaries & celebrations
        </p>
      </div>

      <div className="tl-filters">
        {FILTERS.map(f => (
          <button key={f.id} className={`fl-btn${filter === f.id ? ' active' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <i className="ti ti-calendar-off" />
          <h3>No events found</h3>
          <p>Add members with dates to see upcoming events here.</p>
        </div>
      )}

      <Section title="Today"      events={today} dotColor="#16a34a" openModal={openModal} />
      <Section title="This Week"  events={week}  dotColor="#d97706" openModal={openModal} />
      <Section title="This Month" events={month} dotColor="#2563eb" openModal={openModal} />
      <Section title="Coming Up"  events={later} dotColor="var(--text3)" openModal={openModal} />
    </div>
  );
}
