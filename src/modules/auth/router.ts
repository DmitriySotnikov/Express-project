import express from "express";
import auth from "./authController";
import { authSchema } from "./validation/auth.schema";
import { validateBody } from "../../middlewares/validation.middleware";

const router = express.Router();

/**
 *
 *  /signin [POST] - request jwt-token by id and password;
 *
 *  /signin/new_token [POST]  - update jwt-token by refresh token
 *
 *  /signup [POST] - registration of a new user;
 *
 *  /info [GET] - returns the user's id;
 *
 *  /logout [GET] - log out of the system;
 *
 */

router
  .post("/signin", validateBody(authSchema), auth.signin)
  .post("/signin/new_token", auth.refreshToken)
  .post("/signup", validateBody(authSchema), auth.signup)
  .get("/info", auth.info)
  .get("/logout", auth.logout);

export default router;
