const express = require('express');
const router  = express.Router();
const Relationship = require('../models/Relationship');

// GET /api/relationships?treeId=xxx
router.get('/', async (req, res, next) => {
  try {
    const { treeId } = req.query;
    if (!treeId) return res.status(400).json({ error: 'treeId is required' });
    const rels = await Relationship.find({ treeId });
    res.json(rels);
  } catch (err) { next(err); }
});

// POST /api/relationships
router.post('/', async (req, res, next) => {
  try {
    const { treeId, type, parent, child, a, b, date } = req.body;
    if (!treeId || !type) return res.status(400).json({ error: 'treeId and type are required' });

    // Prevent duplicate parent→child relationships
    if (type === 'parent') {
      const exists = await Relationship.findOne({ treeId, type: 'parent', parent, child });
      if (exists) return res.status(409).json({ error: 'Relationship already exists' });
    }
    // Prevent duplicate spouse / engaged
    if (type === 'spouse' || type === 'engaged') {
      const exists = await Relationship.findOne({
        treeId, type,
        $or: [{ a, b }, { a: b, b: a }],
      });
      if (exists) return res.status(409).json({ error: 'Relationship already exists' });
    }

    const rel = await Relationship.create({ treeId, type, parent, child, a, b, date });
    res.status(201).json(rel);
  } catch (err) { next(err); }
});

// PUT /api/relationships/:id
router.put('/:id', async (req, res, next) => {
  try {
    const rel = await Relationship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rel) return res.status(404).json({ error: 'Relationship not found' });
    res.json(rel);
  } catch (err) { next(err); }
});

// DELETE /api/relationships/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const rel = await Relationship.findByIdAndDelete(req.params.id);
    if (!rel) return res.status(404).json({ error: 'Relationship not found' });
    res.json({ message: 'Relationship deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
