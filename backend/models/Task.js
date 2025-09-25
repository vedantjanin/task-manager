// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true }, // task title
  description: { type: String, required: true }, // details about the task
  dueDate: { type: Date, required: true }, // when the task should be completed
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Medium' 
  }, // priority of the task
  status: { 
    type: String, 
    enum: ['pending', 'completed'], 
    default: 'pending' 
  }, // pending or completed
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who task is assigned to
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // task creator
  createdAt: { type: Date, default: Date.now } // task creation time
});

module.exports = mongoose.model('Task', taskSchema);
