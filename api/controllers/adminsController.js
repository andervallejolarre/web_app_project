const plantType = require('../models/plantTypeModel.js');

class AdminsController {

    async newPlantType(req, res) {
        let { type, maxT, minT, maxH, minH, maxR, minR } = req.body;
        try {
            const exists = await plantType.findOne({ type });
            if (!exists) {
                await plantType.create({
                    type: type,
                    max_temp: maxT,
                    min_temp: minT,
                    max_humidity: maxH,
                    min_humidity: minH,
                    max_radiation: maxR,
                    min_radiation: minR,
                })
                res.send({ ok: true, payload: `Plant Type created` })
            } else {
                res.send({ ok: true, payload: 'Plant Type Already Exists' })
            }
        } catch (e) {
            console.log(e);
            res.send({ ok: false, payload: 'Something went wrong' })
        }
    }
}

module.exports = new AdminsController();