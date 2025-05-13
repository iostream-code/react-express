require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes/index');

const app = express();

// =============================================
// 1. Enhanced Security Middleware
// =============================================
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Request logging

// Rate limiting untuk API
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // tiap 15 menit
    max: 100, // Limit 100 request per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// =============================================
// 2. Optimized CORS Configuration
// =============================================
const allowedOrigins = [
    'http://localhost:5173', // Vite dev
    'http://127.0.0.1:5173', // Alternatif localhost
    process.env.PRODUCTION_FRONTEND_URL // Jika ada tambahkan secara manual pada env
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization', 'X-Request-ID'],
    credentials: true,
    maxAge: 86400, // Masa berlaku 24 jam 
    optionsSuccessStatus: 204 // No content untuk OPTIONS
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight enable

// =============================================
// 3. Body Parsing & Request Handling
// =============================================
app.use(express.json({ limit: '10kb' })); // Membatasi ukuran JSON yang diterima
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logger khusus API, untuk mengetahui request yang masuk
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// =============================================
// 4. Route Configuration
// =============================================
app.use('/api', routes);

// Route untuk health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// =============================================
// 5. Enhanced Error Handling
// =============================================
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
    });
});

app.use(errorHandler); // Custom error handler ditempatkan pada ./middleware/errorHandler.js

// =============================================
// 6. Server Startup with Graceful Shutdown
// =============================================
const PORT = process.env.PORT || 5000; // Default ke 5000 dapat diubah pada .env

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🛡️  CORS enabled for origins: ${allowedOrigins.join(', ')}`);
});

// Handle graceful shutdown, yaitu secara aman menutup server saat menerima sinyal SIGINT (Ctrl+C) atau SIGTERM misal pada saat deploy
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server terminated');
        process.exit(0);
    });
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});