// server/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    project_id: { type: String, required: true, unique: true, trim: true }, // bytt från project_code
    project_name: { type: String, required: true, trim: true },
    project_description: { type: String, default: '' }
  },
  { timestamps: true }
);

projectSchema.index({ project_id: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);
