const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientsSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    //last_log: {type: String, require:true},
    plant_notif: { type: Boolean, require: true },
    news_notif: { type: Boolean, require: true },
},

    { timestamps: true })

module.exports = mongoose.model('clients', clientsSchema);