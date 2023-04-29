import express from 'express';
import {
  getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
} from '../controllers/users';

const usersRoutes = express.Router();

usersRoutes.get('/', getUsers);
usersRoutes.get('/:userId', getUserById);
usersRoutes.post('/', createUser);
usersRoutes.patch('/me', updateUserProfile);
usersRoutes.patch('/me/avatar', updateUserAvatar);

export default usersRoutes;
