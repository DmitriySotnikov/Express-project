module.exports = {
  async up(pool) {
    await pool.query(`
      CREATE TABLE node_mysql_api.files (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name_in_repository VARCHAR(255) NOT NULL,
          originalname VARCHAR(255) NOT NULL,
          extension VARCHAR(50),
          mime_type VARCHAR(100),
          size BIGINT,
          upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },
};