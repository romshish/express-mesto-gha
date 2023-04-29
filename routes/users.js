import express from 'express';
import {
  getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
} from '../controllers/users';

const usersRoutes = express.Router();

usersRoutes.get('/', getUsers);
usersRoutes.get('/:userId', getUserById);
usersRoutes.post('/', express.json(), express.urlencoded({ extended: true }), createUser);
usersRoutes.patch('/me', express.json(), express.urlencoded({ extended: true }), updateUserProfile);
usersRoutes.patch('/me/avatar', express.json(), express.urlencoded({ extended: true }), updateUserAvatar);

export default usersRoutes;
