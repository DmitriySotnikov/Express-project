import multer from 'multer';
import path from 'path';
import { Request } from 'express';

/**
 * @description: 
 *  Multer configuration for uploading files. 
 *  Create storage for uploaded files. 
 *  Set the destination for uploaded files. 
 *  Set the filename for uploaded files.
 * 
 * @returns {multer.Multer} - Returns a multer instance.
*/
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (arg: null, filename: string) => void) {
    // '/uploads' the folder name where the files will be stored
    cb(null, 'uploads/');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (arg: null, filename: string) => void) {
    const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

// "file" - the name of the field in the form
export const upload = multer({
  storage: storage,
}).single('file');
