const express = require('express');
const router  = express.Router();
const Member       = require('../models/Member');
const Relationship = require('../models/Relationship');

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + 'T12:00:00');
  const next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  return Math.round((next - now) / 86400000);
}

// GET /api/events?treeId=xxx&days=90
router.get('/', async (req, res, next) => {
  try {
    const { treeId, days: daysParam = 365 } = req.query;
    if (!treeId) return res.status(400).json({ error: 'treeId is required' });

    const [members, rels] = await Promise.all([
      Member.find({ treeId }),
      Relationship.find({ treeId }),
    ]);

    const memberMap = {};
    members.forEach(m => { memberMap[m._id.toString()] = m; });

    const events = [];
    const limit = parseInt(daysParam);

    members.forEach(m => {
      if (m.dob) {
        const d = daysUntil(m.dob);
        if (d !== null && d <= limit) {
          events.push({ type: 'birthday', memberId: m._id, memberName: m.name, date: m.dob, daysUntil: d });
        }
      }
    });

    rels.forEach(r => {
      if ((r.type === 'spouse' || r.type === 'engaged') && r.date) {
        const d = daysUntil(r.date);
        if (d !== null && d <= limit) {
          const ma = memberMap[r.a?.toString()];
          const mb = memberMap[r.b?.toString()];
          if (ma && mb) {
            events.push({
              type: r.type === 'spouse' ? 'anniversary' : 'engagement',
              memberId: r.a, memberName: ma.name,
              partnerId: r.b, partnerName: mb.name,
              date: r.date, daysUntil: d,
            });
          }
        }
      }
    });

    events.sort((a, b) => a.daysUntil - b.daysUntil);
    res.json(events);
  } catch (err) { next(err); }
});

module.exports = router;
