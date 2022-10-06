import express from 'express';
import {addComment} from '../controllers/commentController.js';


const router = express.Router();

router.get('/add', addComment);


export default router;
