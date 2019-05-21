const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menus');

const checkAuth = require('../middlewear/check-auth');
// see controller files for methods

// save new menu
// old route with a files checker in the middlewear('', checkAuth , extractFile , MenuController.createmenu)
// create Menu
router.post('/create', checkAuth, MenuController.createMenu);

// update menu
router.put('/:id', checkAuth, MenuController.updateMenu);

// get menus
router.get('', checkAuth, MenuController.getMenus);

// get menu
router.get('/:id', MenuController.getMenu);

// delete  menu
router.delete('/:id', checkAuth, MenuController.deleteMenu);

// export the router
module.exports = router;
