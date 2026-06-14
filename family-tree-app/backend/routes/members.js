const express = require('express');
const router  = express.Router();
const Member  = require('../models/Member');
const Relationship = require('../models/Relationship');

// GET /api/members?treeId=xxx
router.get('/', async (req, res, next) => {
  try {
    const { treeId } = req.query;
    if (!treeId) return res.status(400).json({ error: 'treeId is required' });
    const members = await Member.find({ treeId }).sort({ createdAt: 1 });
    res.json(members);
  } catch (err) { next(err); }
});

// GET /api/members/:id
router.get('/:id', async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) { next(err); }
});

// POST /api/members
router.post('/', async (req, res, next) => {
  try {
    const { treeId, name, dob, gender, photo, color, notes } = req.body;
    if (!treeId || !name || !dob) return res.status(400).json({ error: 'treeId, name, and dob are required' });
    const member = await Member.create({ treeId, name, dob, gender, photo, color, notes });
    res.status(201).json(member);
  } catch (err) { next(err); }
});

// PUT /api/members/:id
router.put('/:id', async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) { next(err); }
});

// DELETE /api/members/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    // Remove all relationships involving this member
    await Relationship.deleteMany({
      $or: [{ parent: req.params.id }, { child: req.params.id }, { a: req.params.id }, { b: req.params.id }],
    });
    res.json({ message: 'Member deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
