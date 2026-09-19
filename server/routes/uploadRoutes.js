import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer storage in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('الملف المرفوع يجب أن يكون صورة فقط (JPEG, PNG, WEBP)'), false);
    }
  }
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'الرجاء اختيار صورة للرفع' });
    }

    // Upload buffer directly to Cloudinary using upload_stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'kenzna/products',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return res.status(500).json({ message: 'فشل في رفع الصورة إلى Cloudinary', error: error.message });
        }
        res.json({
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'خطأ في معالجة رفع الصورة', error: err.message });
  }
});

// @desc    Upload multiple images to Cloudinary
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'الرجاء اختيار صور للرفع' });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'kenzna/products',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const urls = await Promise.all(uploadPromises);
    res.json({ urls });
  } catch (err) {
    console.error('Multiple Upload Error:', err);
    res.status(500).json({ message: 'فشل في رفع بعض أو كل الصور', error: err.message });
  }
});

export default router;
