const router = require('express').Router();
const auth   = require('../middleware/auth');
const {
  listTours, getTour, createTour, updateTour, deleteTour
} = require('../controllers/toursController');

router.get('/',     listTours);
router.get('/:id',  getTour);
router.post('/',    auth, createTour);
router.put('/:id',  auth, updateTour);
router.delete('/:id', auth, deleteTour);

module.exports = router;
