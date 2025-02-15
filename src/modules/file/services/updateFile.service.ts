import fs from "fs/promises";
import httpStatus from "http-status";
import { ResultSetHeader } from "mysql2";
import pool from "../../../database/config";
import { ApiError, service } from "../../helpers";
import { commonConfig } from "../../../config/env";

export class UpdateFileService {
  @service({
    message: "Error updating file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async execute({
    fileId,
    originalname,
    filenameInRepository,
    extension,
    mimeType,
    size,
  }: {
    fileId: number;
    originalname: string;
    filenameInRepository: string;
    extension: string;
    mimeType: string;
    size: number;
  }): Promise<{ message: string }> {
    const dbName = commonConfig.DB_NAME;

    /**
     * Check if file exists.
     */

    const [file] = await pool.query<{ name: string } & ResultSetHeader>(
      `SELECT name_in_repository FROM ${dbName}.files WHERE id = ?`,
      [fileId]
    );

    const filename = file[0]?.name_in_repository;

    if (!filename) throw new ApiError(httpStatus.BAD_REQUEST, "File not found!");

    /**
     * Delete old file in uploads folder.
     */

    await fs.unlink(commonConfig.UPLOADS_DIRECTORY + filename);

    /**
     * Update file in database.
     */

    await pool.query<ResultSetHeader>(
      `
       UPDATE ${dbName}.files
       SET
        name_in_repository = ?, 
        originalname = ?, 
        extension = ?, 
        mime_type = ?, 
        size = ?
       WHERE id = ?
       `,
      [filenameInRepository, originalname, extension, mimeType, size, fileId]
    );

    return {
      message: "File updated successfully",
    };
  }
}
