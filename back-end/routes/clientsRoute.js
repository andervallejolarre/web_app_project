const express = require('express'),
    router = express.Router(),
    controller = require('../controllers/clientsController.js');

//Admin purpose
router.get('/', controller.findAll);

//Account Settings
router.post('/new', controller.newClient);
router.post('/login', controller.login);
router.post('/verify_token', controller.verifyToken);

//Render and calculation process
router.get('/clientInfo/:id', controller.clientInfo);

module.exports = router;