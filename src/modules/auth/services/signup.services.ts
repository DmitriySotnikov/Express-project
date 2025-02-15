import httpStatus from "http-status";
import { ResultSetHeader } from "mysql2";
import { hashFunction } from "../helpres";
import pool from "../../../database/config";
import { createToken } from "./token.service";
import { ApiError, service } from "../../helpers";
import { commonConfig } from "../../../config/env";

export class SignupServices {
  @service({
    message: "Error creating a new user!",
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
     * Checking the user for existence
     */

    const [user] = await pool.query<{ id: number }[] & ResultSetHeader>(
      `SELECT id  FROM ${dbName}.users WHERE login = ?`,
      [login]
    );

    if (user?.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User already exists!");
    }

    /**
     * Hashing the password
     */

    const hashPassword = await hashFunction(password);

    /**
     * Creating a new user
     */

    const [newUser] = await pool.query<ResultSetHeader>(
      `
        INSERT INTO ${dbName}.users (login, password)
        VALUES (?, ?);
        `,
      [login, hashPassword]
    );

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
      [newUser.insertId, refreshToken, deviceId]
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
