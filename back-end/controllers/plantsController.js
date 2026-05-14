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
                    updated: Date.now(),
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
            const plantData = await plant.findOne({ owner: decoded.id }).select('-_id -__v -owner -type -updated');

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

    //Acces plant type info, weather info and plant info and calculate the period balance of the plant
    async globalBalance(req, res) {
        try {
            const token = req.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const weather = req.body
            const plantData = await plant.findOne({ owner: decoded.id }).select('-_id -__v -owner');
            const plantTypeData = await plantType.findOne({ type: plantData.type }).select('-_id -__v');

            if (plantTypeData && weather && plantData) {

                let progress = 0;
                let stress = 0;
                let avgPlantTypeTemp = (plantTypeData.max_temp + plantTypeData.min_temp) / 2;
                let avgWeatherTemp = (weather.Avg_Max_Temperature + weather.Avg_Min_Temperature) / 2;

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

                let actionSentence = '';
                let recommendationSentence = '';

                //Checking Temperatures
                if ((weather.Avg_Max_Temperature <= plantTypeData.max_temp && avgWeatherTemp >= plantTypeData.min_temp) || (weather.Avg_Min_Temperature >= plantTypeData.min_temp && avgWeatherTemp >= plantTypeData.max_temp)) {
                    progress += 10;
                    tempBalance = true;
                    highTemperatures = false;
                    lowTemperatures = false;
                    tempSentence += 'in between'
                } else if (weather.Avg_Max_Temperature > plantTypeData.max_temp && weather.Avg_Min_Temperature > avgPlantTypeTemp) {
                    progress -= 5;
                    stress -= 5;
                    tempBalance = false;
                    highTemperatures = true;
                    lowTemperatures = false;
                    tempSentence += 'above'
                } else if (weather.Avg_Max_Temperature < plantTypeData.max_temp && weather.Avg_Min_Temperature < avgPlantTypeTemp) {
                    progress -= 5;
                    stress -= 5;
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
                    stress -= 5;
                    humidityBalance = false;
                    highHumidity = true;
                    lowHumidity = false;
                    humSentence += 'above'
                } else if (weather.Avg_Humidity < plantTypeData.min_humidity) {
                    progress -= 10;
                    stress -= 5;
                    humidityBalance = false;
                    highHumidity = false;
                    lowHumidity = true;
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
                    stress -= 5;
                    radiationBalance = false;
                    highRadiation = true;
                    lowRadiation = false;
                    radSentence += 'above'
                } else if (weather.Avg_UV_Index < plantTypeData.min_radiation) {
                    progress -= 10;
                    stress -= 5;
                    radiationBalance = false;
                    highRadiation = false;
                    lowRadiation = true;
                    radSentence += 'below'
                }

                //Checking User Actions
                //Hidration ON/OFF
                if (plantData.hidration && ((tempBalance && humidityBalance && radiationBalance) || (highTemperatures && highRadiation && !plantData.protection) || (lowHumidity && tempBalance && radiationBalance))) {
                    progress += 10;
                    overIrrigation = false;
                } else if (plantData.hidration) {
                    progress -= 10;
                    stress -= 5;
                    overIrrigation = true;
                    actionSentence += 'Stop watering, '
                }

                //Nutrients ON/OFF
                if (plantData.nutrients && ((tempBalance && radiationBalance) || (highTemperatures && radiationBalance) || (tempBalance && humidityBalance && highRadiation))) {
                    progress += 10;
                    overNutrients = false;
                } else if (plantData.nutrients) {
                    progress -= 10;
                    stress -= 5;
                    overNutrients = true;
                    actionSentence += 'Stop adding nutrients, '
                }

                //Protection ON/OFF
                if (plantData.protection && ((highTemperatures && highRadiation) || (lowTemperatures && lowRadiation))) {
                    progress += 10;
                    overProtect = false;
                } else if (plantData.protection) {
                    progress -= 10;
                    stress -= 5;
                    overProtect = true;
                    actionSentence += 'Take the protection off, '
                }

                //Let's Build the Balance Message
                const finalMessage = {
                    message1: '',
                    message2: {},
                    message3: {},
                }

                //First message about the progress of the plant 
                if (progress >= 15) {
                    finalMessage.message1 += `Your plant is doing great!`
                } else if (progress > 0 && progress < 15) {
                    finalMessage.message1 += 'Your plant just made it through this days!'
                } else if (progress <= 0) {
                    finalMessage.message1 += `Your plant is having some trouble progressing!`
                }

                //Second message about weather analysis based on plant type necessities
                const message2 = {
                    sentence1: `Temperatures are ${tempSentence} ideal levels.`,
                    sentence2: `Humidity is ${humSentence} ideal levels.`,
                    sentence3: `Radiation is ${radSentence} ideal levels.`,
                };

                finalMessage.message2 = message2;

                //Third message with some recommendations

                if (!plantData.hidration && ((tempBalance && humidityBalance && radiationBalance) || (highTemperatures && highRadiation && !plantData.protection) || (lowHumidity && tempBalance && radiationBalance))) {
                    recommendationSentence += `Try adding some water to your plant, `
                }
                if (!plantData.nutrients && ((tempBalance && radiationBalance) || (highTemperatures && radiationBalance) || (tempBalance && humidityBalance && highRadiation))) {
                    recommendationSentence += `Try adding some nutrients to your plant, `
                }
                if (!plantData.protection && ((highTemperatures && highRadiation) || (lowTemperatures && lowRadiation))) {
                    recommendationSentence += `Try adding some protection to your plant, `
                }

                const message3 = {
                    sentence1: actionSentence.length > 0 ? actionSentence.slice(0, -2) : '',
                    sentence2: recommendationSentence.length > 0 ? recommendationSentence.slice(0, -2) : '',
                }

                finalMessage.message3 = message3;

                //Finally, if the minimum time to update plant data has passed, we update progress,level and stress before sending back the finalMessage
                const minUpdateTime = Number(plantData.updated) + (24 * 60 * 60 * 1000);

                if (Date.now() >= minUpdateTime) {
                    let calc = plantData.progress + progress;
                    let level = 0;
                    if (calc >= 0) {
                        level = plantData.level + Math.floor(calc / 100);
                        calc %= 100;
                    } else if (calc < 0) {
                        if (plantData.level > 0) {
                            level = plantData.level - 1;
                            calc += 100;
                        } else {
                            level = 0;
                            calc = 0;
                        }
                    }
                    await plant.updateOne({ owner: decoded.id }, { progress: calc, level: level, stress: stress, update: Date.now() })
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

    async takeAction(req, res) {
        if (req.body) {
            try {
                const token = req.headers.authorization;
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                await plant.updateOne({ owner: decoded.id }, { hidration: req.body.hidration, nutrients: req.body.nutrients, protection: req.body.protection })
                res.send({ ok: true, payload: 'Data updated' });

            } catch (e) {
                if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
                    return res.status(401).send({ ok: false, payload: 'Invalid or expired token' });
                }
                res.send({ ok: false, payload: 'Something went wrong' });
            }
        } else {
            return res.status(404).send({ ok: false, payload: 'Something went wrong' });
        }
    }
};

module.exports = new PlantsController();