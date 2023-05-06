import jsonwebtoken from 'jsonwebtoken';
import NotFoundError from '../errors/not-found-err';

const jwt = jsonwebtoken;

// const handleAuthError = (res) => {
//   res.status(401).send({ message: 'Ошибка авторизации' });
// };

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotFoundError('Пользователь с указанным _id не найден'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new NotFoundError('Пользователь с указанным _id не найден'));
  }

  req.user = payload;

  return next();
};

export default auth;
