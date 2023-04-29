import http2 from 'node:http2';
import User from '../models/users';

const STATUS_OK = http2.constants.HTTP_STATUS_OK;
const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const INTERNAL_SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new Error('not found');
      res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный _id пользователя', ...err });
      } else if (err.message === 'not found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя', ...err });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { body } = req;
  User.findByIdAndUpdate(req.user._id, body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) throw new Error('not found');
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля', ...err });
      } else if (err.message === 'not found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { body } = req;
  User.findByIdAndUpdate(req.user._id, body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) throw new Error('not found');
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля', ...err });
      } else if (err.message === 'not found') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

export {
  getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
};

// console.log(err.name);
