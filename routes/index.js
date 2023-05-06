import express from 'express';
import auth from '../middlewares/auth';
import usersRoutes from './users';
import cardsRoutes from './cards';
import { createUser, login } from '../controllers/users';
import NotFoundError from '../errors/not-found-err';

const routes = express.Router();

routes.post('/signin', login);
routes.post('/signup', createUser);
routes.use(auth);
routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);
routes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница по указанному пути не найдена'));
});

export default routes;
