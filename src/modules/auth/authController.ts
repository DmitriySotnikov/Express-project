import httpStatus from "http-status";
import { setCookie } from "./helpres";
import { Request, Response } from "express";
import { commonConfig } from "../../config/env";
import { ApiError, controller } from "../helpers";
import { LogoutServices } from "./services/logout.service";
import { SigninServices } from "./services/signin.services";
import { SignupServices } from "./services/signup.services";
import { RefreshServices } from "./services/refresh.service";
import { GetUserInfoServices } from "./services/getUserInfo.service";

export default class AuthUserController {
  /**
   * @description: User authorization.
   * @param {Request} req - Request object. Request body example: { login: string, password: string, deviceId: string }
   * @param {Response} res - Body - login: this is a phone number or email, password: user password.
   * @returns {Promise<Response>} - Returns object: { accessToken: string } and sets a cookie with a refresh token.
   */
  @controller({
    message: "Error authorization on the resource!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async signin(req: Request, res: Response) {
    /**
     * Getting data from the request body
     */
    
    const { login, password, deviceId } = req.body;

    const { accessToken, refreshToken } = await SigninServices.execute({
      login,
      password,
      deviceId,
    });

    /**
     * Setting a cookie with a refresh token
     */

    setCookie({ res, token: refreshToken });

    return res.send({ accessToken });
  }

  /**
   * @description: Refresh token.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns object: { accessToken: string } and sets a cookie with a refresh token.
   */
  @controller({
    message: "Error authorization on the resource!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async refreshToken(req: Request, res: Response) {
    /**
     * Getting a refresh token from the cookie if it is not found, an error is returned
     */

    const token = req.cookies[commonConfig.COOKIE_TOKEN];

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token!");
    }

    const { accessToken, refreshToken } = await RefreshServices.execute({
      token,
    });

    /**
     * Setting a cookie with a refresh token
     */

    setCookie({ res, token: refreshToken });

    return res.send({ accessToken });
  }

  /**
   * @description: User registration.
   * @param {Request} req - Request object. Request body example: { login: string, password: string, deviceId: string }
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns object: { accessToken: string } and sets a cookie with a refresh token.
   */
  @controller({
    message: "Error registration on the resource!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async signup(req: Request, res: Response) {
    /**
     * Getting data from the request body
     */

    const { login, password, deviceId } = req.body;

    const { accessToken, refreshToken } = await SignupServices.execute({
      login,
      password,
      deviceId,
    });

    /**
     * Setting a cookie with a refresh token
     */

    setCookie({ res, token: refreshToken });

    return res.send({ accessToken });
  }

  /**
   * @description: Get user information.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns object: { id: number }
   */
  @controller({
    message: "Internal server error!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async info(req: Request, res: Response) {
    /**
     * Getting a refresh token from the cookie if it is not found, an error is returned
     */

    const token = req.cookies[commonConfig.COOKIE_TOKEN];

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token!");
    }

    const result = await GetUserInfoServices.execute({
      token,
    });

    return res.send(result);
  }

  /**
   * @description: Logout user.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @returns {Promise<Response>} - Returns object: { message: string }
   */
  @controller({
    message: "Internal server error!",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  })
  static async logout(req: Request, res: Response) {
    /**
     * Getting a refresh token from the cookie if it is not found, an error is returned
     */

    const token = req.cookies[commonConfig.COOKIE_TOKEN];

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token!");
    }

    /**
     * Deleting a refresh token from the cookie
     */

    res.clearCookie(commonConfig.COOKIE_TOKEN, { httpOnly: true });

    const result = await LogoutServices.execute({
      token,
    });

    return res.send(result);
  }
}
