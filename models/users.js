import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';
import Unauthorized from '../errors/unauthorized';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Неправильный формат URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Добавьте адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Вы не авторизованы'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Вы не авторизованы'));
          }
          return user;
        });
    });
};

export default mongoose.model('user', userSchema);
