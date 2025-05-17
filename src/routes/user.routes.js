const ConnectionRequest = require('../models/connectionRequest.model');
const User = require('../models/user.model');

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

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    /**
     * 0. his own card
     * 1. his connections card
     * 2. ignored people card
     * 3. already send the connection request
     *

     */

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Find all the connection requst  that will be either sent or recieved
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach(r => {
      hideUsersFromFeed.add(r.fromUserId.toString());
      hideUsersFromFeed.add(r.toUserId.toString());
    });

    // Find all the users who are not in the hideUsersFromFeed set

    const users = await User.find({
      $and: [{ _id: { $nin: Array.from(hideUsersFromFeed) } }, { _id: { $ne: loggedInUser._id } }],
    })
      .select('firstName lastName photoUrl age about gender skills')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: 'Feed fetched successfully',
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something went wrong',
    });
  }
});

module.exports = userRouter;
