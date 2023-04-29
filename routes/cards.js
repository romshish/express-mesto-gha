import express from 'express';
import {
  getCards, createCard, deleteCardById, addLike, deleteLike,
} from '../controllers/cards';

const cardsRoutes = express.Router();

cardsRoutes.get('/', getCards);
cardsRoutes.post('/', createCard);
cardsRoutes.delete('/:cardId', deleteCardById);
cardsRoutes.put('/:cardId/likes', addLike);
cardsRoutes.delete('/:cardId/likes', deleteLike);

export default cardsRoutes;
