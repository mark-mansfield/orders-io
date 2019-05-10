// we need to access our models
const Dish = require('../models/menu');

exports.createDish = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const dish = new Dish({
    _id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    portion_sizes: req.body.portion_sizes,
    course: req.body.course
  });

  // mongoose  automatically creates the collection based upon the Model name it used during Models.exports for this object use node
  dish
    .save()
    .then(createdDish => {
      if (createdDish) {
        res.status(200).json({
          message: 'Dish Added',
          dish: {
            id: createdDish._id, // remap id mongo adds _id property
            title: createdDish.title,
            description: createdDish.description,
            portion_sizes: createdDish.portion_sizes,
            course: createdDish.course
          }
        });
      } else {
        res.status(201).json({ message: 'Dish Not Added' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: `Creating this dish failed ${error}`
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
    description: req.body.description,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Menu.updateOne(
    {
      _id: req.params.id,
      creator: req.userData.userId
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
  Menu.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
