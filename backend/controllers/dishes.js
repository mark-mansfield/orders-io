// we need to access our models
const Dish = require('../models/dish');

exports.createDish = (req, res, next) => {
  const newDish = new Dish(req.body);
  console.log('new dish: ', newDish);
  newDish
    .save()
    .then(createdDish => {
      if (createdDish) {
        res.status(200).json({
          message: '0',
          dish: createdDish
        });
      } else {
        res.status(201).json({ message: '1' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Creating a dish Failed!: 500'
      });
    });
};

exports.updateDish = (req, res, next) => {
  const newDish = new Dish(req.body);
  console.log('updating dish: ', newDish);
  Dish.updateOne(
    {
      _id: newDish.id
    },
    newDish
  )
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: true });
      } else {
        res.status(401).json({ message: 'Not Authorized!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't Update Dish!"
      });
    });
};

exports.getDishes = (req, res, next) => {
  Dish.find()
    .then(documents => {
      // return json object with status code
      res.status(200).json({
        message: 'dishes fetched successfully',
        dishes: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching dishes Failed!'
      });
    });
};

exports.deleteDish = (req, res, next) => {
  Dish.deleteOne({ _id: req.params.id })
    .then(result => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: '0' });
      } else {
        res.status(401).json({ message: '1' });
      }
    })
    .catch(error => {
      // console.log(error);
      res.status(500).json({
        message: 'Deleting dish Failed: 500!'
      });
    });
};
