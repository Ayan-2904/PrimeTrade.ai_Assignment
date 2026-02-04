const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/v1/profile
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user.getProfile()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// @desc    Update user profile
// @route   PUT /api/v1/profile
// @access  Private
router.put('/', protect, [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
    try {
        const errors = require('express-validator').validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update user
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        
        await user.save();

        res.json({
            success: true,
            user: user.getProfile()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

module.exports = router;