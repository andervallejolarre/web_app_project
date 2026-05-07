const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantsSchema = new Schema({
    name: { type: String, required: true},
    type: { type: String, required: true},
    owner: {type: Schema.Types.ObjectId, required: true, unique: false, ref: 'categories'},
    hidration: {type: Number, required: true},
    nutrients: {type: Number, required: true},
    protection: {type: Boolean, required: true},
    stress: {type: Number, required: true},
    progress: {type: Number, required: true},
    level: {type: Number, required: true},
})

module.exports = mongoose.model('plants', plantsSchema)