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
  console.log('getCompanies');
  const query = 'SELECT * FROM company';
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error('No results found'));
        }
      });
    })
  } catch (error) {
    console.error(error.message);
    throw new Error('Internal server error for retrieving companies');
  }
};

const getCompany = async (companyId) => {
  console.log('getCompany');
  const query = 'SELECT * FROM company WHERE company_id = $1';
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, [companyId], (error, results) => {
        if (error) {
          reject(error);
        } else if (results && results.rows && results.rows.length > 0) {
          resolve(results.rows[0]);
        } else {
          reject(new Error('No results found'));
        }
      });
    })
  } catch (error) {
    console.error(error.message);
    throw new Error(`Internal server error for retrieving company ${companyId}`);
  }
};

const getCompanyOnlineAssessment = async (companyId, cursor, limit) => {
  console.log('getCompanyOnlineAssessment');
  const query = 'SELECT * FROM online_assessment WHERE company_id = $1 AND entry_date > $2 ORDER BY assessment_date DESC LIMIT $3';
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, [companyId, cursor, limit], (error, results) => {
        if (error) {
          reject(error);
        } else if (results && results.rows) {
          resolve(results.rows);
        } else {
          reject(new Error('No results found'));
        }
      });
    })
  } catch (error) {
    console.error(error.message);
    throw new Error(`Internal server error for retrieving online assessment for ${companyId}`);
  }
};

module.exports = {
  getCompanies,
  getCompany,
  getCompanyOnlineAssessment,
};