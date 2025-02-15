import httpStatus from "http-status";
import { ResultSetHeader } from "mysql2";
import pool from "../../../database/config";
import { verifyJWT } from "./token.service";
import { ApiError, service } from "../../helpers";
import { commonConfig } from "../../../config/env";

export class GetUserInfoServices {
  @service({
    message: "Error getting user info!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async execute({ token }: { token: string }): Promise<{ id: number }> {
    const dbName = commonConfig.DB_NAME;

    /**
     * Verifying the token if the token is incorrect, an error is returned
     */

    const payload = await verifyJWT({ token, secret: commonConfig.JWT_SECRET });

    if (!payload) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized!");
    }

    const { userId } = payload;

    /**
     * Searching for a user by login if not found, an error is returned
     */

    const [user] = await pool.query<{ id: number }[] & ResultSetHeader>(
      `SELECT id FROM ${dbName}.users WHERE login = ?`,
      [userId]
    );

    if (!user?.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
    }

    return { id: user[0].id };
  }
}
