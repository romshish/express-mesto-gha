import jsonwebtoken from 'jsonwebtoken';
import Unauthorized from '../errors/unauthorized';

const jwt = jsonwebtoken;

const handleAuthError = (res, req, next) => {
  next(new Unauthorized('Ошибка авторизации'));
};

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, req, next);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return handleAuthError(res, req, next);
  }

  req.user = payload;

  next();
};

export default auth;
