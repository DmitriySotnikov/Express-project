module.exports = {
  async up(pool) {
    await pool.query(`
        CREATE TABLE node_mysql_api.sessions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          refresh_token VARCHAR(500) NOT NULL,
          device_id VARCHAR(100) NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
  },
};
