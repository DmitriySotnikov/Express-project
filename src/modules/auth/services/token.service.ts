import httpStatus from "http-status";
import { ApiError } from "../../helpers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { commonConfig } from "../../../config/env";

/**
 * @description Create the token for authorization
 * @param {string} userId - UserId is a phone number or email
 * @param {string} deviceId - Device ID
 * @param {string} time - Time of token expiration
 */

export const createToken = ({
  userId,
  deviceId,
  time,
}: {
  userId: string;
  deviceId: string;
  time: string;
}) => {
  try {
    const payload = {
      userId,
      deviceId,
    };
    return jwt.sign(payload, commonConfig.JWT_SECRET, {
      expiresIn: time,
    }) as string; // algorithm: 'HS256', 'RS256'
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error creating token!"
    );
  }
};

/**
 * @description Checking the token for correctness
 * @param {string} token - Token
 * @param {string} secret - Secret key
 */

export const verifyJWT = ({
  token,
  secret,
}: {
  token: string;
  secret: string;
}): JwtPayload | string | null => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
