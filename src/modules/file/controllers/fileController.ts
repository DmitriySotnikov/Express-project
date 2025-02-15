import httpStatus from "http-status";
import { getFileParams } from "../helpers";
import { Request, Response } from "express";
import { ApiError, controller } from "../../helpers";
import { UpdateFileService } from "../services/updateFile.service";
import { DeleteFileService } from "../services/deleteFile.service";
import { UploadFileService } from "../services/uploadFile.service";
import { GetFileListService } from "../services/getFilelist.service";
import { GetFileInfoService } from "../services/getFileInfo.service";
import { DownloadFileService } from "../services/downloadFile.service";

export default class FileController {
  /**
   * @description: Processes file upload, saves it to storage and writes metadata to the database.
   * @param {Request} req - Request object. Form-data: file.
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns object: { message: string, id: number }
   */
  @controller({
    message: "Error saving file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async createFile(req: Request, res: Response) {
    /**
     * Get file from request.
     */
    const file = req.file;

    if (!file) throw new ApiError(httpStatus.BAD_REQUEST, "File not found!");

    /**
     * Get file params from file object.
     */

    const fileData = getFileParams(file);

    const result = await UploadFileService.execute({
      fileData,
    });

    return res.send(result);
  }

  /**
   * @description: Get files list.
   * @param {Request} req - Request object. Query params: page, limit.
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns object: { files: IFile[]; total: number }
   */
  @controller({
    message: "Error getting files list!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async getFilesList(req: Request, res: Response) {
    /**
     * Get page and limit from query params.
     */

    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;

    const result = await GetFileListService.execute({
      page,
      limit,
    });

    return res.send(result);
  }

  /**
   * @description: Delete file from storage and database.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns object: { message: string }
   */
  @controller({
    message: "Error deleting file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async deleteFile(req: Request, res: Response) {
    /**
     * Get file id from params.
     */

    const fileId: number = Number(req.params.id);

    const result = await DeleteFileService.execute({
      fileId,
    });

    return res.send(result);
  }

  /**
   * @description: Get file info from database.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns object: { name: string }
   */
  @controller({
    message: "Error getting file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async getFile(req: Request, res: Response) {
    /**
     * Get file id from params.
     */

    const fileId: number = Number(req.params.id);

    const result = await GetFileInfoService.execute({
      fileId,
    });

    return res.send(result);
  }

  /**
   * @description: Get file from storage and send it to the client.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns: Buffer<ArrayBufferLike>
   */
  @controller({
    message: "Errror downloading file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async downloadFile(req: Request, res: Response) {
    /**
     * Get file id from params annd check if it exists.
     */

    const fileId = Number(req.params.id);

    if (!fileId) throw new ApiError(httpStatus.BAD_REQUEST, "File not found!");

    const { content, filename, mimeType } = await DownloadFileService.execute({
      fileId,
    });

    /**
     * Set headers for file download.
     */

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(content);
  }

  /**
   * @description: Update new file in storage and database.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns object: { message: string }
   */
  @controller({
    message: "Error updating file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async updateFile(req: Request, res: Response) {
    /**
     * Get file from request and fileId from params.
     */

    const file = req.file;
    const fileId = Number(req.params.id);

    if (!file) throw new ApiError(httpStatus.BAD_REQUEST, "File not found!");

    /**
     * Get file params from file object.
     */

    const fileData = getFileParams(file);

    const result = await UpdateFileService.execute({ fileId, ...fileData });

    res.send(result);
  }
}
