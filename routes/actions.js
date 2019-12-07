const express = require('express');
const actionsController = require('../controllers/actions');
const { body } = require('express-validator/check');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/verify-firebase-token');

router.get('/tabatas', verifyFirebaseToken.verify, actionsController.getTabatas);

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

], verifyFirebaseToken.verify, actionsController.postTabata);

router.get('/tabata/:tabataId', verifyFirebaseToken.verify, actionsController.getTabata);

router.delete('/tabata/:tabataId', verifyFirebaseToken.verify, actionsController.deleteTabata);

router.put('/tabata/:tabataId', [
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

], verifyFirebaseToken.verify, actionsController.updateTabata);

module.exports = router;