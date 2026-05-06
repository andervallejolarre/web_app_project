const client = require('../models/clientModel.js');

class ClientsController{
    async findAll(req, res){
        try{
            const clients = await client.find({});
            res.send(clients);
        }
        catch(e){
            res.send({e})
        }
    }
};

module.exports = new ClientsController();