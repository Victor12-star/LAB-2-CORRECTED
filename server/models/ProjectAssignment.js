// server/models/ProjectAssignment.js
const mongoose = require('mongoose');

const projectAssignmentSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    project_id: {                       // bytt från project_code
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    start_date: {
      type: Date,
      default: Date.now                 // säkrare än required → slipper "Invalid Date"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProjectAssignment', projectAssignmentSchema);
