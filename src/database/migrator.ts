import "dotenv/config";
import pool from "./config";
import fs from "fs/promises";
import path from "path";
import { commonConfig } from "../config/env";

async function migrate() {
  console.log(`Migrating database...`);
  try {
    const dbName = commonConfig.DB_NAME;
    /**
     * Create a table for migrations
     */

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    /**
     * Get all files in the migrations folder
     */

    const files = await fs.readdir(path.join(__dirname, "..", "migrations"));
    const migrations = files.filter((f) => f.endsWith(".js"));

    for (const migration of migrations) {
      /**
       * Check if the migration has already been applied
       * */

      const [rows] = await pool.query(
        `SELECT * FROM ${dbName}.migrations WHERE name = ?`,
        [migration]
      );

      /**
       * If the migration has not been applied, apply it
       */
      if (Array.isArray(rows) && !rows.length) {
        const migrationScript = require(path.join(
          __dirname,
          "..",
          "migrations",
          migration
        ));
        await migrationScript.up(pool);
        await pool.query(`INSERT INTO ${dbName}.migrations (name) VALUES (?)`, [
          migration,
        ]);

        console.log(`Migration ${migration} is applied.`);
      }
    }
  } finally {
    /**
     * Close the connection to the database
     */

    await pool.end();
  }
}

/**
 * Connect to the database and run the migration
 */

migrate().catch(console.error);

export default migrate;
