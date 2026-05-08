const client = require('../models/clientModel.js');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const jwt_secret = process.env.JWT_SECRET;


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
            const clients = await client.findOne({ email });
            if (!clients) {
                const hash = await argon2.hash(password);
                const newClient = await client.create({
                    name: name,
                    email: email,
                    password: hash,
                    plant_notif: plantNotif,
                    news_notif: newsNotif
                })
                const token = jwt.sign(newClient.toJSON(), jwt_secret, { expiresIn: "1h" });
                res.send({ ok: true, payload: `Client ${name} added successfully`, token, email })
            } else {
                res.send({ ok: false, payload: 'Invalid credentials' })
            }
        } catch (e) {
            console.log(e);
            res.send({ ok: false, payload: e })
        }
    }

    //Log In
    async login(req, res) {
        let { email, password } = req.body;
        if ( !email || !password) {
            return res.send({ ok: false, payload: 'All fields required' });
        }
        if (!validator.isEmail(email)) {
            return res.send({ ok: false, payload: 'Email invalid' });
        }
        try {
            const clients = await client.findOne({ email });
            console.log(clients);
            if (clients) {
                const match = await argon2.verify (clients.password, password);
                if (match){
                    const token = jwt.sign(clients.toJSON(), jwt_secret, { expiresIn: "1h" });
                    res.send({ ok: true, payload: `Welcome back`, token, email })
                } else {
                    res.send({ ok: false, payload: 'Invalid credentials' })
                }
            } else {
                res.send({ ok: false, payload: 'Invalid credentials' })
            }
        } catch (e) {
            console.log(e);
            res.send({ ok: false, payload: e })
        }
    }

    //Verify_token
    async verifyToken (req, res) {
        const token = req.headers.authorization;
        jwt.verify(token, jwt_secret, (err, succ) =>{
            err ?
            res.json({ok: false, payload: 'Something went wrong'})
            : res.json({ok: true, succ });
        })
    };
};
module.exports = new ClientsController();