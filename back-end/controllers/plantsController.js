const plant = require('../models/plantModel.js');

class PlantsController{
    async findAll(req, res){
        try{
            const plants = await plant.find({});
            res.send(plants);
        }
        catch(e){
            res.send({e})
        }
    }
};

module.exports = new PlantsController();