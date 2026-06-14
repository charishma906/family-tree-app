import React from 'react';
import DetailPanel from '../components/DetailPanel';
import { initials, memberColor, calcAge, getSpouse, getChildren } from '../utils/helpers';

export default function MembersView({ ft, selectedId, setSelectedId, openModal, toast, onDelete }) {
  const { members, relationships, generations } = ft;

  const handlePhotoUpload = async (e, id) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      await ft.editMember(id, { photo: ev.target.result });
      toast('Photo updated', 'ti-camera');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div className="members-wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>All Members</h2>
            <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 2 }}>{members.length} member{members.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="btn-ok" onClick={() => openModal('addMember')}>
            <i className="ti ti-plus" /> Add Member
          </button>
        </div>

        <div className="members-grid">
          {members.map(m => {
            const [col, light] = memberColor(m);
            const sp = getSpouse(m._id, relationships);
            const ch = getChildren(m._id, relationships);
            const g  = generations[m._id] ?? 0;
            return (
              <div
                key={m._id}
                className={`m-card${selectedId === String(m._id) ? ' selected' : ''}`}
                onClick={() => setSelectedId(String(m._id))}
              >
                <div className="m-card-top">
                  <div className="avatar" style={{ width: 46, height: 46, fontSize: 18, background: light, color: col }}>
                    {m.photo ? <img src={m.photo} alt={initials(m.name)} /> : initials(m.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)' }}>
                      Gen {g + 1} · {m.gender === 'M' ? 'Male' : m.gender === 'F' ? 'Female' : 'Other'}
                    </div>
                  </div>
                </div>
                <div className="m-tags">
                  {m.dob && <span className="m-tag" style={{ background: '#fef3c7', color: '#92400e' }}>Age {calcAge(m.dob)}</span>}
                  {sp    && <span className="m-tag" style={{ background: '#ffe4e6', color: '#9f1239' }}>Married</span>}
                  {ch.length > 0 && <span className="m-tag" style={{ background: '#dcfce7', color: '#14532d' }}>{ch.length} child{ch.length > 1 ? 'ren' : ''}</span>}
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <i className="ti ti-users" />
              <h3>No members yet</h3>
              <p>Add your first family member to get started.</p>
            </div>
          )}
        </div>
      </div>

      <DetailPanel
        members={members} relationships={relationships}
        selectedId={selectedId} setSelectedId={setSelectedId}
        openModal={openModal} onDelete={onDelete}
        onPhotoUpload={handlePhotoUpload}
      />
    </div>
  );
}
