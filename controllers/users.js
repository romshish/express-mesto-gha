import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/users';
import {
  NOT_FOUND,
} from '../utils/config_errors';
import Badrequest from '../errors/bad-request';
import NotFoundError from '../errors/not-found-err';
import ConflictError from '../errors/conflict-err';
import Unauthorized from '../errors/unauthorized';

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new Error('not found');
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Badrequest('Передан некорректный _id пользователя'));
      } else if (err.message === 'not found') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Badrequest('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такими данными уже существует'));
      } else {
        next(err);
      }
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) throw new Error('not found');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Badrequest('Переданы некорректные данные при обновлении профиля'));
      } else if (err.message === 'not found') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) throw new Error('not found');
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Badrequest('Переданы некорректные данные при обновлении профиля'));
      } else if (err.message === 'not found') {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

const jwt = jsonwebtoken;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });

      // cookie('jwt', token, {
      //   maxAge: 3600000 * 24 * 7,
      //   httpOnly: true,
      //   sameSite: true,
      // });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Badrequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Ошибка авторизации'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new Unauthorized('Ошибка авторизации'));
  }

  User.findById(payload._id)
    .orFail(() => res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' }))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

export {
  getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar, login, getUser,
};
