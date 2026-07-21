const mongoose = require('mongoose');

let dbConnection = null;

function connectDB() {
    if (!process.env.MONGO_URL) {
        return Promise.reject(new Error('MONGO_URL is not configured'));
    }
    if (!dbConnection) {
        dbConnection = mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
            .then((conn) => {
                console.log('Connected to the DB');
                return conn;
            })
            .catch((e) => {
                console.log('EROR: Could not connect to the DB', e.message);
                dbConnection = null; // allow retry on next request
                throw e;
            });
    }
    return dbConnection;
}

module.exports = async function awaitConnect(req, res, next) {
    try {
        await connectDB();
        next();
    } catch (e) {
        res.status(503).json({ ok: false, payload: 'Database unavailable' });
    }
};