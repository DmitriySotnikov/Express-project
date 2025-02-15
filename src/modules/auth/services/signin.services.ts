import { isValid } from "../helpres";
import httpStatus from "http-status";
import { ResultSetHeader } from "mysql2";
import pool from "../../../database/config";
import { createToken } from "./token.service";
import { ApiError, service } from "../../helpers";
import { commonConfig } from "../../../config/env";

export class SigninServices {
  @service({
    message: "Error authorization on the resource!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async execute({
    login,
    password,
    deviceId,
  }: {
    login: string;
    password: string;
    deviceId: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const dbName = commonConfig.DB_NAME;

    /**
     * Searching for a user by login if not found, an error is returned
     */

    const [user] = await pool.query<
      { id: number; login: string; password: string }[] & ResultSetHeader
    >(`SELECT id, login, password FROM ${dbName}.users WHERE login = ?`, [
      login,
    ]);

    if (!user?.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
    }

    /**
     * Verifying the password if the password is incorrect, an error is returned
     */

    const isValidPassword = await isValid(password, user[0].password);

    if (!isValidPassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid password!");
    }

    /**
     * Creating a new refreshToken
     */

    const refreshToken = createToken({
      userId: login,
      deviceId,
      time: commonConfig.REFRESH_TOKEN_EXPIRES_IN,
    });

    /**
     * Creating a new session
     */

    await pool.query<ResultSetHeader>(
      `
      INSERT INTO ${dbName}.sessions (user_id, refresh_token, device_id)
      VALUES (?, ?, ?);
      `,
      [user[0].id, refreshToken, deviceId]
    );

    /**
     * Creating a new accessToken
     */

    const accessToken = createToken({
      userId: login,
      deviceId,
      time: commonConfig.ACCESS_TOKEN_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }
}
