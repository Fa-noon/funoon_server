import express from 'express';
import {Search} from '../controllers/globalController.js';


const router = express.Router();

router.get('/search', Search);


export default router;
