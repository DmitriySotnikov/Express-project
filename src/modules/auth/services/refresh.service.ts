import httpStatus from "http-status";
import { ResultSetHeader } from "mysql2";
import pool from "../../../database/config";
import { ApiError, service } from "../../helpers";
import { commonConfig } from "../../../config/env";
import { createToken, verifyJWT } from "./token.service";

export class RefreshServices {
  @service({
    message: "Error authorization on the resource!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async execute({
    token,
  }: {
    token: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const dbName = commonConfig.DB_NAME;

    /**
     * Verifying the token if the token is incorrect, an error is returned
     */

    const payload = await verifyJWT({ token, secret: commonConfig.JWT_SECRET });

    if (!payload) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized!");
    }

    const { userId, deviceId } = payload;

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

    /**
     * Checking the session for existence if not found, an error is returned
     */

    const [session] = await pool.query<{ id: number }[] & ResultSetHeader>(
      `SELECT id FROM ${dbName}.sessions WHERE device_id = ? AND user_id = ?`,
      [deviceId, user[0].id]
    );

    if (!session?.length) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized!");
    }

    /**
     * Creating a new refreshToken
     */

    const refreshToken = createToken({
      userId,
      deviceId,
      time: commonConfig.REFRESH_TOKEN_EXPIRES_IN,
    });

    /**
     * Updating a new session
     */

    await pool.query<ResultSetHeader>(
      `
      UPDATE ${dbName}.sessions
      SET refresh_token = ?
      WHERE id = ?
      `,
      [refreshToken, session[0].id]
    );

    /**
     * Creating a new accessToken
     */

    const accessToken = createToken({
      userId,
      deviceId,
      time: commonConfig.ACCESS_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }
}
