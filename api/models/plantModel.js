const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const plantsSchema = new Schema({
    type: { type: String, required: true},
    owner: {type: Schema.Types.ObjectId, required: true, unique: false, ref: 'categories'},
    updated: {type: String, required: true},
    hidration: {type: Boolean, required: true},
    nutrients: {type: Boolean, required: true},
    protection: {type: Boolean, required: true},
    stress: {type: Number, required: true},
    progress: {type: Number, required: true},
    level: {type: Number, required: true},
    firstVisit: {type: Boolean, required: true}
})

module.exports = mongoose.model('plants', plantsSchema)