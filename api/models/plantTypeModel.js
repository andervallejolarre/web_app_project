const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantTypeSchema = new Schema({
    type: { type: String, required: true, unique: true},
    max_temp: {type: Number, required: true},
    min_temp: {type: Number, required: true},
    max_humidity: {type: Number, required: true},
    min_humidity: {type: Number, required: true},
    max_radiation: {type: Number, required: true},
    min_radiation: {type: Number, required: true},
})

module.exports = mongoose.model('plantType', plantTypeSchema)