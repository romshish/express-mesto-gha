import Card from '../models/cards';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from '../utils/config_errors';

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) throw new Error('not found');
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный _id' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: ' Передан несуществующий _id карточки' });
      } else if (err.message === 'not found') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new Error('not found');
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: ' Передан несуществующий _id карточки' });
      } else if (err.message === 'not found') {
        res.status(NOT_FOUND).send({ message: ' Передан несуществующий _id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new Error('not found');
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: ' Передан несуществующий _id карточки' });
      } else if (err.message === 'not found') {
        res.status(NOT_FOUND).send({ message: ' Передан несуществующий _id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

export {
  getCards, createCard, deleteCardById, addLike, deleteLike,
};
