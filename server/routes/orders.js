const router = require('express').Router();
const auth   = require('../middleware/auth');
const { createOrder, getOrder } = require('../controllers/ordersController');

router.post('/',    createOrder);
router.get('/:id',  auth, getOrder);

module.exports = router;
