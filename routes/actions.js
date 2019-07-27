const express = require('express');

const actionsController = require('../controllers/actions');

const { body } = require('express-validator/check');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

router.get('/tabatas', isAuth, actionsController.getTabatas);

router.post('/tabata', [
    body('name')
        .isLength({ min: 1 })
        .withMessage('Name must be at least of length 1'),
    body('work')
        .isNumeric()
        .withMessage('Work must be a number'),
    body('rest')
        .isNumeric()
        .withMessage('Work must be a number'),
    body('rounds')
        .isNumeric()
        .withMessage('Work must be a number'),
    body('prepare')
        .isNumeric()
        .withMessage('Work must be a number')

], isAuth, actionsController.postTabata);

router.get('/tabata/:tabataId', isAuth, actionsController.getTabata);

router.delete('/tabata/:tabataId', isAuth, actionsController.deleteTabata);

router.put('/tabata/:tabataId', isAuth, actionsController.updateTabata);

module.exports = router;