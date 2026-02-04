const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    const task = new Task({
      title,
      description,
      status,
      priority,
      userId: req.userId
    });
    
    await task.save();
    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, status, priority },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;