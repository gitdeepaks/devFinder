const User = require("../models/user.model");
const { userAuth } = require("../middlewares/auth.middleware");
const express = require("express");
const requestsRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest.model");

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status: " + status,
        });
      }

      // If the request is already sent not able to send each other request if already sent by one of the user

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      //check if the user is sending request to himself

      if (fromUserId === toUserId) {
        return res.status(400).json({
          message: "You cannot send request to yourself",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection request already sent",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      const statusMessages = {
        interested: `has shown interest in connecting with`,
        ignored: `has chosen to ignore`,
      };

      res.status(200).json({
        message: `${req.user.firstName} ${statusMessages[status]} ${toUser.firstName}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
);

module.exports = requestsRouter;
