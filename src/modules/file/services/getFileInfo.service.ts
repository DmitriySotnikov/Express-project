import httpStatus from "http-status";
import { ResultSetHeader } from "mysql2";
import pool from "../../../database/config";
import { ApiError, service } from "../../helpers";
import { commonConfig } from "../../../config/env";

export class GetFileInfoService {
  @service({
    message: "Error getting file info!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async execute({
    fileId,
  }: {
    fileId: number;
  }): Promise<{ name: string }> {
    const dbName = commonConfig.DB_NAME;

    /**
     * Check if file exists and get file data.
     */

    const [file] = await pool.query<{ name: number } & ResultSetHeader>(
      `SELECT originalname, extension, mime_type, size FROM ${dbName}.files WHERE id = ?`,
      [fileId]
    );

    const filename = file[0]?.name;

    if (!filename)
      throw new ApiError(httpStatus.BAD_REQUEST, "File not found!");

    return file[0];
  }
}
