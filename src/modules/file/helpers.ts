import path from "path";


/**
 * Get file params from file object.
*/

export const getFileParams = (file) => ({
  originalname: file.originalname,
  extension: path.extname(file.originalname),
  mimeType: file.mimetype,
  size: file.size,
  filenameInRepository: file.filename, // Generated file name in uploads
});
