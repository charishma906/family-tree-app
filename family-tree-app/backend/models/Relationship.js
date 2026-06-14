const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema(
  {
    treeId: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyTree', required: true, index: true },
    type:   { type: String, enum: ['parent', 'spouse', 'engaged'], required: true },

    // For parent type: parent → child
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
    child:  { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },

    // For spouse / engaged type: a ↔ b
    a:    { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
    b:    { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
    date: { type: String, default: '' },   // marriage / engagement date YYYY-MM-DD
  },
  { timestamps: true }
);

module.exports = mongoose.model('Relationship', RelationshipSchema);
