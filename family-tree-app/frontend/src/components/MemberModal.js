import React, { useState, useRef } from 'react';
import { initials } from '../utils/helpers';

export default function MemberModal({
  member,
  members = [],
  onSave,
  onClose
}) {

  const editing = !!member;

  const [form, setForm] = useState({
    name: member?.name || '',
    dob: member?.dob || '',
    gender: member?.gender || 'M',
    notes: member?.notes || '',
    photo: member?.photo || null,
    color: member?.color ?? 0,

    relationshipType: '',
    relatedMember: ''
  });

  const [preview, setPreview] = useState(member?.photo || null);
  const fileRef = useRef();

  const set = (k, v) =>
    setForm(f => ({
      ...f,
      [k]: v
    }));

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPreview(ev.target.result);
      set('photo', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return alert('Name is required');
    if (!form.dob)         return alert('Date of birth is required');
    onSave(form);
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editing ? 'Edit Member' : 'Add Family Member'}</h2>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x" /></button>
        </div>

        <div className="modal-body">
          {/* Photo upload */}
          <div className="photo-area">
            {preview
              ? <img className="photo-preview" src={preview} alt="Preview" />
              : <div className="photo-placeholder">{initials(form.name || '?')}</div>
            }
            <label className="photo-upload-label" style={{ justifyContent: 'center' }}>
              <i className="ti ti-upload" style={{ fontSize: 13 }} /> Upload Photo
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
            </label>
          </div>

          <div className="form-grid">
            <div className="form-field full">
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="e.g. John Smith" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Date of Birth *</label>
              <input className="form-input" type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Gender</label>
              <select className="form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div className="form-field">
  <label className="form-label">
    Relationship Type
  </label>

  <select
    className="form-select"
    value={form.relationshipType}
    onChange={e =>
      set('relationshipType', e.target.value)
    }
  >
    <option value="">None</option>
    <option value="child">Child</option>
    <option value="parent">Parent</option>
    <option value="spouse">Spouse</option>
  </select>
</div>

<div className="form-field">
  <label className="form-label">
    Related Member
  </label>

  <select
    className="form-select"
    value={form.relatedMember}
    onChange={e =>
      set('relatedMember', e.target.value)
    }
  >
    <option value="">
      Select Member
    </option>

    {members.map(m => (
      <option
        key={m._id}
        value={m._id}
      >
        {m.name}
      </option>
    ))}
  </select>
</div>
            <div className="form-field full">
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows={2} placeholder="Optional notes…" value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div className="form-field full">
              <label className="form-label">Color Theme</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['#7c3aed','#0d9488','#d97706','#e11d48','#2563eb','#16a34a','#c026d3','#ea580c'].map((c, i) => (
                  <div
                    key={i}
                    onClick={() => set('color', i)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer',
                      border: form.color === i ? '3px solid var(--text)' : '3px solid transparent',
                      transition: 'all .15s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-ok" onClick={handleSubmit}>{editing ? 'Save Changes' : 'Add Member'}</button>
        </div>
      </div>
    </div>
  );
}
