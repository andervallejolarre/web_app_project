const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/clientsController.js');

router.get('/', controller.findAll);

router.post('/new', controller.newClient);
router.post('/login', controller.login);
router.post('/verify_token', controller.verTok);


module.exports = router;