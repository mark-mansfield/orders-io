const express = require('express');
const router = express.Router();
const DishController = require('../controllers/dishes');

const checkAuth = require('../middlewear/check-auth');

// see controller files for methods

// save new dish
router.post('', checkAuth, DishController.createDish);

// // update dish
// router.put('/:id', checkAuth, DishController.updateDish);

// // get dishes
// router.get('', checkAuth, DishController.getDishes);

// // get dish
// router.get('/:id', DishController.getDish);

// // delete  dish
// router.delete('/:id', checkAuth, DishController.deleteDish);

// // export the router
module.exports = router;
