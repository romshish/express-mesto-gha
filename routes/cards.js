import express from 'express';
import {
  getCards, createCard, deleteCard, addLike, deleteLike,
} from '../controllers/cards';

const cardsRoutes = express.Router();

cardsRoutes.get('/', getCards);
cardsRoutes.post('/', createCard);
cardsRoutes.delete('/:cardId', deleteCard);
cardsRoutes.put('/:cardId/likes', addLike);
cardsRoutes.delete('/:cardId/likes', deleteLike);

export default cardsRoutes;
