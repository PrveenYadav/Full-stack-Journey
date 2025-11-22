import express, { Router } from 'express';
import { addNotes, deleteNotes, editNotes, getAllNotes } from '../controllers/notesController.js';

const router = express.Router();

router.get('/', getAllNotes);
router.post('/', addNotes);
router.patch('/:id', editNotes);
router.delete('/:id', deleteNotes);


export default router;