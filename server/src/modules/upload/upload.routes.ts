import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, and PNG files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  '/salary-slip',
  protect,
  authorize('borrower'),
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `Multer error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      return res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        fileUrl,
      });
    });
  }
);

export default router;