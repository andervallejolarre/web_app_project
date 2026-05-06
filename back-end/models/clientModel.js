const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const clientsSchema = new Schema({
    client:String
},

{strictQuery: false})

module.export = mongoose.model('clients', clientsSchema);