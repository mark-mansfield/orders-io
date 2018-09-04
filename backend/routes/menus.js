const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menus');

const checkAuth = require('../middlewear/check-auth');
const extractFile = require('../middlewear/file');
// see controller files for methods

// save new menu
router.post('', checkAuth , extractFile , MenuController.createmenu);

// update menu
router.put('/:id' , checkAuth ,extractFile ,  MenuController.updateMenu);

// get menus
router.get( '', checkAuth , MenuController.getMenus );

// get menu
router.get( '/:id', MenuController.getMenu);

// delete  menu
router.delete('/:id' ,checkAuth , MenuController.deleteMenu );

// export the router
module.exports = router;
