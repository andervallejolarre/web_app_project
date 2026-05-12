const client = require('../models/clientModel.js');
const plant = require('../models/plantModel.js');
const plantType = require('../models/plantTypeModel.js');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId
const axios = require('axios');

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

    //Acces plant type info and print it
    async plantTypeInfo(req, res) {
        try {
            const token = req.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const plantData = await plant.findOne({ owner: decoded.id }).select('type');
            const plantTypeData = await plantType.findOne({ type: plantData.type }).select('-_id -__v');

            if (!plantTypeData) {
                return res.status(404).send({ ok: false, payload: 'Plant Type not found' });
            }
            res.send({ ok: true, payload: plantTypeData });
        } catch (e) {
            if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
                return res.status(401).send({ ok: false, payload: 'Invalid or expired token' });
            }
            res.send({ ok: false, payload: 'Something went wrong' });
        }
    }

    //Weather weatherCommunication
    async weatherCommunication(req, res) {
        try {
            const { latitude, longitude } = req.query
            if (!latitude || !longitude) {
                return res.status(404).send({ ok: false, payload: 'Incomplete Data' });
            }
            //const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&hourly=direct_radiation&timezone=auto&forecast_days=1`;
            const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max&hourly=relative_humidity_2m&forecast_days=7&timezone=auto`;
            const message = await axios.get(weatherURL);

            const daily = message.data.daily;
            const relHum = message.data.hourly.relative_humidity_2m.reduce((a, b) => a + b, 0);

            let weatherData = {
                Avg_Max_Temperature: Math.round((daily.temperature_2m_max.reduce((a, b) => a + b, 0)) / 7),
                Avg_Min_Temperature: Math.round((daily.temperature_2m_min.reduce((a, b) => a + b, 0)) / 7),
                Avg_Humidity: Math.round(relHum / 168),
                Avg_UV_Index: Math.round((daily.uv_index_max.reduce((a, b) => a + b, 0)) / 7),
                Avg_Precipitation: Math.round((daily.precipitation_sum.reduce((a, b) => a + b, 0)) / 7)
            };
            res.send({ ok: true, payload: weatherData });
        } catch (e) {
            console.log(e);
            res.send({ ok: false, payload: "Weather API error" });
        }
    }
};

module.exports = new PlantsController();