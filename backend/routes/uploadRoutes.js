import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

// https://www.npmjs.com/package/multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // path.extname: get the extension of the file name
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// var upload = multer({ storage: storage }) any file can be uploaded

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// can only upload single file called image
router.post('/', upload.single('image'), (req, res) => {
  // console.log('test');
  res.send(`/${req.file.path}`);
});

export default router;
