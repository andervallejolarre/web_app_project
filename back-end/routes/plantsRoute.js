const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/plantsController.js');

router.get('/', controller.findAll);
router.post('/new', controller.newPlant);
router.get('/plant-info', controller.plantInfo);

module.exports = router;