require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const express = require('express'),
    path = require('path'),
    app = express(),
    mongoose = require('mongoose'),
    cors = require('cors'),
    port = process.env.PORT || 4040;

const awaitConnect = require('./middleware/awaitConnect.js');
const adminsRoute = require('./routes/adminsRoute.js')
const clientsRoute = require('./routes/clientsRoute.js')
const plantsRoute = require('./routes/plantsRoute.js')

mongoose.set('debug', true)

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/*
async function connecting() {
    if (!process.env.MONGO_URL) {
        console.log('EROR: MONGO_URL is missing');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
        console.log('Connected to the DB')
    } catch (e) {
        console.log('EROR: Could not connect to the DB', e.message)
    }
}

connecting();
*/
app.use(awaitConnect);

app.use('/api/admin', adminsRoute);
app.use('/api/client', clientsRoute);
app.use('/api/plant', plantsRoute);

module.exports = app;

if (process.env.NODE_ENV !== 'production') {

  // Serve static files from the dist directory
  app.use(express.static(path.resolve(__dirname, '..', 'dist')));
  // Serve index.html for all other requests
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
  });
  // Start the server
  app.listen(port, () => console.log("🚀 Listening on port: " + port + " 🚀"));
}
/*
connecting().then(() => {
    app.listen(port, () => console.log(`listening on port ${port}`))
})*/