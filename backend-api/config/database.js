// config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: String(process.env.DB_USER),
    host: String(process.env.DB_HOST),
    database: String(process.env.DB_NAME),
    password: String(process.env.DB_PASSWORD),
    port: Number(process.env.DB_PORT) || 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

// Handle connection errors
pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    process.exit(-1);
});

module.exports = {
    async query(text, params) {
        try {
            const start = Date.now();
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            console.log('Query executed in', duration, 'ms');
            return res;
        } catch (err) {
            console.error('Query error:', { text, params, err });
            throw err;
        }
    },

    // Transactions
    async transaction(queries) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const results = [];
            for (const { text, params } of queries) {
                results.push(await client.query(text, params));
            }
            await client.query('COMMIT');
            return results;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
};