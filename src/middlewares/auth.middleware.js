const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userAuth = async (req, res, next) => {
  // read the token from  the req cookies
  try {
    const cookies = req.cookies;

    const { token } = cookies;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    if (_id) {
      const user = await User.findById(_id);

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      } else {
        req.user = user;
        next();
      }
    } else {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    // validate the token
    // Find the user
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

module.exports = { userAuth };
