const { userAuth } = require("../middlewares/auth.middleware");

const express = require("express");

const requestsRouter = express.Router();

requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
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

module.exports = requestsRouter;
