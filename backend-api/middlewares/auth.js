const jwt = require('jsonwebtoken');
const db = require('../config/database');

const requireAuth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Authorization token required' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const userQuery = await db.query(
                'SELECT * FROM users WHERE id = $1',
                [decoded.id]
            );

            if (userQuery.rows.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            const user = userQuery.rows[0];

            if (roles.length > 0 && !roles.includes(user.role)) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            req.user = user;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
};

module.exports = {
    requireAuth,
    auth: requireAuth()
};