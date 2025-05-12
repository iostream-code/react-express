// test-db.js
const db = require('./config/database');

(async () => {
    try {
        const res = await db.query('SELECT NOW()');
        console.log('Database connected:', res.rows[0]);
    } catch (err) {
        console.error('Connection failed:', err);
    }
})();