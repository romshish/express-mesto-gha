import Card from '../models/cards';
import { NOT_FOUND } from '../utils/config_errors';
import Badrequest from '../errors/bad-request';
import NotFoundError from '../errors/not-found-err';

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then(cards => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Badrequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  console.log(cardId);
  return Card.findById(cardId)
    .orFail(() => res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' }))
    .then((card) => {
      console.log(card.owner, req.user);
      if (!card.owner.equals(req.user._id)) throw new Error('not found');
      return Card.deleteOne(card)
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Badrequest('Передан некорректный _id'));
      } else if (err.name === 'CastError') {
        next(new Badrequest(' Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};

const addLike = (req, res, next) => {
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
        next(new Badrequest('Переданы некорректные данные для постановки лайка'));
      } else if (err.name === 'CastError') {
        next(new Badrequest(' Передан несуществующий _id карточки'));
      } else if (err.message === 'not found') {
        next(new NotFoundError(' Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res, next) => {
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
        next(new Badrequest('Переданы некорректные данные для снятия лайка'));
      } else if (err.name === 'CastError') {
        next(new Badrequest(' Передан несуществующий _id карточки'));
      } else if (err.message === 'not found') {
        next(new NotFoundError(' Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};

export {
  getCards, createCard, deleteCard, addLike, deleteLike,
};
