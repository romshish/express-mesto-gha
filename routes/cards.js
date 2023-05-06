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
    name: Joi.string().min(2).max(30),
    link: Joi.string().uri({ scheme: ['http', 'https'] }),
  }),
}), createCard);
cardsRoutes.delete('/:cardId', deleteCard);
cardsRoutes.put('/:cardId/likes', addLike);
cardsRoutes.delete('/:cardId/likes', deleteLike);

export default cardsRoutes;
