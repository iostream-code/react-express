const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// =============================================
// Konfigurasi CORS yang Komprehensif
// =============================================
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ],
    exposedHeaders: ['Authorization'],
    credentials: true,
    optionsSuccessStatus: 200 // Untuk browser lama
};

// Pasang middleware CORS sebelum semua route
app.use(cors(corsOptions));

// Handle khusus untuk preflight requests
app.options('*', cors(corsOptions)); // Enable preflight untuk semua routes

// =============================================
// Middleware Standar
// =============================================
app.use(express.json()); // Untuk parsing body JSON
app.use(express.urlencoded({ extended: true })); // Untuk parsing form data

// =============================================
// Routes
// =============================================
app.use('/api', routes);

// =============================================
// Error Handling
// =============================================
app.use(errorHandler);

// =============================================
// 404 Handler
// =============================================
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// =============================================
// Server Startup
// =============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS configured for: ${corsOptions.origin}`);
});