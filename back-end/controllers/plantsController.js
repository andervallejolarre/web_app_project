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
                    hidration: false,
                    nutrients: false,
                    protection: false,
                    stress: 0,
                    progress: 50,
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
            const plantData = await plant.findOne({ owner: decoded.id }).select('-_id -__v -owner -type');

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

    //Weather Communication
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

    //Acces plant type info and print it
    async globalBalance(req, res) {
        try {
            const token = req.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const weather = req.body
            const plantData = await plant.findOne({ owner: decoded.id }).select('-_id -__v -owner');
            const plantTypeData = await plantType.findOne({ type: plantData.type }).select('-_id -__v');

            if (plantTypeData || weather || plantData) {

                let progress = 0;

                let tempBalance = true;
                let humidityBalance = true;
                let radiationBalance = true;

                let highTemperatures = false;
                let lowTemperatures = false;

                let highHumidity = false;
                let lowHumidity = false;

                let highRadiation = false;
                let lowRadiation = false;

                let overIrrigation = false;
                let overNutrients = false;
                let overProtect = false;

                let tempSentence = '';
                let humSentence = '';
                let radSentence = '';

                //Checking Temperatures
                if ((weather.Avg_Max_Temperature <= plantTypeData.max_temp && weather.Avg_Max_Temperature >= plantTypeData.min_temp) && (weather.Avg_Min_Temperature >= plantTypeData.min_temp && weather.Avg_Min_Temperature < plantTypeData.max_temp)) {
                    progress += 10;
                    tempBalance = true;
                    highTemperatures = false;
                    lowTemperatures = false;
                    tempSentence += 'in between'
                } else if (weather.Avg_Max_Temperature > plantTypeData.max_temp && weather.Avg_Min_Temperature > plantTypeData.min_temp) {
                    progress -= 5;
                    tempBalance = false;
                    highTemperatures = true;
                    lowTemperatures = false;
                    tempSentence += 'above'
                } else if (weather.Avg_Max_Temperature < plantTypeData.max_temp && weather.Avg_Min_Temperature < plantTypeData.min_temp) {
                    progress -= 5;
                    tempBalance = false;
                    highTemperatures = false;
                    lowTemperatures = true;
                    tempSentence += 'below'
                }

                //Checking Humidity Balance
                if (weather.Avg_Humidity >= plantTypeData.min_humidity && weather.Avg_Humidity <= plantTypeData.max_humidity) {
                    progress += 10;
                    humidityBalance = true;
                    highHumidity = false;
                    lowHumidity = false;
                    humSentence += 'in between'
                } else if (weather.Avg_Humidity > plantTypeData.max_humidity) {
                    progress -= 10;
                    humidityBalance = false;
                    highHumidity = true;
                    lowHumidity = false;
                    humSentence += 'above'
                } else if (weather.Avg_Humidity < plantTypeData.min_humidity) {
                    progress -= 10;
                    humidityBalance = false;
                    highHumidity = false;
                    LowHumidity = true;
                    humSentence += 'below'
                }

                //Checking Radiation Balance
                if (weather.Avg_UV_Index >= plantTypeData.min_radiation && weather.Avg_UV_Index <= plantTypeData.max_radiation) {
                    progress += 10;
                    radiationBalance = true;
                    highRadiation = false;
                    lowRadiation = false;
                    radSentence += 'in between'
                } else if (weather.Avg_UV_Index > plantTypeData.max_radiation) {
                    progress -= 10;
                    radiationBalance = false;
                    highRadiation = true;
                    lowRadiation = false;
                    radSentence += 'above'
                } else if (weather.Avg_UV_Index < plantTypeData.min_radiation) {
                    progress -= 10;
                    radiationBalance = false;
                    highRadiation = false;
                    lowRadiation = true;
                    radSentence += 'below'
                }

                //Checking User Actions
                //Hidration ON
                if (plantData.hidration && ((tempBalance && humidityBalance && radiationBalance) || (highTemperatures && highRadiation) || (lowHumidity && tempBalance && radiationBalance))) {
                    progress += 10;
                    overIrrigation = false;
                } else if (plantData.hidration) {
                    progress -= 10;
                    overIrrigation = true;
                }

                //Nutrients ON
                if (plantData.nutrients && ((tempBalance && humidityBalance && radiationBalance) || (highTemperatures && radiationBalance))) {
                    progress += 10;
                    overNutrients = false;
                } else if (plantData.nutrients) {
                    progress -= 10;
                    overNutrients = true;
                }

                //Protection ON
                if (plantData.protection && ((highTemperatures && highRadiation && highHumidity) || (lowTemperatures && lowRadiation))) {
                    progress += 10;
                    overProtect = false;
                } else if (plantData.protection) {
                    progress -= 10;
                    overProtect = true;
                }

                //Let's Build the Balance Message
                const finalMessage = {
                    message1: '',
                    message2: `Temperatures are ${tempSentence} ideal levels.`,
                    message3: `Humidity is ${humSentence} ideal levels.`,
                    message4: `Radiation is ${radSentence} ideal levels.`,
                }

                if (progress >= 15) {
                    finalMessage.message1 += `Your plant is doing great!`
                } else if (progress > 0 && progress < 15) {
                    finalMessage.message1 += 'Your plant just made it through this days!'
                } else if (progress <= 0) {
                    finalMessage.message1 += `Your plant is having some trouble progressing!`
                }

                res.send({ ok: true, payload: finalMessage });
            } else {
                return res.status(404).send({ ok: false, payload: 'Missing Data' });
            }
        } catch (e) {
            if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
                return res.status(401).send({ ok: false, payload: 'Invalid or expired token' });
            }
            res.send({ ok: false, payload: 'Something went wrong' });
        }
    }
};

module.exports = new PlantsController();