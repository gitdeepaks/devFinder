const ConnectionRequest = require('../models/connectionRequest.model');

const express = require('express');
const { userAuth } = require('../middlewares/auth.middleware');

const userRouter = express.Router();

// Get all the pending connection requests for the logged in User
userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    })
      .populate('fromUserId', 'firstName lastName photoUrl age about gender skills')
      .populate('toUserId', 'firstName lastName photoUrl age about gender skills');

    res.status(200).json({
      message: 'Connection requests fetched successfully',
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong',
    });
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // fetch the people who are connected to the logged in user

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', 'firstName lastName photoUrl age about gender skills')
      .populate('toUserId', 'firstName lastName photoUrl age about gender skills');
    // console.log(connectionRequests);

    const data = connectionRequests.map(row => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: 'Connections fetched successfully',
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong',
    });
  }
});

module.exports = userRouter;
