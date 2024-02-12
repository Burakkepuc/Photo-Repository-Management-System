import express from 'express';
import auth from './auth';
import photo from './photo';
// const auth = require('./auth');
const router = express.Router();

router.use('/photo', photo);
router.use('/auth', auth);

export default router;
