import express from 'express';
const router = express.Router();

import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  registerUser,
  updateUser,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// router.post('/login', authUser);
router.route('/login').post(authUser);

// allow the route to be protect (authorized)
// (protect, getUserProfile) is the way to implement middleware
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// 1. GET /api/users: register
// 2. POST /api/users: get all users
router.route('/').post(registerUser).get(protect, admin, getUsers);

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
