import httpStatus from "http-status";
import { service } from "../../helpers";
import { ResultSetHeader } from "mysql2";
import pool from "../../../database/config";
import { commonConfig } from "../../../config/env";

export class UploadFileService {
  @service({
    message: "Error saving file!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async execute({
    fileData,
  }: {
    fileData: {
      originalname: string;
      filenameInRepository: string;
      extension: string;
      mimeType: string;
      size: number;
    };
  }): Promise<{ message: string; id: number }> {
    const dbName = commonConfig.DB_NAME;

    /**
     * @description: Save file to database.
     *
     *  In the database I used two names for the file.
     *
     *  name_in_repository - used to store a file in the repository and does not allow files with the same name to be stored.
     *
     *  originalname - the original file name that the user receives for all requests to the file.
     *
     */

    const { originalname, filenameInRepository, extension, mimeType, size } =
      fileData;

    const [result] = await pool.query<ResultSetHeader>(
      `
       INSERT INTO ${dbName}.files (name_in_repository, originalname, extension, mime_type, size)
       VALUES (?, ?, ?, ?, ?);
       `,
      [filenameInRepository, originalname, extension, mimeType, size]
    );

    return { message: "File uploaded successfully", id: result.insertId };
  }
}
