import React, { useState } from 'react';
import { generateWish } from '../utils/helpers';

export default function WishModal({ event, onClose }) {
  const [msg, setMsg] = useState(() => generateWish(event));

  const copy = () => navigator.clipboard.writeText(msg).then(() => alert('Copied to clipboard!'));
  const whatsapp = () => window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  const email = () => window.open('mailto:?subject=Special Wishes&body=' + encodeURIComponent(msg));

  const typeLabel = { birthday: 'Birthday', anniversary: 'Anniversary', engagement: 'Engagement' }[event?.type] || 'Event';

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Send {typeLabel} Wishes 🎉</h2>
          <button className="modal-close" onClick={onClose}><i className="ti ti-x" /></button>
        </div>
        <div className="modal-body">
          <textarea
            className="wish-text"
            style={{ width: '100%', resize: 'vertical', border: 'none', fontSize: 13, lineHeight: 1.6, background: 'var(--surface2)', borderRadius: 9, padding: 14, outline: 'none' }}
            rows={4}
            value={msg}
            onChange={e => setMsg(e.target.value)}
          />
          <div className="share-row">
            <button className="share-btn cp" onClick={copy}><i className="ti ti-copy" /> Copy</button>
            <button className="share-btn wa" onClick={whatsapp}><i className="ti ti-brand-whatsapp" /> WhatsApp</button>
            <button className="share-btn em" onClick={email}><i className="ti ti-mail" /> Email</button>
            <button className="share-btn" onClick={() => setMsg(generateWish(event))}><i className="ti ti-refresh" /> Regenerate</button>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
