const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plantsSchema = new Schema({
    plant:String
},

{strictQuery: false})

module.export = mongoose.model('plants', plantsSchema)