const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/profile', require('./routes/profile'));
app.use('/api/v1/tasks', require('./routes/tasks'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API documentation endpoint
app.get('/api-docs', (req, res) => {
    res.json({
        message: 'API Documentation',
        endpoints: {
            auth: {
                register: 'POST /api/v1/auth/register',
                login: 'POST /api/v1/auth/login',
                logout: 'POST /api/v1/auth/logout'
            },
            profile: {
                get: 'GET /api/v1/profile',
                update: 'PUT /api/v1/profile'
            },
            tasks: {
                list: 'GET /api/v1/tasks',
                create: 'POST /api/v1/tasks',
                get: 'GET /api/v1/tasks/:id',
                update: 'PUT /api/v1/tasks/:id',
                delete: 'DELETE /api/v1/tasks/:id'
            }
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

module.exports = app;