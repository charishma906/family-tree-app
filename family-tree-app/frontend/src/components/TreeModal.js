import React, { useState } from 'react';

export default function TreeModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSave = () => {
    if (!name.trim()) return alert('Please enter a tree name');
    onSave({ name: name.trim(), description: desc.trim() });
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>New Family Tree</h2>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x" /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-field full">
              <label className="form-label">Tree Name *</label>
              <input className="form-input" placeholder="e.g. Smith Family" value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
            <div className="form-field full">
              <label className="form-label">Description (optional)</label>
              <input className="form-input" placeholder="e.g. My maternal family" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-ok" onClick={handleSave}>Create Tree</button>
        </div>
      </div>
    </div>
  );
}
