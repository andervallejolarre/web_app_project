require('dotenv').config();

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    cors = require('cors'),
    port = process.env.PORT || 4040;

const adminsRoute = require('./routes/adminsRoute.js')
const clientsRoute = require('./routes/clientsRoute.js')
const plantsRoute = require('./routes/plantsRoute.js')

mongoose.set('debug', true)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

async function connecting() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to the DB')
    } catch (e) {
        console.log('EROR: Seems like your DB is not running')
    }
}
app.use('/api/admin', adminsRoute);
app.use('/api/client', clientsRoute);
app.use('/api/plant', plantsRoute);

connecting().then(() => {
    app.listen(port, () => console.log(`listening on port ${port}`))
})