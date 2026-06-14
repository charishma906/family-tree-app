/**
 * api.js
 * Unified data layer:
 *   1. Tries the Express backend (http://localhost:5000)
 *   2. Falls back to localStorage when the backend is unreachable
 */

import axios from 'axios';

const BASE = '/api';          // proxied to localhost:5000 via package.json proxy
const LS_KEY = 'ft_local_v1';

// ── LocalStorage helpers ──────────────────────────────────────────────────────
function lsGet() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || { trees: [], members: [], relationships: [] }; }
  catch { return { trees: [], members: [], relationships: [] }; }
}
function lsSet(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}
function uid() { return '_' + Math.random().toString(36).slice(2, 11); }
function now()  { return new Date().toISOString(); }

// ── Backend health flag ───────────────────────────────────────────────────────
let backendOnline = null;   // null = unknown, true/false after first check

async function isOnline() {
  if (backendOnline !== null) return backendOnline;
  try {
    await axios.get(`${BASE}/health`, { timeout: 2000 });
    backendOnline = true;
  } catch {
    backendOnline = false;
    console.warn('⚠️  Backend offline – using localStorage');
  }
  return backendOnline;
}

// Re-check every 30 s so the UI reconnects automatically
setInterval(() => { backendOnline = null; }, 30000);

// ── Generic request wrapper ───────────────────────────────────────────────────
async function req(method, url, data) {
  const online = await isOnline();
  if (!online) return null;          // caller handles null → use localStorage
  try {
    const res = await axios({ method, url: `${BASE}${url}`, data, timeout: 8000 });
    return res.data;
  } catch (err) {
    console.error(`API ${method} ${url}`, err.message);
    backendOnline = false;            // mark offline on error
    return null;
  }
}

// ════════════════════════════════════════════════════════════════════════════════
//  TREES
// ════════════════════════════════════════════════════════════════════════════════
export async function getTrees() {
  const online = await isOnline();
  if (online) {
    const data = await req('get', '/trees');
    if (data) return data;
  }
  return lsGet().trees;
}

export async function createTree(payload) {
  const online = await isOnline();
  if (online) {
    const data = await req('post', '/trees', payload);
    if (data) return data;
  }
  // localStorage fallback
  const db = lsGet();
  const tree = { _id: uid(), ...payload, createdAt: now(), updatedAt: now() };
  db.trees.push(tree);
  lsSet(db);
  return tree;
}

export async function updateTree(id, payload) {
  const online = await isOnline();
  if (online) {
    const data = await req('put', `/trees/${id}`, payload);
    if (data) return data;
  }
  const db = lsGet();
  const idx = db.trees.findIndex(t => t._id === id);
  if (idx !== -1) { db.trees[idx] = { ...db.trees[idx], ...payload, updatedAt: now() }; lsSet(db); return db.trees[idx]; }
}

export async function deleteTree(id) {
  const online = await isOnline();
  if (online) await req('delete', `/trees/${id}`);
  const db = lsGet();
  db.trees         = db.trees.filter(t => t._id !== id);
  db.members       = db.members.filter(m => m.treeId !== id);
  db.relationships = db.relationships.filter(r => r.treeId !== id);
  lsSet(db);
}

export async function getFullTree(id) {
  const online = await isOnline();
  if (online) {
    const data = await req('get', `/trees/${id}/full`);
    if (data) return data;
  }
  const db = lsGet();
  return {
    tree:          db.trees.find(t => t._id === id) || null,
    members:       db.members.filter(m => m.treeId === id),
    relationships: db.relationships.filter(r => r.treeId === id),
  };
}

// ════════════════════════════════════════════════════════════════════════════════
//  MEMBERS
// ════════════════════════════════════════════════════════════════════════════════
export async function getMembers(treeId) {
  const online = await isOnline();
  if (online) {
    const data = await req('get', `/members?treeId=${treeId}`);
    if (data) return data;
  }
  return lsGet().members.filter(m => m.treeId === treeId);
}

export async function createMember(payload) {
  const online = await isOnline();
  if (online) {
    const data = await req('post', '/members', payload);
    if (data) return data;
  }
  const db = lsGet();
  const member = { _id: uid(), ...payload, createdAt: now(), updatedAt: now() };
  db.members.push(member);
  lsSet(db);
  return member;
}

export async function updateMember(id, payload) {
  const online = await isOnline();
  if (online) {
    const data = await req('put', `/members/${id}`, payload);
    if (data) return data;
  }
  const db = lsGet();
  const idx = db.members.findIndex(m => m._id === id);
  if (idx !== -1) { db.members[idx] = { ...db.members[idx], ...payload, updatedAt: now() }; lsSet(db); return db.members[idx]; }
}

export async function deleteMember(id) {
  const online = await isOnline();
  if (online) await req('delete', `/members/${id}`);
  const db = lsGet();
  db.members       = db.members.filter(m => m._id !== id);
  db.relationships = db.relationships.filter(r => r.parent !== id && r.child !== id && r.a !== id && r.b !== id);
  lsSet(db);
}

// ════════════════════════════════════════════════════════════════════════════════
//  RELATIONSHIPS
// ════════════════════════════════════════════════════════════════════════════════
export async function getRelationships(treeId) {
  const online = await isOnline();
  if (online) {
    const data = await req('get', `/relationships?treeId=${treeId}`);
    if (data) return data;
  }
  return lsGet().relationships.filter(r => r.treeId === treeId);
}

export async function createRelationship(payload) {
  const online = await isOnline();
  if (online) {
    const data = await req('post', '/relationships', payload);
    if (data) return data;
  }
  const db = lsGet();
  const rel = { _id: uid(), ...payload, createdAt: now(), updatedAt: now() };
  db.relationships.push(rel);
  lsSet(db);
  return rel;
}

export async function deleteRelationship(id) {
  const online = await isOnline();
  if (online) await req('delete', `/relationships/${id}`);
  const db = lsGet();
  db.relationships = db.relationships.filter(r => r._id !== id);
  lsSet(db);
}

// ════════════════════════════════════════════════════════════════════════════════
//  EVENTS (upcoming)
// ════════════════════════════════════════════════════════════════════════════════
export async function getEvents(treeId, days = 365) {
  const online = await isOnline();
  if (online) {
    const data = await req('get', `/events?treeId=${treeId}&days=${days}`);
    if (data) return data;
  }
  return [];   // computed client-side in the hook when offline
}

export { backendOnline };
