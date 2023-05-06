import express from 'express';
import celebrate from 'celebrate';
import auth from '../middlewares/auth';
import usersRoutes from './users';
import cardsRoutes from './cards';
import { createUser, login } from '../controllers/users';
import NotFoundError from '../errors/not-found-err';

const routes = express.Router();
const { Joi } = celebrate;

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), createUser);

routes.use(auth);

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);
routes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница по указанному пути не найдена'));
});

export default routes;
