const plant = require('../models/plantModel.js');
const client = require('../models/clientModel.js');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId

const jwt_secret = process.env.JWT_SECRET;

class PlantsController {
    async findAll(req, res) {
        try {
            const plants = await plant.find({});
            res.send(plants);
        }
        catch (e) {
            res.send({ e })
        }
    }

    async newPlant(req, res) {
        let { email, type } = req.body;
        try {
            const clientId = await client.findOne({ email });
            if (clientId) {
                await plant.create({
                    type: type,
                    owner: new ObjectId(clientId._id),
                    hidration: 0,
                    nutrients: 0,
                    protection: false,
                    stress: 0,
                    progress: 20,
                    level: 0,
                })
                res.send({ ok: true, payload: `Plant created` })
            } else {
                res.send({ ok: true, payload: 'First create an account' })
            }
        } catch (e) {
            console.log(e);
            res.send({ ok: false, payload: 'You already have a plant! Go and take care of it' })
        }
    }
    //Acces plant info through client _id stored in token
        async plantInfo(req, res) {
            try {
                const token = req.headers.authorization;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const plantData = await plant.findOne({ owner: decoded.id }).select('-_id -__v -owner');
    
                if (!plant) {
                    return res.status(404).send({ ok: false, payload: 'Plant not found' });
                }
                res.send({ ok: true, payload: plantData });
            } catch (e) {
                console.log(e);
                if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
                    return res.status(401).send({ ok: false, payload: 'Invalid or expired token' });
                }
                res.send({ ok: false, payload: 'Something went wrong' });
            }
        }
};

module.exports = new PlantsController();