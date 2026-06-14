const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema(
  {
    treeId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyTree', required: true, index: true },
    name:   { type: String, required: true, trim: true },
    dob:    { type: String, required: true },   // stored as YYYY-MM-DD string
    gender: { type: String, enum: ['M', 'F', 'O'], default: 'M' },
    photo:  { type: String, default: null },     // base64 or URL
    color:  { type: Number, default: 0 },
    notes:  { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', MemberSchema);
