import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// $desc     Auth user & get token
// $route    POST /api/users/login
// $access   Public

const authUser =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      // 401 unauthorized
      res.status(401);
      throw new Error('Invalid email or password');
    }
  });

// $desc     Get user profile
// $route    POST /api/users/profile
// $access   Private

const getUserProfile =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

// $desc     Update user profile
// $route    PUT /api/users/profile
// $access   Private

const updateUserProfile =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // console.log(user);
    // {
    //   [0]   isAdmin: false,
    //   [0]   _id: 5fdfec267c4c6d6cba849e2c,
    //   [0]   name: 'qilong',
    //   [0]   email: 'henrylong719@gmail.com',
    //   [0]   password: '$2a$10$gVlAbkT1n0bc8BNGHyg4guclrrNAbWoysR/xfCAthkAdjm.Kb2EqC',
    //   [0]   createdAt: 2020-12-21T00:28:22.331Z,
    //   [0]   updatedAt: 2020-12-21T02:40:45.760Z,
    //   [0]   __v: 0
    //   [0]
    // }

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // the password in the database is already hashed
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });

// $desc     Auth user & get token
// $route    POST /api/users/login
// $access   Public

const registerUser =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      // 400 bad request
      res.status(400);
      throw new Error('User already exists');
    }

    // crete new user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // 201: created
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('invalid user data');
    }
  });

export { authUser, getUserProfile, registerUser, updateUserProfile };
