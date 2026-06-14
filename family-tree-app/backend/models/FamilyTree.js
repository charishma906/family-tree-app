const mongoose = require('mongoose');

const FamilyTreeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    coverColor: { type: String, default: '#7c3aed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FamilyTree', FamilyTreeSchema);
