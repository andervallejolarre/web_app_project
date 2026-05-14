const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientsSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    last_log: {type: String, required:true},
    plant_notif: { type: Boolean, required: true },
    news_notif: { type: Boolean, required: true },
},

    { timestamps: true })

module.exports = mongoose.model('clients', clientsSchema);