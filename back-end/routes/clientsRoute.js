const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/clientsController.js');

router.get('/', controller.findAll);

module.export = router;