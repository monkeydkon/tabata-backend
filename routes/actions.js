const express = require('express');

const actionsController = require('../controllers/actions');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

router.get('/tabatas', isAuth, actionsController.getTabatas);

router.get('/tabata/:tabataId', isAuth, actionsController.getTabata);

router.post('/tabata', isAuth, actionsController.postTabata);

module.exports = router;