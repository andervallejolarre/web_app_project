const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/adminsController.js');

//Admin purpose
//router.get('/', controller.findAll);

//Client routes
router.post('/new-plant-type', controller.newPlantType);

//App routes
//router.get('/plant-info', controller.plantInfo);
//router.get('/weather', controller.weatherCommunication);

module.exports = router;