const { userAuth } = require("../middlewares/auth.middleware");

const express = require("express");

const profileRouter = express.Router();

const {
  validateEditProfileData,
  validatePasswordData,
} = require("../utils/validation");
const bcrypt = require("bcryptjs");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // validate profile data
    if (!validateEditProfileData(req)) {
      return res.status(400).json({
        message: "Invalid profile data",
      });
    }

    const loggedInUser = req.user;
    // console.log(loggedInUser);

    if (!loggedInUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.status(200).json({
      message: `User ${loggedInUser.firstName} updated successfully`,
      loggedInUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

profileRouter.patch("/profile/editPassword", userAuth, async (req, res) => {
  try {
    // validate password data
    if (!validatePasswordData(req)) {
      return res.status(400).json({
        message: "Invalid password data",
      });
    }
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, loggedInUser.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid old password",
      });
    }

    loggedInUser.password = newPassword;
    await loggedInUser.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = profileRouter;
