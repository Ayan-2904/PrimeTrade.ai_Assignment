const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Get all tasks for user
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const { status, search } = req.query;

        // Build query
        const query = { userId: req.userId };
        
        if (status) query.status = status;
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query
        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        res.json({
            success: true,
            task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Create task
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const taskData = {
            ...req.body,
            userId: req.userId
        };

        const task = await Task.create(taskData);

        res.status(201).json({
            success: true,
            task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        let task = await Task.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        // Update task
        Object.assign(task, req.body);
        await task.save();

        res.json({
            success: true,
            task
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};