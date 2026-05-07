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

    //Add Product
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
                await client.create({
                    name: name,
                    email: email,
                    password: hash,
                    plant_notif: plantNotif,
                    news_notif: newsNotif
                })
                res.send({ ok: true, payload: `Client ${name} added successfully` })
            } else {
                res.send({ ok: true, payload: 'Invalid credentials' })
            }
        } catch (e) {
            console.log(e);
            res.send({ ok: false, payload: e })
        }
    }

    async login(req, res) {
        let { name, email, plantNotif, newsNotif } = req.body;
        try {
            const clients = await client.findOne({ email: email });
            if (!clients) {
                await client.create({ name: name, email: email, plant_notif: plantNotif, news_notif: newsNotif })
                res.send({ ok: true, payload: `Client ${name} added successfully` })
            } else {
                res.send({ ok: true, payload: 'This email is already being used' })
            }
        } catch (e) {
            console.log(e);
            res.send({ ok: false, payload: e })
        }
    }

    async verTok(req, res) {
        let { name, email, plantNotif, newsNotif } = req.body;
        try {
            const clients = await client.findOne({ email: email });
            if (!clients) {
                await client.create({ name: name, email: email, plant_notif: plantNotif, news_notif: newsNotif })
                res.send({ ok: true, payload: `Client ${name} added successfully` })
            } else {
                res.send({ ok: true, payload: 'This email is already being used' })
            }
        } catch (e) {
            console.log(e);
            res.send({ ok: false, payload: e })
        }
    }
};
module.exports = new ClientsController();