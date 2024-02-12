import express from 'express';
import {
  deletePhoto,
  getPhoto,
  updatePhoto,
  uploadPhoto,
} from '../controllers/photo';
import multer from 'multer';
import {Request} from 'express';
import verifyToken from '../utils/jwt';

const router = express.Router();
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Your filename logic here
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({storage});

router.post('/upload-photo', verifyToken, upload.single('photo'), uploadPhoto);
router.get('/get-photos', verifyToken, getPhoto);
router.delete('/delete-photo/', verifyToken, deletePhoto);
router.patch('/update-photo/', verifyToken, updatePhoto);

export default router;
