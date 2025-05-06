const { validateSignUpData } = require("./utils/validation");

const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user.model");

const PORT = process.env.PORT || 4111;

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    //Encrypt the password

    //Generate a JWT token

    const userObj = req.body;

    const user = new User(userObj);

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

// Find user by email

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    // res.send(user);

    if (!user || user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
    }

    res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

// Feed API GET all the feeds from the database

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      message: "Users found",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

// Update Data of the user

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  // console.log(JSON.stringify(data));

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      return res.status(400).json({
        message: "Invalid update",
      });
    }
    if (data?.skills.lenght > 10) {
      return res.status(400).json({
        message: "Skills cannot be more than 10",
      });
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    // console.log(user);
    res.status(200).json({
      message: "User updated successfully",
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
