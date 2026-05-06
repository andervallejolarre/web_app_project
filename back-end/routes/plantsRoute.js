const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/plantsController.js');

router.get('/', controller.findAll);

module.export = router;