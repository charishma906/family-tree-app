import React, { useState, useCallback } from 'react';
import './styles/global.css';
import LandingPage from './pages/LandingPage';

import useFamilyTree from './hooks/useFamilyTree';

import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';

import TreeView from './pages/TreeView';
import TimelineView from './pages/TimelineView';
import MembersView from './pages/MembersView';
import CalendarView from './pages/CalendarView';
import StatsView from './pages/StatsView';

import MemberModal from './components/MemberModal';
import RelModal from './components/RelModal';
import WishModal from './components/WishModal';
import TreeModal from './components/TreeModal';

import Toast from './components/Toast';

export default function App() {
  const ft = useFamilyTree();

  const [tab, setTab] = useState('tree');
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, icon = 'ti-check') => {
    const id = Date.now();

    setToasts(prev => [
      ...prev,
      { id, msg, icon }
    ]);

    setTimeout(() => {
      setToasts(prev =>
        prev.filter(t => t.id !== id)
      );
    }, 2800);
  }, []);

  const openModal = useCallback(
    (type, data = {}) =>
      setModal({ type, data }),
    []
  );

  const closeModal = useCallback(
    () => setModal(null),
    []
  );

  const handleAddMember = async payload => {

  const m = await ft.addMember(payload);

  if (
    payload.relationshipType &&
    payload.relatedMember
  ) {

    if (payload.relationshipType === 'child') {

      await ft.addRelationship({
        type: 'parent',
        parent: payload.relatedMember,
        child: m._id
      });

    }

    if (payload.relationshipType === 'parent') {

      await ft.addRelationship({
        type: 'parent',
        parent: m._id,
        child: payload.relatedMember
      });

    }

    if (payload.relationshipType === 'spouse') {

      await ft.addRelationship({
        type: 'spouse',
        a: payload.relatedMember,
        b: m._id
      });

    }
  }

  setSelectedId(m._id);

  closeModal();

  toast(`${m.name} added to family tree`);
};

  const handleEditMember = async (id, payload) => {
    await ft.editMember(id, payload);

    closeModal();

    toast('Member updated');
  };

  const handleDeleteMember = async id => {
    const member = ft.members.find(
      m => m._id === id
    );

    if (
      !window.confirm(
        `Remove ${member?.name}?`
      )
    )
      return;

    await ft.removeMember(id);

    if (selectedId === id) {
      setSelectedId(null);
    }

    toast('Member removed', 'ti-trash');
  };

  const handleAddRel = async payload => {
    await ft.addRelationship(payload);

    closeModal();

    toast('Relationship added', 'ti-link');
  };

  const handleAddTree = async payload => {
    const t = await ft.addTree(payload);

    closeModal();

    setSelectedId(null);

    toast(`${t.name} created`);
  };

  const handleExportJSON = () => {
    const data = {
      tree: ft.trees.find(
        t => t._id === ft.activeTreeId
      ),
      members: ft.members,
      relationships: ft.relationships,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: 'application/json',
      }
    );

    const a = document.createElement('a');

    a.href = URL.createObjectURL(blob);
    a.download = `family_tree_${Date.now()}.json`;

    a.click();

    toast('Exported as JSON', 'ti-download');
  };

  if (ft.loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 12,
          color: 'var(--text2)',
        }}
      >
        <i
          className="ti ti-tree"
          style={{
            fontSize: 40,
            color: 'var(--p)',
          }}
        />
        <div style={{ fontSize: 14 }}>
          Loading FamilyRoots…
        </div>
      </div>
    );
  }

  const sharedProps = {
    ft,
    selectedId,
    setSelectedId,
    openModal,
    toast,
  };

  return (
    <div className="app-shell">
      <Topbar
        tab={tab}
        setTab={setTab}
        trees={ft.trees}
        activeTreeId={ft.activeTreeId}
        setActiveTreeId={
          ft.setActiveTreeId
        }
        online={ft.online}
        openModal={openModal}
        onExportJSON={
          handleExportJSON
        }
      />

      <div className="app-main">

        {window.innerWidth > 768 && (
          <Sidebar
            members={ft.members}
            relationships={
              ft.relationships
            }
            generations={
              ft.generations
            }
            selectedId={selectedId}
            setSelectedId={
              setSelectedId
            }
            search={search}
            setSearch={setSearch}
            openModal={openModal}
          />
        )}

     <div className="content">

  {tab === 'tree' && (
    <TreeView
      {...sharedProps}
      onDelete={handleDeleteMember}
    />
  )}

  {tab === 'timeline' && (
    <TimelineView {...sharedProps} />
  )}

  {tab === 'members' && (
    <MembersView
      {...sharedProps}
      onDelete={handleDeleteMember}
    />
  )}

  {tab === 'calendar' && (
    <CalendarView {...sharedProps} />
  )}

  {tab === 'stats' && (
    <StatsView {...sharedProps} />
  )}

</div>
      </div>

      {modal?.type ===
        'addMember' && (
        <MemberModal
  members={ft.members}
  onSave={handleAddMember}
  onClose={closeModal}
/>
      )}

      {modal?.type ===
        'editMember' && (
        <MemberModal
  members={ft.members}
  onSave={p =>
    handleEditMember(
      modal.data.id,
      p
    )
  }
          onClose={
            closeModal
          }
          member={ft.members.find(
            m =>
              m._id ===
              modal.data.id
          )}
        />
      )}

      {modal?.type ===
        'addRel' && (
        <RelModal
          onSave={
            handleAddRel
          }
          onClose={
            closeModal
          }
          members={ft.members}
          fromId={modal.data.id}
          relationships={
            ft.relationships
          }
          activeTreeId={
            ft.activeTreeId
          }
        />
      )}

      {modal?.type ===
        'wish' && (
        <WishModal
          event={
            modal.data.event
          }
          onClose={
            closeModal
          }
        />
      )}

      {modal?.type ===
        'newTree' && (
        <TreeModal
          onSave={
            handleAddTree
          }
          onClose={
            closeModal
          }
        />
      )}

      <Toast toasts={toasts} />
    </div>
  ); 
}