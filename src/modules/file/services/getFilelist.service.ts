import httpStatus from "http-status";
import { IFile } from "../interfaces";
import { service } from "../../helpers";
import { ResultSetHeader } from "mysql2";
import pool from "../../../database/config";
import { commonConfig } from "../../../config/env";

export class GetFileListService {
  @service({
    message: "Error saving file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async execute({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{ files: IFile[]; total: number }> {
    const offset = (page - 1) * limit;
    const dbName = commonConfig.DB_NAME;

    /**
     * Get files with pagination.
    */

    const [files] = await pool.query<IFile[] & ResultSetHeader>(
      `SELECT id, originalname, extension, mime_type, size, upload_date
       FROM ${dbName}.files
       ORDER BY upload_date DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    /**
     * Get total count of files.
    */

    const [totalCount] = await pool.query<
      [{ total: number }] & ResultSetHeader
    >(`SELECT COUNT(*) as total FROM ${dbName}.files`);

    return {
      files,
      total: totalCount[0].total,
    };
  }
}
