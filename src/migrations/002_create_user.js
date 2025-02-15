module.exports = {
    async up(pool) {
      await pool.query(`
        CREATE TABLE node_mysql_api.users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            login VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        );
      `);
    },
  };