import fs from "fs/promises";
import httpStatus from "http-status";
import pool from "../../../database/config";
import { ApiError, service } from "../../helpers";
import { commonConfig } from "../../../config/env";

export class DownloadFileService {
  @service({
    message: "Error deleting file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async execute({
    fileId,
  }: {
    fileId: number;
  }): Promise<{ content: Buffer; filename: string; mimeType: string }> {
    const dbName = commonConfig.DB_NAME;

    /**
     * Check if file exists and get file data.
     */

    const [files] = await pool.query(
      `SELECT name_in_repository, originalname, mime_type FROM ${dbName}.files WHERE id = ?`,
      [fileId]
    );

    const file = files[0];

    if (!file) {
      throw new ApiError(httpStatus.BAD_REQUEST, "File not found!");
    }

    /**
     * Get file content.
     */

    const fileContent = await fs.readFile(
      commonConfig.UPLOADS_DIRECTORY + file.name_in_repository
    );

    return {
      content: fileContent,
      filename: file.originalname,
      mimeType: file.mime_type,
    };
  }
}
