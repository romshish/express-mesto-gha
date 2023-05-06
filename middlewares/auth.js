import jsonwebtoken from 'jsonwebtoken';

const jwt = jsonwebtoken;

const handleAuthError = (res) => res.status(401).send({ message: 'Ошибка авторизации' });

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};

export default auth;
