// server/scripts/seed.js
const mongoose = require('mongoose');
require('dotenv').config();

const Employee = require('../models/Employee');
const Project = require('../models/Project');
const ProjectAssignment = require('../models/ProjectAssignment');
const bcrypt = require('bcrypt');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding.');
  } catch (err) {
    console.error('❌ Connection error:', err);
    process.exit(1);
  }
};

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Employee.deleteMany();
  await Project.deleteMany();
  await ProjectAssignment.deleteMany();

  // Create employees
  const employees = await Employee.insertMany([
    { employee_id: 'E001', full_name: 'Anna Andersson', email: 'anna@example.com', hashed_password: await bcrypt.hash('password1', 10) },
    { employee_id: 'E002', full_name: 'Björn Berg', email: 'bjorn@example.com', hashed_password: await bcrypt.hash('password2', 10) },
    { employee_id: 'E003', full_name: 'Carla Carlsson', email: 'carla@example.com', hashed_password: await bcrypt.hash('password3', 10) },
    { employee_id: 'E004', full_name: 'David Dahl', email: 'david@example.com', hashed_password: await bcrypt.hash('password4', 10) },
    { employee_id: 'E005', full_name: 'Eva Ek', email: 'eva@example.com', hashed_password: await bcrypt.hash('password5', 10) }
  ]);

  // Create projects
  const projects = await Project.insertMany([
    { project_code: 'P001', project_name: 'Website Redesign', project_description: 'Revamp for modern UI' },
    { project_code: 'P002', project_name: 'Backend Refactor', project_description: 'Clean up old API code' },
    { project_code: 'P003', project_name: 'Mobile App', project_description: 'Build a companion app' },
    { project_code: 'P004', project_name: 'Database Migration', project_description: 'Move to MongoDB Atlas' },
    { project_code: 'P005', project_name: 'AI Integration', project_description: 'Chatbot integration' }
  ]);

  // Create project assignments
  await ProjectAssignment.insertMany([
    { employee_id: employees[0]._id, project_code: projects[0]._id, start_date: new Date('2024-01-01') },
    { employee_id: employees[1]._id, project_code: projects[1]._id, start_date: new Date('2024-01-15') },
    { employee_id: employees[2]._id, project_code: projects[2]._id, start_date: new Date('2024-02-01') },
    { employee_id: employees[3]._id, project_code: projects[3]._id, start_date: new Date('2024-02-15') },
    { employee_id: employees[4]._id, project_code: projects[4]._id, start_date: new Date('2024-03-01') }
  ]);

  console.log('✅ Database seeded successfully!');
  process.exit(0);
};

seed();
