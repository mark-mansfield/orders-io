// we need to access our models
const Menu = require('../models/menu');

// create Menu
exports.createMenu = (req, res, next) => {
  const newMenu = new Menu(req.body);
  console.log('new menu: ', newMenu);
  newMenu
    .save()
    .then(createdMenu => {
      if (createdMenu) {
        res.status(200).json({
          message: 'Menu Added',
          order: createdMenu
        });
      } else {
        res.status(201).json({ message: 'Menu Not Added' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Creating a menu Failed!'
      });
    });
};

exports.updateMenu = (req, res, next) => {
  let imagePath = req.body.imagePath; // the string already defined in this menu
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const menu = new Menu({
    _id: req.body.id,
    title: req.body.title,
    items: req.body.items,
    description: req.body.description
  });
  Menu.updateOne(
    {
      _id: req.params.id
    },
    menu
  )
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Menu updated successfully' });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't Update Menu!"
      });
    });
};

exports.getMenus = (req, res, next) => {
  Menu.find()
    .then(documents => {
      // return json object with status code
      res.status(200).json({
        message: 'menus fetched successfully',
        menus: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching Menus Failed!'
      });
    });
};

exports.getMenu = (req, res, next) => {
  Menu.findById(req.params.id)
    .then(menu => {
      if (menu) {
        res.status(200).json(menu);
      } else {
        res.status(404).json({ message: 'Menu not found.' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching Menu Failed!'
      });
    });
};

exports.deleteMenu = (req, res, next) => {
  Menu.deleteOne({ _id: req.params.id })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: 'deletion successful' });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Deleting Menus Failed!'
      });
    });
};
