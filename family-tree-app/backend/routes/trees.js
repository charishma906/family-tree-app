const express = require('express');
const router  = express.Router();
const FamilyTree   = require('../models/FamilyTree');
const Member       = require('../models/Member');
const Relationship = require('../models/Relationship');

// GET /api/trees – list all trees
router.get('/', async (req, res, next) => {
  try {
    const trees = await FamilyTree.find().sort({ createdAt: -1 });
    res.json(trees);
  } catch (err) { next(err); }
});

// GET /api/trees/:id
router.get('/:id', async (req, res, next) => {
  try {
    const tree = await FamilyTree.findById(req.params.id);
    if (!tree) return res.status(404).json({ error: 'Tree not found' });
    res.json(tree);
  } catch (err) { next(err); }
});

// POST /api/trees – create
router.post('/', async (req, res, next) => {
  try {
    const { name, description, coverColor } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const tree = await FamilyTree.create({ name, description, coverColor });
    res.status(201).json(tree);
  } catch (err) { next(err); }
});

// PUT /api/trees/:id – update
router.put('/:id', async (req, res, next) => {
  try {
    const tree = await FamilyTree.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tree) return res.status(404).json({ error: 'Tree not found' });
    res.json(tree);
  } catch (err) { next(err); }
});

// DELETE /api/trees/:id – delete tree + all its members & relationships
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await Promise.all([
      FamilyTree.findByIdAndDelete(id),
      Member.deleteMany({ treeId: id }),
      Relationship.deleteMany({ treeId: id }),
    ]);
    res.json({ message: 'Tree deleted' });
  } catch (err) { next(err); }
});

// GET /api/trees/:id/full – full tree dump (members + relationships)
router.get('/:id/full', async (req, res, next) => {
  try {
    const id = req.params.id;
    const [tree, members, relationships] = await Promise.all([
      FamilyTree.findById(id),
      Member.find({ treeId: id }),
      Relationship.find({ treeId: id }),
    ]);
    if (!tree) return res.status(404).json({ error: 'Tree not found' });
    res.json({ tree, members, relationships });
  } catch (err) { next(err); }
});

module.exports = router;
