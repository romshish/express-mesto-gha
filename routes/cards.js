import express from 'express';
import Celebrate from 'celebrate';
import {
  getCards, createCard, deleteCard, addLike, deleteLike,
} from '../controllers/cards';

const cardsRoutes = express.Router();
const { celebrate, Joi } = Celebrate;

cardsRoutes.get('/', getCards);
cardsRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({ scheme: ['http', 'https'] }),
  }),
}), createCard);
cardsRoutes.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
cardsRoutes.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), addLike);
cardsRoutes.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteLike);

export default cardsRoutes;
