import express from 'express'
import { addTodo, deleteTodo, editTodo, getTodos, toggleComplete } from '../controllers/todoController.js';

const router = express.Router();

router.get('/', getTodos);
router.post('/', addTodo);
router.patch('/:id', editTodo);
router.patch('/:id/toggle', toggleComplete);
router.delete('/:id', deleteTodo);

export default router