import React from 'react';
import {
  initials, memberColor, calcAge, formatDate, daysUntil, daysTag,
  getSpouse, getEngaged, getChildren, getParents, getSiblings,
} from '../utils/helpers';

export default function DetailPanel({ members, relationships, selectedId, setSelectedId, openModal, onDelete, onPhotoUpload }) {
  const memberMap = {};
  members.forEach(m => { memberMap[m._id] = m; });

  const m = memberMap[selectedId];
  if (!m) {
    return (
      <div className="detail-panel">
        <div className="empty-state" style={{ height: '100%' }}>
          <i className="ti ti-user" />
          <p>Select a member to view details</p>
        </div>
      </div>
    );
  }

  const [col, light] = memberColor(m);
  const spouse   = getSpouse(m._id, relationships);
  const engaged  = getEngaged(m._id, relationships);
  const children = getChildren(m._id, relationships);
  const parents  = getParents(m._id, relationships);
  const siblings = getSiblings(m._id, relationships);

  const spouseM  = spouse  ? memberMap[String(spouse.a  === String(m._id) ? spouse.b  : spouse.a)]  : null;
  const engagedM = engaged ? memberMap[String(engaged.a === String(m._id) ? engaged.b : engaged.a)] : null;

  const events = [];
  if (m.dob) {
    const d = daysUntil(m.dob);
    events.push({ type: 'birthday', label: 'Birthday', date: m.dob, days: d, icon: 'ti-cake', bg: '#fef3c7', c: '#d97706', ev: { type: 'birthday', memberId: m._id, memberName: m.name, date: m.dob, daysUntil: d } });
  }
  if (spouseM && spouse?.date) {
    const d = daysUntil(spouse.date);
    events.push({ type: 'anniversary', label: 'Anniversary', date: spouse.date, days: d, icon: 'ti-heart', bg: '#ffe4e6', c: '#e11d48', ev: { type: 'anniversary', memberId: m._id, memberName: m.name, partnerId: spouseM._id, partnerName: spouseM.name, date: spouse.date, daysUntil: d } });
  }
  if (engagedM && engaged?.date) {
    const d = daysUntil(engaged.date);
    events.push({ type: 'engagement', label: 'Engagement', date: engaged.date, days: d, icon: 'ti-diamond', bg: '#ede9fe', c: '#7c3aed', ev: { type: 'engagement', memberId: m._id, memberName: m.name, partnerId: engagedM._id, partnerName: engagedM.name, date: engaged.date, daysUntil: d } });
  }
  events.sort((a, b) => a.days - b.days);

  function relChip(id, label) {
    const p = memberMap[id];
    if (!p) return null;
    const [pc, pl] = memberColor(p);
    return (
      <div key={id} className="rel-chip" onClick={() => setSelectedId(id)}>
        <div className="avatar" style={{ width: 26, height: 26, fontSize: 10, background: pl, color: pc }}>
          {p.photo ? <img src={p.photo} alt={initials(p.name)} /> : initials(p.name)}
        </div>
        <span style={{ flex: 1 }}>{p.name}</span>
        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{label}</span>
      </div>
    );
  }

  return (
    <div className="detail-panel">
      <div className="det-head">
        <button
    className="mobile-close"
    onClick={() => setSelectedId(null)}
  >
    <i className="ti ti-x" />
  </button>
        <div className="det-av" style={{ background: light, color: col }}>
          {m.photo ? <img src={m.photo} alt={initials(m.name)} /> : initials(m.name)}
        </div>
        <label className="photo-upload-label">
          <i className="ti ti-camera" style={{ fontSize: 13 }} /> Photo
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => onPhotoUpload(e, m._id)} />
        </label>
        <div className="det-name" style={{ marginTop: 6 }}>{m.name}</div>
        <div className="det-sub">{m.gender === 'M' ? 'Male' : m.gender === 'F' ? 'Female' : 'Other'}</div>
      </div>

      {/* Profile */}
      <div className="det-section">
        <h4><i className="ti ti-info-circle" />Profile</h4>
        <div className="info-row"><i className="ti ti-cake" /><span className="info-label">Born</span><span>{formatDate(m.dob)}</span></div>
        <div className="info-row"><i className="ti ti-clock" /><span className="info-label">Age</span><span>{m.dob ? `${calcAge(m.dob)} years` : '—'}</span></div>
        {spouseM  && <div className="info-row"><i className="ti ti-heart" /><span className="info-label">Spouse</span><span style={{ color: memberColor(spouseM)[0], cursor: 'pointer' }} onClick={() => setSelectedId(String(spouseM._id))}>{spouseM.name}</span></div>}
        {engagedM && <div className="info-row"><i className="ti ti-diamond" /><span className="info-label">Engaged</span><span style={{ cursor: 'pointer' }} onClick={() => setSelectedId(String(engagedM._id))}>{engagedM.name}</span></div>}
        {m.notes  && <div className="info-row"><i className="ti ti-notes" /><span className="info-label">Notes</span><span style={{ color: 'var(--text2)' }}>{m.notes}</span></div>}
      </div>

      {/* Events */}
      {events.length > 0 && (
        <div className="det-section">
          <h4><i className="ti ti-calendar" />Upcoming Events</h4>
          {events.map((ev, i) => {
            const tag = daysTag(ev.days);
            return (
              <div key={i} className="event-chip" onClick={() => openModal('wish', { event: ev.ev })}>
                <div className="event-icon" style={{ background: ev.bg }}>
                  <i className={`ti ${ev.icon}`} style={{ color: ev.c }} />
                </div>
                <div className="event-text">
                  <div className="event-name">{ev.label}</div>
                  <div className="event-date">{formatDate(ev.date)}</div>
                </div>
                <span className="days-tag" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Relations */}
      {(parents.length > 0 || children.length > 0 || siblings.length > 0) && (
        <div className="det-section">
          <h4><i className="ti ti-users" />Family</h4>
          {parents.map(id  => relChip(String(id),  'Parent'))}
          {children.map(id => relChip(String(id), 'Child'))}
          {siblings.map(id => relChip(String(id), 'Sibling'))}
        </div>
      )}

      {/* Actions */}
      <div className="det-actions">
        <button className="d-act edit" onClick={() => openModal('editMember', { id: m._id })}>
          <i className="ti ti-edit" /> Edit
        </button>
        <button className="d-act rel" onClick={() => openModal('addRel', { id: m._id })}>
          <i className="ti ti-link" /> Relate
        </button>
        <button className="d-act del" onClick={() => onDelete(m._id)}>
          <i className="ti ti-trash" />
        </button>
      </div>
    </div>
  );
}
