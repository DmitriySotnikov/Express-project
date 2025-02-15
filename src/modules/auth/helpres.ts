import bcrypt from "bcrypt";
import { Response } from "express";
import { commonConfig } from "../../config/env";

/**
 * @description Hashing the password
 * @param {string} psw - Password
 * @param {number} salt - Salt
 */
export const hashFunction = async (psw: string, salt = 10) =>
  await bcrypt.hash(psw, salt);



/**
 * @description Checking the password for correctness
 * @param {string} inputPassword - Password
 * @param {string} hashedPassword - Hashed password
 */
export const isValid = async (inputPassword, hashedPassword) =>
  await bcrypt.compare(inputPassword, hashedPassword);



/**
 * @description Settting the cookie
 * @param {Response} res - Response object
 * @param {string} token - Token
 */
export const setCookie = ({ res, token }: { res: Response; token: string }) => {
  res.cookie(commonConfig.COOKIE_TOKEN, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: +commonConfig.COOKIE_EXPIRES_IN, // 604800000, // 7 days
  });
};
