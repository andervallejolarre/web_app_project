const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/plantsController.js');

//Admin purpose
router.get('/', controller.findAll);

//Client routes
router.post('/new', controller.newPlant);

//App routes
router.get('/plant-info', controller.plantInfo);
router.get('/plant-type-info', controller.plantTypeInfo);
router.get('/weather', controller.weatherCommunication);
//router.get('/balance', controller.globalBalance);

module.exports = router;