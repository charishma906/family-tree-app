const mongoose = require('mongoose');
require('dotenv').config();

const FamilyTree   = require('./models/FamilyTree');
const Member       = require('./models/Member');
const Relationship = require('./models/Relationship');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/familytree';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clean existing data
  await Promise.all([FamilyTree.deleteMany(), Member.deleteMany(), Relationship.deleteMany()]);
  console.log('Cleared existing data');

  // Create tree
  const tree = await FamilyTree.create({ name: 'Johnson Family', description: 'Sample family tree', coverColor: '#7c3aed' });
  const tid  = tree._id;

  // Create members
  const members = await Member.insertMany([
    { treeId: tid, name: 'Robert Johnson',  dob: '1945-03-12', gender: 'M', color: 0 },
    { treeId: tid, name: 'Eleanor Johnson', dob: '1948-07-22', gender: 'F', color: 1 },
    { treeId: tid, name: 'David Johnson',   dob: '1970-11-05', gender: 'M', color: 2 },
    { treeId: tid, name: 'Sarah Johnson',   dob: '1972-04-18', gender: 'F', color: 3 },
    { treeId: tid, name: 'Michael Johnson', dob: '1975-09-30', gender: 'M', color: 4 },
    { treeId: tid, name: 'Emily Chen',      dob: '1974-06-14', gender: 'F', color: 5 },
    { treeId: tid, name: 'James Johnson',   dob: '1997-02-08', gender: 'M', color: 0 },
    { treeId: tid, name: 'Lily Johnson',    dob: '2000-08-25', gender: 'F', color: 3 },
    { treeId: tid, name: 'Noah Johnson',    dob: '1999-12-01', gender: 'M', color: 2 },
    { treeId: tid, name: 'Olivia Johnson',  dob: '2002-05-17', gender: 'F', color: 1 },
  ]);

  const [robert, eleanor, david, sarah, michael, emily, james, lily, noah, olivia] = members.map(m => m._id);

  await Relationship.insertMany([
    { treeId: tid, type: 'spouse', a: robert,  b: eleanor, date: '1968-06-15' },
    { treeId: tid, type: 'parent', parent: robert,  child: david   },
    { treeId: tid, type: 'parent', parent: eleanor, child: david   },
    { treeId: tid, type: 'parent', parent: robert,  child: michael },
    { treeId: tid, type: 'parent', parent: eleanor, child: michael },
    { treeId: tid, type: 'spouse', a: david,   b: sarah,   date: '1996-09-20' },
    { treeId: tid, type: 'spouse', a: michael, b: emily,   date: '1998-03-10' },
    { treeId: tid, type: 'parent', parent: david,   child: james  },
    { treeId: tid, type: 'parent', parent: sarah,   child: james  },
    { treeId: tid, type: 'parent', parent: david,   child: lily   },
    { treeId: tid, type: 'parent', parent: sarah,   child: lily   },
    { treeId: tid, type: 'parent', parent: michael, child: noah   },
    { treeId: tid, type: 'parent', parent: emily,   child: noah   },
    { treeId: tid, type: 'parent', parent: michael, child: olivia },
    { treeId: tid, type: 'parent', parent: emily,   child: olivia },
  ]);

  console.log('✅ Seed complete! Tree ID:', tid.toString());
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
