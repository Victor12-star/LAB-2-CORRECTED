// server/routes/projectAssignments.js
const express = require('express');
const router = express.Router();
const ProjectAssignment = require('../models/ProjectAssignment');
const Employee = require('../models/Employee');
const Project = require('../models/Project');

const isObjectId = (v) => typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v);

// --- Helpers ------------------------------------------------------
async function resolveEmployeeRef(value) {
  if (!value) return null;
  if (isObjectId(value)) return value; // redan ObjectId-sträng
  const emp = await Employee.findOne({ employee_id: value });
  return emp ? emp._id : null;
}
async function resolveProjectRef(value) {
  if (!value) return null;
  if (isObjectId(value)) return value; // redan ObjectId-sträng
  const proj = await Project.findOne({ project_id: value });
  return proj ? proj._id : null;
}
function populateQuery(q) {
  return q
    .populate({ path: 'employee_id', select: 'employee_id full_name email' })
    .populate({ path: 'project_id',  select: 'project_id project_name'  });
}

// --- Routes -------------------------------------------------------

// GET by project (t.ex. /api/projectassignments/project/P001 eller .../project/<Project._id>)
router.get('/project/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let filter;
    if (isObjectId(id)) filter = { project_id: id };
    else {
      const p = await Project.findOne({ project_id: id }, { _id: 1 });
      filter = p ? { project_id: p._id } : { project_id: null };
    }
    const list = await populateQuery(ProjectAssignment.find(filter).sort({ start_date: -1 }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by employee (t.ex. /api/projectassignments/employee/E001 eller .../employee/<Employee._id>)
router.get('/employee/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let filter;
    if (isObjectId(id)) filter = { employee_id: id };
    else {
      const e = await Employee.findOne({ employee_id: id }, { _id: 1 });
      filter = e ? { employee_id: e._id } : { employee_id: null };
    }
    const list = await populateQuery(ProjectAssignment.find(filter).sort({ start_date: -1 }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all (populated)
router.get('/', async (_req, res) => {
  try {
    const list = await populateQuery(ProjectAssignment.find().sort({ start_date: -1 }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by _id (populated)
router.get('/:id', async (req, res) => {
  try {
    const doc = await populateQuery(ProjectAssignment.findById(req.params.id));
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// POST – accepterar ObjectId eller koder (E001, P001)
router.post('/', async (req, res) => {
  try {
    let { employee_id, project_id, start_date } = req.body;

    const empId = await resolveEmployeeRef(employee_id);
    if (!empId) return res.status(400).json({ error: 'Employee not found (use ObjectId or employee_id like "E001")' });

    const projId = await resolveProjectRef(project_id);
    if (!projId) return res.status(400).json({ error: 'Project not found (use ObjectId or project_id like "P001")' });

    const created = await ProjectAssignment.create({
      employee_id: empId,
      project_id: projId,
      start_date: start_date ? new Date(start_date) : undefined
    });

    const populated = await populateQuery(ProjectAssignment.findById(created._id));
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT – full update (accepterar koder/ObjectId)
router.put('/:id', async (req, res) => {
  try {
    const update = {};
    if ('employee_id' in req.body) {
      const empId = await resolveEmployeeRef(req.body.employee_id);
      if (!empId) return res.status(400).json({ error: 'Employee not found' });
      update.employee_id = empId;
    }
    if ('project_id' in req.body) {
      const projId = await resolveProjectRef(req.body.project_id);
      if (!projId) return res.status(400).json({ error: 'Project not found' });
      update.project_id = projId;
    }
    if ('start_date' in req.body) {
      update.start_date = new Date(req.body.start_date);
    }

    const saved = await populateQuery(
      ProjectAssignment.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    );
    if (!saved) return res.status(404).json({ error: 'Not found' });
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH – partial (accepterar koder/ObjectId)
router.patch('/:id', async (req, res) => {
  try {
    const delta = {};
    if ('employee_id' in req.body) {
      const empId = await resolveEmployeeRef(req.body.employee_id);
      if (!empId) return res.status(400).json({ error: 'Employee not found' });
      delta.employee_id = empId;
    }
    if ('project_id' in req.body) {
      const projId = await resolveProjectRef(req.body.project_id);
      if (!projId) return res.status(400).json({ error: 'Project not found' });
      delta.project_id = projId;
    }
    if ('start_date' in req.body) {
      delta.start_date = new Date(req.body.start_date);
    }

    const saved = await populateQuery(
      ProjectAssignment.findByIdAndUpdate(req.params.id, { $set: delta }, { new: true, runValidators: true })
    );
    if (!saved) return res.status(404).json({ error: 'Not found' });
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ProjectAssignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ message: 'Assignment deleted successfully' });
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router;
