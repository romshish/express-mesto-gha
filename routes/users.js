import express from 'express';
import Celebrate from 'celebrate';
import {
  getUser, getUsers, getUserById, updateUserProfile, updateUserAvatar,
} from '../controllers/users';

const usersRoutes = express.Router();
const { celebrate, Joi } = Celebrate;

usersRoutes.get('/me', getUser);
usersRoutes.get('/', getUsers);
usersRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);
usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);
usersRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[\w\W.?]*#?\b/i),
  }),
}), updateUserAvatar);

export default usersRoutes;
