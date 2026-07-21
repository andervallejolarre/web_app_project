const client = require('../models/clientModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const mongoose = require('mongoose');

const jwt_secret = process.env.JWT_SECRET;

const ensureDbReady = () => {
    if (!process.env.MONGO_URL) {
        throw new Error('MONGO_URL is not configured');
    }

    if (mongoose.connection.readyState !== 1) {
        throw new Error('Database connection is not available');
    }
};

class ClientsController {
    async findAll(req, res) {
        try {
            const clients = await client.find({});
            res.send(clients);
        }
        catch (e) {
            res.send({ e })
        }
    }

    //Create a new account and log in
    async newClient(req, res) {
        let { name, email, password, password2, plantNotif, newsNotif } = req.body;

        try {
            ensureDbReady();
        } catch (e) {
            return res.status(503).send({ ok: false, payload: 'Database unavailable' });
        }

        if (!name || !email || !password || !password2) {
            return res.send({ ok: false, payload: 'All fields required' });
        }
        if (password !== password2) {
            return res.send({ ok: false, payload: 'Passwords must match' });
        }
        if (!validator.isEmail(email)) {
            return res.send({ ok: false, payload: 'Email invalid' });
        }

        try {
            const existingClient = await client.findOne({ email });
            if (existingClient) {
                return res.status(409).send({ ok: false, payload: 'Email already registered' });
            }

            const hash = await bcrypt.hash(password, 10);
            const newClient = await client.create({
                name: name,
                email: email,
                password: hash,
                last_log: Date.now(),
                plant_notif: plantNotif,
                news_notif: newsNotif
            })
            const token = jwt.sign({ id: newClient._id, email: newClient.email }, jwt_secret, { expiresIn: "1h" });
            return res.send({ ok: true, payload: `Client ${name} added successfully`, token, email, id: newClient._id })
        } catch (e) {
            console.log(e);
            if (e.code === 11000 || e.name === 'MongoServerError') {
                return res.status(409).send({ ok: false, payload: 'Email already registered' });
            }
            return res.status(500).send({ ok: false, payload: 'Unable to register client' });
        }
    }

    //Log In
    async login(req, res) {
        let { email, password } = req.body;

        try {
            ensureDbReady();
        } catch (e) {
            return res.status(503).send({ ok: false, payload: 'Database unavailable' });
        }

        if (!email || !password) {
            return res.send({ ok: false, payload: 'All fields required' });
        }
        if (!validator.isEmail(email)) {
            return res.send({ ok: false, payload: 'Email invalid' });
        }
        try {
            const clients = await client.findOne({ email });
            if (!clients) {
                return res.status(401).send({ ok: false, payload: 'Invalid credentials' });
            }

            const match = await bcrypt.compare(password, clients.password);
            if (!match) {
                return res.status(401).send({ ok: false, payload: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: clients._id, email: clients.email }, jwt_secret, { expiresIn: "1h" });
            await client.findOneAndUpdate({ email: clients.email }, { last_log: Date.now() });
            return res.send({ ok: true, payload: `Welcome back`, token, email, id: clients._id });
        } catch (e) {
            console.log(e);
            res.send({ ok: false, payload: e })
        }
    }

    //Verify_token
    async verifyToken(req, res) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ ok: false, payload: 'Token missing' });
        }

        jwt.verify(token, jwt_secret, (err, succ) => {
            if (err) {
                return res.status(401).json({ ok: false, payload: 'Invalid or expired token' });
            }
            return res.json({ ok: true, succ });
        });
    };

    //Acces client info 
    async clientInfo(req, res) {
        try {
            ensureDbReady();
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).send({ ok: false, payload: 'Token missing' });
            }
            const decoded = jwt.verify(token, jwt_secret);
            const clientInfo = await client.findOne({ email: decoded.email }).select('-password');

            if (!clientInfo) {
                return res.status(404).send({ ok: false, payload: 'User not found' });
            }
            res.send({ ok: true, payload: clientInfo });
        } catch (e) {
            console.log(e);
            if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
                return res.status(401).send({ ok: false, payload: 'Invalid or expired token' });
            }
            return res.status(500).send({ ok: false, payload: 'Something went wrong' });
        }
    }
}
module.exports = new ClientsController();