import express from 'express';
import multer from 'multer';
import { uploadVideo, getVideo, getPopularVideos } from '../controllers/videoController.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

router.post('/upload', upload.single('video'), uploadVideo);
router.get('/v_id=:shortId', getVideo);
router.get('/popular', getPopularVideos);

export default router;