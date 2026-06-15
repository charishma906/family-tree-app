import React, { useState, useCallback } from 'react';
import DetailPanel from '../components/DetailPanel';
import { initials, memberColor, calcAge, GEN_COLORS, getSpouse, getChildren } from '../utils/helpers';

function TreeCard({ member, selected, onSelect }) {
  const [col, light] = memberColor(member);
  return (
    <div className="tree-node">
      <div className={`tree-card${selected ? ' selected' : ''}`} onClick={() => onSelect(String(member._id))}>
        <div className="tree-av" style={{ background: light, color: col }}>
          {member.photo ? <img src={member.photo} alt={initials(member.name)} /> : initials(member.name)}
        </div>
        <div className="tree-name" title={member.name}>{member.name.split(' ')[0]}</div>
        {member.dob && <div className="tree-age">{calcAge(member.dob)} yrs</div>}
      </div>
    </div>
  );
}

function CoupleBlock({ m1, m2, commonChildren, members, relationships, selectedId, onSelect, collapsed, onToggleCollapse }) {
  const memberMap = {};
  members.forEach(m => { memberMap[String(m._id)] = m; });
  const hasChildren = commonChildren.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="couple-block">
        <TreeCard member={m1} selected={selectedId === String(m1._id)} onSelect={onSelect} />
        <div className="spouse-line">
          <span className="spouse-dash" />
          <i className="ti ti-heart-filled spouse-heart" />
          <span className="spouse-dash" />
        </div>
        <TreeCard member={m2} selected={selectedId === String(m2._id)} onSelect={onSelect} />
      </div>

      {hasChildren && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Collapse/Expand toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => onToggleCollapse(`${m1._id}_${m2._id}`)}>
            <div className="conn-v" />
            <button
              style={{
                width: 22, height: 22, borderRadius: '50%', background: 'var(--pl)', border: '1.5px solid var(--pm)',
                color: 'var(--p)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, zIndex: 1,
              }}
              title={collapsed ? 'Expand children' : 'Collapse children'}
            >
              <i className={`ti ${collapsed ? 'ti-plus' : 'ti-minus'}`} style={{ fontSize: 11 }} />
            </button>
          </div>

          {!collapsed && (
            <div style={{ position: 'relative' }}>
              {commonChildren.length > 1 && (
                <div className="h-bar" style={{
                  left: `${Math.round(100 / commonChildren.length)}%`,
                  right: `${Math.round(100 / commonChildren.length)}%`,
                }} />
              )}
              <div className="children-row">
                {commonChildren.map(cid => {
                  const child = memberMap[String(cid)];
                  if (!child) return null;
                  return (
                    <div key={cid} className="child-slot">
                      <div className="child-top" />
                      <TreeCard member={child} selected={selectedId === String(cid)} onSelect={onSelect} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {collapsed && (
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, background: 'var(--surface2)', padding: '2px 8px', borderRadius: 12 }}>
              {commonChildren.length} child{commonChildren.length > 1 ? 'ren' : ''} hidden
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TreeView({ ft, selectedId, setSelectedId, openModal, toast, onDelete }) {
  const { members, relationships, generations } = ft;
  const [collapsedBranches, setCollapsedBranches] = useState(new Set());
  const [dragMember, setDragMember] = useState(null);

  const toggleCollapse = useCallback((key) => {
    setCollapsedBranches(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const memberMap = {};
  members.forEach(m => { memberMap[String(m._id)] = m; });

  const genBuckets = {};
  members.forEach(m => {
    const g = generations[m._id] ?? 0;
    if (!genBuckets[g]) genBuckets[g] = [];
    genBuckets[g].push(String(m._id));
  });
  const maxGen = Object.keys(genBuckets).length ? Math.max(...Object.keys(genBuckets).map(Number)) : 0;

  const handlePhotoUpload = async (e, id) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => { await ft.editMember(id, { photo: ev.target.result }); toast('Photo updated', 'ti-camera'); };
    reader.readAsDataURL(file);
  };

  const handleExportPDF = () => {
    const sorted = [...members].sort((a, b) => (generations[a._id] ?? 0) - (generations[b._id] ?? 0));
    const genBucketsForPDF = {};
    sorted.forEach(m => {
      const g = generations[m._id] ?? 0;
      if (!genBucketsForPDF[g]) genBucketsForPDF[g] = [];
      genBucketsForPDF[g].push(m);
    });

    const memberMap2 = {};
    members.forEach(m => { memberMap2[String(m._id)] = m; });

    const getSpouseName = (id) => {
      const r = relationships.find(r => r.type === 'spouse' && (String(r.a) === String(id) || String(r.b) === String(id)));
      if (!r) return '—';
      const sid = String(r.a) === String(id) ? r.b : r.a;
      return memberMap2[String(sid)]?.name || '—';
    };
    const getChildrenNames = (id) => {
      return relationships.filter(r => r.type === 'parent' && String(r.parent) === String(id)).map(r => memberMap2[String(r.child)]?.name).filter(Boolean).join(', ') || '—';
    };

    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Family Tree Export</title>
    <style>
      body{font-family:Georgia,serif;padding:40px;color:#1a1916;max-width:900px;margin:0 auto}
      h1{font-size:28px;font-weight:700;color:#7c3aed;margin-bottom:4px}
      .subtitle{color:#5c5a55;font-size:14px;margin-bottom:32px}
      .gen-block{margin-bottom:28px;page-break-inside:avoid}
      .gen-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#7c3aed;border-bottom:2px solid #ede9fe;padding-bottom:6px;margin-bottom:14px}
      .member-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
      .member-card{border:1px solid #e4e1d8;border-radius:10px;padding:14px}
      .member-name{font-size:15px;font-weight:700;margin-bottom:8px}
      .member-row{display:flex;font-size:12px;margin-bottom:4px;gap:8px}
      .member-label{color:#9c9a94;min-width:80px}
      .member-val{color:#1a1916}
      .chip{display:inline-block;background:#ede9fe;color:#5b21b6;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;margin:2px}
      footer{margin-top:40px;font-size:11px;color:#9c9a94;border-top:1px solid #e4e1d8;padding-top:12px}
    </style></head><body>
    <h1>🌳 Family Tree</h1>
    <div class="subtitle">Exported on ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})} · ${members.length} members · ${Object.keys(genBucketsForPDF).length} generations</div>`;

    Object.entries(genBucketsForPDF).forEach(([g, ms]) => {
      html += `<div class="gen-block"><div class="gen-title">Generation ${parseInt(g)+1}</div><div class="member-grid">`;
      ms.forEach(m => {
        const sp = getSpouseName(m._id);
        const ch = getChildrenNames(m._id);
        const dob = m.dob ? new Date(m.dob + 'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—';
        const ageVal = m.dob ? (() => { const n=new Date(),b=new Date(m.dob+'T12:00:00'); let a=n.getFullYear()-b.getFullYear(); if(n<new Date(n.getFullYear(),b.getMonth(),b.getDate()))a--; return a; })() : null;
        html += `<div class="member-card">
          <div class="member-name">${m.name}</div>
          <div class="member-row"><span class="member-label">Born</span><span class="member-val">${dob}${ageVal ? ` (age ${ageVal})` : ''}</span></div>
          <div class="member-row"><span class="member-label">Gender</span><span class="member-val">${m.gender==='M'?'Male':m.gender==='F'?'Female':'Other'}</span></div>
          <div class="member-row"><span class="member-label">Spouse</span><span class="member-val">${sp}</span></div>
          <div class="member-row"><span class="member-label">Children</span><span class="member-val">${ch}</span></div>
        </div>`;
      });
      html += `</div></div>`;
    });

    html += `<footer>Generated by FamilyRoots App · Data stored securely</footer></body></html>`;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
    toast('PDF print dialog opened', 'ti-file');
  };

  if (!members.length) {
    return (
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div className="tree-canvas" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="empty-state">
            <i className="ti ti-tree" />
            <h3>No family members yet</h3>
            <p>Add the first member to start building your tree.</p>
            <button className="btn-ok" style={{ marginTop: 12 }} onClick={() => openModal('addMember')}>
              <i className="ti ti-plus" /> Add First Member
            </button>
          </div>
        </div>
        <DetailPanel members={members} relationships={relationships} selectedId={selectedId} setSelectedId={setSelectedId} openModal={openModal} onDelete={onDelete} onPhotoUpload={handlePhotoUpload} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div className="tree-canvas">
        {/* Tree toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>Family Tree</h2>
          <button
            className="tb-btn"
            onClick={() => setCollapsedBranches(new Set())}
            title="Expand all branches"
          ><i className="ti ti-arrows-maximize" /> Expand All</button>
          <button
            className="tb-btn"
            onClick={() => {
              const allKeys = new Set();
              members.forEach(m => {
                const sp = getSpouse(String(m._id), relationships);
                if (sp) allKeys.add(`${m._id}_${sp.a === String(m._id) ? sp.b : sp.a}`);
              });
              setCollapsedBranches(allKeys);
            }}
            title="Collapse all branches"
          ><i className="ti ti-arrows-minimize" /> Collapse All</button>
          <button className="tb-btn" onClick={handleExportPDF} title="Export as PDF">
            <i className="ti ti-file-text" /> Export PDF
          </button>
        </div>

        {Array.from({ length: maxGen + 1 }, (_, g) => {
          const ids = genBuckets[g] || [];
          const gc = GEN_COLORS[g % GEN_COLORS.length];
          const processed = new Set();
          const groups = [];

          ids.forEach(id => {
            if (processed.has(id)) return;
            processed.add(id);
            const sp = getSpouse(id, relationships);
            const spId = sp ? String(sp.a === id ? sp.b : sp.a) : null;
            if (spId && ids.includes(spId) && !processed.has(spId)) {
              processed.add(spId);
              const ch1 = getChildren(id, relationships).map(String);
              const ch2 = getChildren(spId, relationships).map(String);
              const commonChildren = ch1.filter(c => ch2.includes(c));
              groups.push({ type: 'couple', m1: memberMap[id], m2: memberMap[spId], commonChildren });
            } else {
              groups.push({ type: 'single', member: memberMap[id] });
            }
          });

          return (
            <div
  key={g}
  className="gen-section"
  onDragOver={(e)=>e.preventDefault()}
  onDrop={async ()=>{

    if(!dragMember) return;

    alert(
      `${dragMember.name} dropped into Generation ${g+1}`
    );

  }}
>
              <div className="gen-label" style={{ color: gc }}>
                <span style={{ background: `${gc}18`, padding: '2px 12px', borderRadius: 12 }}>
                  Generation {g + 1} <span style={{ opacity: 0.6, fontSize: 10 }}>({ids.length} member{ids.length !== 1 ? 's' : ''})</span>
                </span>
              </div>
              <div className="gen-row">
                {groups.map((grp, i) => {
                  if (grp.type === 'couple' && grp.m1 && grp.m2) {
                    const key = `${grp.m1._id}_${grp.m2._id}`;
                    return (
                      <CoupleBlock
                        key={i}
                        m1={grp.m1} m2={grp.m2}
                        commonChildren={grp.commonChildren}
                        members={members} relationships={relationships}
                        selectedId={selectedId} onSelect={setSelectedId}
                        collapsed={collapsedBranches.has(key)}
                        onToggleCollapse={toggleCollapse}
                      />
                    );
                  }
                  return grp.member ? (
  <div
    key={i}
    draggable
    onDragStart={() => setDragMember(grp.member)}
  >
    <TreeCard
      member={grp.member}
      selected={selectedId === String(grp.member._id)}
      onSelect={(id)=>{
        setSelectedId(id);
      }}
    />
  </div>
) : null;
                })}
              </div>
            </div>
          );
        })}
      </div>

    {selectedId && (
  <DetailPanel
    members={members}
    relationships={relationships}
    selectedId={selectedId}
    setSelectedId={setSelectedId}
    openModal={openModal}
    onDelete={onDelete}
    onPhotoUpload={handlePhotoUpload}
  />
)}
    </div>
  );
}
