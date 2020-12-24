import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

const protect = asyncHandler(async (req, res, next) => {
  // get the token from header
  //   console.log(req.headers.authorization);

  let token;

  // The HTTP Authorization request header contains the credentials to authenticate a user agent with a server.

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //   console.log(decoded);  { id: '5fdc38e2bec8ce0ccb46f0e0', iat: 1608444670, exp: 1611036670 }

      req.user = await User.findById(decoded.id).select(
        // not send back password
        '-password'
      );

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token filed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
