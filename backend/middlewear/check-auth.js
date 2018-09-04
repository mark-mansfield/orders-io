// check if we have a token using jsonwebpackage
const jwt = require('jsonwebtoken');

// export the function to execute on the incoming request
module.exports = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({message: error});
  }
};
