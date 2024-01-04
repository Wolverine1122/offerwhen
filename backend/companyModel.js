const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getCompanies = async () => {
  const query = 'SELECT * FROM companies';
  try {
    const { rows } = await pool.query(query);
    if (rows && rows.length > 0) {
      return rows;
    } else {
      const error = new Error('No results found');
      error.code = 'NO_RESULTS';
      throw error;
    }
  } catch (error) {
    console.error(error);
    throw error.code === 'NO_RESULTS' ? error : new Error('Internal server error');
  } finally {
    pool.end();
  }
};

module.exports = {
  getCompanies,
};