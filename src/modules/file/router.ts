import express, { Router } from 'express';
import file from './controllers/fileController';
import { upload } from '../multer/multerConfig';

const router: Router = express.Router();

/**
 * 
 *  /file/upload [POST] - add new file to system and write file parameters to the database: name, extension, MIME type, size, date of upload;
 * 
 *  /file/list [GET] - displays a list of files and their parameters from the database using pagination with the page size specified in the list_size parameter,
 *    by default 10 records per page, if the parameter is empty. 
 *    The page number is specified in the page parameter, by default 1, if not set;
 * 
 *  /file/delete/:id [DELETE] - deletes the document from the database and the local storage;
 * 
 *  /file/:id [GET] - display information about the selected file;
 * 
 *  /file/download/:id [GET] - download a specific file;
 * 
 *  /file/update/:id [PUT] - update the current document in the database and the local storage;
 * 
*/


router
  .post('/upload', [upload], file.createFile)
  .get('/list', file.getFilesList)
  .delete('/delete/:id', file.deleteFile)
  .get('/:id', file.getFile)
  .get('/download/:id', file.downloadFile)
  .put('/update/:id', [upload], file.updateFile)

export default router;
