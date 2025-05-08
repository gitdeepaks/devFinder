const { validateSignUpData } = require("./utils/validation");

const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.middleware");
const app = express();

const PORT = process.env.PORT || 4111;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    console.log(passwordHash);

    //Generate a JWT token

    const userObj = req.body;

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "User creation failed",
      error: error.message,
    });
  }
});
// Login API
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Creating a JWT token

      const token = await user.getJWT();
      console.log(token);

      // Add a token to cookie and send the response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return res.status(200).json({
        message: "Login successful",
        user,
      });
    } else {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Invalid token");
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log(`${user.firstName} is sending connection request`);

    res.status(200).json({
      message: `${user.firstName} is sending connection request`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
