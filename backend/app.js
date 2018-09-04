// install express
const express = require('express');
// install path package
const path = require('path');
//install bady parser
const bodyParser = require('body-parser');
// install mongoose
const mongoose = require('mongoose');


// menus routes
const menuRoutes = require('./routes/menus');
// auth routes
const userRoutes = require('./routes/users');

mongoose.connect('mongodb+srv://mark:' + process.env.MONGO_ATLAS_PASSWORD + '@cluster0-dnzru.mongodb.net/catering-manager-angular')
  .then(() => {
    console.log('connected to database');
  })
  .catch(() => {
    console.log('connection failed');
  })


// create an app
const app = express();

// use body parser middlewear
app.use(bodyParser.json());

// use path middle wear from express
// fowards all requests sent to '/images' to be fowarded to 'backend/images'
app.use('/images' , express.static(path.join('backend/images')));

// create a middlewear to allow CORS
// add next to prevent a timeout or endless loop
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers' , 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST, PUT, PATCH, DELETE, OPTIONS')
  next();
})

app.use("/api/menus" , menuRoutes);
app.use("/api/user" , userRoutes);

// export the app
module.exports = app;
