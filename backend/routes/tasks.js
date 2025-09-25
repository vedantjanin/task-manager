// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { isAuthenticated } = require('../middleware/auth');

// create task
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      user: req.session.userId, // creator
    });
    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get all tasks for logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.session.userId })
      .populate('assignedTo', 'username role');
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update task (full edit)
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      req.body,
      { new: true }
    ).populate('assignedTo', 'username role');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update only status
router.put('/:id/status', isAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { status },
      { new: true }
    ).populate('assignedTo', 'username role');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// delete task
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
