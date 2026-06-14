import React, { useState } from 'react';
import { getSpouse, getEngaged, daysUntil } from '../utils/helpers';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOWS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarView({ ft, openModal }) {
  const { members, relationships } = ft;
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year,  setYear]  = useState(now.getFullYear());

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  // Build calendar days
  const days = [];
  for (let i = 0; i < first.getDay(); i++) days.push({ d: new Date(year, month, -(first.getDay() - i - 1)), other: true });
  for (let d = 1; d <= last.getDate(); d++) days.push({ d: new Date(year, month, d), other: false });
  while (days.length % 7 !== 0) days.push({ d: new Date(year, month + 1, days.length - last.getDate() - first.getDay() + 1), other: true });

  // Build event map keyed by `YYYY-M-D`
  const evMap = {};
  const addEv = (dateStr, entry) => {
    if (!dateStr) return;
    const d = new Date(dateStr + 'T12:00:00');
    if (d.getMonth() !== month) return;
    const key = `${year}-${month}-${d.getDate()}`;
    if (!evMap[key]) evMap[key] = [];
    evMap[key].push(entry);
  };

  members.forEach(m => {
    if (m.dob) addEv(m.dob, { label: `${m.name.split(' ')[0]}'s Birthday`, bg: '#fef3c7', c: '#d97706' });
    const sp = getSpouse(m._id, relationships);
    if (sp?.date && String(sp.a || sp.b) < String(sp.b || sp.a)) addEv(sp.date, { label: 'Anniversary', bg: '#ffe4e6', c: '#e11d48' });
    const en = getEngaged(m._id, relationships);
    if (en?.date) addEv(en.date, { label: 'Engagement', bg: '#ede9fe', c: '#7c3aed' });
  });

  return (
    <div className="cal-wrap">
      <div className="cal-head">
        <button className="cal-nav" onClick={prevMonth}><i className="ti ti-chevron-left" /></button>
        <div className="cal-title">{MONTHS[month]} {year}</div>
        <button className="cal-nav" onClick={nextMonth}><i className="ti ti-chevron-right" /></button>
        <button className="tb-btn" style={{ marginLeft: 8 }} onClick={() => { setMonth(now.getMonth()); setYear(now.getFullYear()); }}>Today</button>
      </div>

      <div className="cal-grid">
        {DOWS.map(d => <div key={d} className="cal-dow">{d}</div>)}
        {days.map(({ d, other }, i) => {
          const isToday = d.getTime() === today.getTime();
          const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          const dayEvs = evMap[key] || [];
          return (
            <div key={i} className={`cal-day${other ? ' other-month' : ''}${isToday ? ' today' : ''}`}>
              <div className="cal-day-num" style={isToday ? { color: 'var(--p)' } : {}}>{d.getDate()}</div>
              {dayEvs.slice(0, 2).map((ev, j) => (
                <div key={j} className="cal-ev-dot" style={{ background: ev.bg, color: ev.c }}>{ev.label}</div>
              ))}
              {dayEvs.length > 2 && <div style={{ fontSize: 9, color: 'var(--text3)' }}>+{dayEvs.length - 2} more</div>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {[['#fef3c7','#d97706','Birthdays'],['#ffe4e6','#e11d48','Anniversaries'],['#ede9fe','#7c3aed','Engagements']].map(([bg,c,label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1px solid ${c}`, display: 'inline-block' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
