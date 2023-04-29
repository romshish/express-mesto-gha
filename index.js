import express from 'express';
import http2 from 'node:http2';
import usersRoutes from './routes/users';
import cardsRoutes from './routes/cards';

const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;

const routes = express.Router();

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);
routes.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница по указанному пути не найдена' });
});

export default routes;
