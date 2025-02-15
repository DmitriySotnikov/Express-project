import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import process from "process";
import { createServer } from "http";
import pool from "./database/config";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { commonConfig } from "./config/env";
import authRouter from "./modules/auth/router";
import fileRouter from "./modules/file/router";

/**
 * Create a new Express application.
 */
const app: Express = express();

/**
 * Create a new HTTP server using the Express application.
 */

const port = commonConfig.PORT;

/**
 * Conect to the database and log a success message if successful.
 */

(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log("Connected to the database!");
    connection.release();
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1); // Exit the process with a non-zero status code
  }
})();

/**
 * Set up middleware for the Express application.
 */

/**
 * Trust the first proxy in the list.
 */

app.set("trust proxy", 1);

/**
 * Enable the trust proxy setting.
 */

app.enable("trust proxy");

/**
 * CORS middleware.
 */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/**
 * Serve static files from the uploads directory.
 */

app.use(
  `/${commonConfig.PREFIX}/static`,
  express.static(commonConfig.UPLOADS_DIRECTORY)
);

/**
 * Cookie parser middleware.
 */

app.use(cookieParser());

/**
 * Morgan middleware. For logging requests.
 */

app.use(morgan("dev"));

/**
 * Parse JSON and URL-encoded request bodies.
 */

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

/**
 * Mount the auth and file routers.
 */

app.use(`/${commonConfig.PREFIX}/file`, fileRouter);
app.use(`/${commonConfig.PREFIX}`, authRouter);

/**
 * Start the HTTP server.
 */

const httpServer = createServer(app);

/**
 * Listen on the specified port.
 */

httpServer.listen(port, () => console.log(`Server started on port ${port}`));
