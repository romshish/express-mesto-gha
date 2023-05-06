import express from 'express';
import {
  getUser, getUsers, getUserById, updateUserProfile, updateUserAvatar,
} from '../controllers/users';

const usersRoutes = express.Router();

usersRoutes.get('/me', getUser);
usersRoutes.get('/', getUsers);
usersRoutes.get('/:userId', getUserById);
usersRoutes.patch('/me', updateUserProfile);
usersRoutes.patch('/me/avatar', updateUserAvatar);

export default usersRoutes;
