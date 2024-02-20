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

const getCompanyOnlineAssessment = async (companyId, cursorDate, cursorId, limit, direction) => {
  let idCompareOperator;
  switch (direction) {
    case 'next':
      idCompareOperator = '<';
      break;
    case 'prev':
      idCompareOperator = '>';
      break;
    default:
      idCompareOperator = '<=';
  }

  const dateCompareOperator = direction === 'prev' ? '>=' : '<=';
  const sortDirection = direction === 'prev' ? 'ASC' : 'DESC';
  let query;
  let params;
  if (cursorId) {
    query = `
      SELECT * FROM online_assessment 
      WHERE company_id = $1 AND (entry_date ${dateCompareOperator} $2 AND assessment_id ${idCompareOperator} $3) 
      ORDER BY entry_date ${sortDirection}, assessment_id ${sortDirection} 
      LIMIT $4
    `;
    params = [companyId, cursorDate, cursorId, limit];
  } else {
    query = `
      SELECT * FROM online_assessment 
      WHERE company_id = $1 AND entry_date ${dateCompareOperator} $2 
      ORDER BY entry_date ${sortDirection}, assessment_id ${sortDirection} 
      LIMIT $3
    `;
    params = [companyId, cursorDate, limit];
  }
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) {
          reject(error);
        } else if (results && results.rows) {
          if (direction === 'prev') {
            results.rows.reverse();
          }
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