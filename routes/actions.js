const express = require('express');

const actionsController = require('../controllers/actions');

const router = express.Router();

const isAuth = require('../middleware/is-auth');



router.get('/tabatas', isAuth, actionsController.getTabatas);

router.post('/tabata', isAuth, actionsController.postTabata);

router.get('/tabata/:tabataId', isAuth, actionsController.getTabata);




module.exports = router;