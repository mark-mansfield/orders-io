const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10 )
  .then(hash => {
    console.log("hash = " + hash);
    const newUser = new User({
      email: req.body.email,
      password : hash
    });
    newUser.save()
    .then(result => {
      res.status(201).json({
        message: 'User Created',
        result: result
      });
    })
    .catch(err => {
      //console.log(err);
      res.status(500).json({
          message: 'Invalid Authentication credentials'
        });
    });
  })

};



exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email}).then(user => {

    if (!user) {
      return res.status(401).json({
        message: 'Username is incorrect!'
      })
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Username or password is incorrect!'
      })
    }

    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    console.log(token);
    //. send token to front end
    res.status(200).json(
    {
      expiresIn: 3600,
      token: token,
      userId: fetchedUser._id
    });
  })
  .catch (err => {
    console.log(err);
    return res.status(401).json({
      message: 'Authentication Failed for technical reasons!'
    })
  })
}

// exports.loginUser = (req, res, next) => {
//   let fetchedUser;
//   User.findOne({email :req.body.email})
//   .then(user => {
//     if (!user) {
//         return res.status(401).json({message: 'A user By that name des not exist!'})
//     }
//     fetchedUser = user;
//     bcrypt.hash(req.body.password, 10 )
//     console.log(hash);
//     if(req.body.password === hash) {
//       // create a JWT
//       const token = jwt.sign(
//         { email: fetchedUser.email, userId: fetchedUser._id },
//        process.env.JWT_KEY,
//         { expiresIn: '1h' }
//       );
//       res.status(200).json(
//         {
//           expiresIn: 3600,
//           token: token,
//           userId: fetchedUser._id
//         });
//     } else {
//       return res.status(401).json({message: 'Auth Failed as the passwords do not match'})
//     }
//   })
//   .catch(err => {
//     //console.log(err);
//     res.status(500).json({
//       message: 'Invalid Authentication credentials'
//     });
//   });
// }
