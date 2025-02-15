import fs from "fs/promises";
import httpStatus from "http-status";
import { ResultSetHeader } from "mysql2";
import pool from "../../../database/config";
import { ApiError, service } from "../../helpers";
import { commonConfig } from "../../../config/env";

export class DeleteFileService {
  @service({
    message: "Error deleting file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async execute({
    fileId,
  }: {
    fileId: number;
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
     * Deleting a file from the repository and the database.
    */

    await pool.query<ResultSetHeader>(
      `DELETE FROM ${dbName}.files WHERE id = ?`,
      [fileId]
    );

    await fs.unlink(commonConfig.UPLOADS_DIRECTORY + filename);

    return {
      message: "File deleted successfully!",
    };
  }
}
