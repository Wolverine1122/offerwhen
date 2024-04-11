const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getSeasons = async () => {
  console.log('getSeasons');
  const query = 'SELECT * FROM seasons';
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else if (results && results.rows && results.rows.length > 0) {
          resolve(results.rows);
        } else {
          reject(new Error('No results found'));
        }
      });
    })
  } catch (error) {
    console.error(error.message);
    throw new Error('Internal server error for retrieving seasons');
  }
};

const getCompanyTypes = async () => {
  console.log('getCompanyTypes');
  const query = 'SELECT * FROM company_types';
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        }
        else if (results && results.rows && results.rows.length > 0) {
          resolve(results.rows);
        } else {
          reject(new Error('No results found'));
        }
      });
    })
  } catch (error) {
    console.error(error.message);
    throw new Error('Internal server error for retrieving company types');
  }
};

const getCompanies = async (safeCursorCompanyId, safeEntriesId, limit, direction, searchParams) => {
  console.log('getCompanies');

  const seasons = await getSeasons();
  const companyTypes = await getCompanyTypes();
  let [search, season, companyType] = [null, null, null];
  if (searchParams && searchParams.search) {
    search = searchParams.search;
  }
  if (searchParams && searchParams.season && searchParams.season !== "All seasons" && seasons) {
    const seasonMatch = seasons.find(season => season.name === searchParams.season);
    if (seasonMatch) {
      season = seasonMatch.id;
    }
  }
  if (searchParams && searchParams.companyType && searchParams.companyType !== "All companies" && companyTypes) {
    const companyTypeMatch = companyTypes.find(companyType => companyType.name === searchParams.companyType);
    if (companyTypeMatch) {
      companyType = companyTypeMatch.id;
    }
  }
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
  const sortDirection = direction === 'prev' ? 'ASC' : 'DESC';

  let query = "SELECT * FROM company WHERE 1=1";
  let params = [];
  if (safeCursorCompanyId && safeEntriesId) {
    query += ` AND (entries, company_id) ${idCompareOperator} ($1, $2)`;
    params.push(safeEntriesId, safeCursorCompanyId);
  }
  if (search) {
    query += ` AND name ILIKE $${params.length + 1}`;
    params.push(`%${search}%`);
  }
  if (companyType) {
    query += ` AND company_type_id = $${params.length + 1}`;
    params.push(companyType);
  }
  if (season) {
    query += ` AND $${params.length + 1} = ANY(seasons)`;
    params.push(season);
  }
  query += ` ORDER BY entries ${sortDirection}, company_id ${sortDirection} 
  LIMIT $${params.length + 1};`;
  params.push(limit);

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
    throw new Error('Internal server error for retrieving companies');
  }
};

const getCompany = async (companyId) => {
  console.log('getCompany');
  const query = 'SELECT * FROM company WHERE name = $1';
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

const getCompanyIdFromName = async (companyName) => {
  console.log('getCompanyIdFromName');
  const query = 'SELECT company_id FROM company WHERE name = $1';
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, [companyName], (error, results) => {
        if (error) {
          reject(error);
        } else if (results && results.rows && results.rows.length > 0) {
          resolve(results.rows[0].company_id);
        } else {
          reject(new Error('No results found'));
        }
      });
    })
  } catch (error) {
    console.error(error.message);
    throw new Error(`Internal server error for retrieving company id from name ${companyName}`);
  }
};

const getCompanyOnlineAssessment = async (companyId, cursorDate, cursorId, limit, direction, selectedSeason) => {
  console.log('getCompanyOnlineAssessment');
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
  internal_company_id = await getCompanyIdFromName(companyId);

  let query = "SELECT * FROM online_assessment WHERE 1=1";
  let params = [];
  if (internal_company_id) {
    query += ` AND company_id = $1`;
    params.push(internal_company_id);
  }
  if (cursorId) {
    query += ` AND (entry_date ${dateCompareOperator} $${params.length + 1} AND assessment_id ${idCompareOperator} $${params.length + 2})`;
    params.push(cursorDate, cursorId);
  } else {
    query += ` AND entry_date ${dateCompareOperator} $${params.length + 1}`;
    params.push(cursorDate);
  }
  if (selectedSeason !== 7) {
    query += ` AND season_id = $${params.length + 1}`
    params.push(selectedSeason);
  }
  query += ` ORDER BY entry_date ${sortDirection}, 
      assessment_id ${sortDirection} LIMIT $${params.length + 1};`
  params.push(limit);

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

const getOnlineAssessmentStats = async (companyId, selectedSeason) => {
  console.log('getOnlineAssessmentStats');
  internal_company_id = await getCompanyIdFromName(companyId);
  let query = `
    SELECT scored
    FROM online_assessment 
    WHERE company_id = $1 
    AND status = $2
  `;
  let params = [internal_company_id, 'accepted'];
  if (selectedSeason !== 7) {
    query += ` AND season_id = $${params.length + 1}`;
    params.push(selectedSeason);
  }
  query += ` ORDER BY scored;`;

  try {
    const { rows } = await pool.query(query, params);
    if (!rows || rows.length === 0) {
      return 'No results found';
    }
    const allScores = rows.map(row => row.scored);
    const upperQuartile = allScores[Math.floor(allScores.length * 0.75)];
    const median = allScores[Math.floor(allScores.length * 0.5)];
    const lowerQuartile = allScores[Math.floor(allScores.length * 0.25)];
    const minimum = allScores[0];
    return { upperQuartile, median, lowerQuartile, minimum };
  }
  catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

const getScorePosition = async (company, selectedSeason, selectedPlatform, scored, total) => {
  console.log('getScorePosition');
  internal_company_id = await getCompanyIdFromName(company);
  accept_status = 'accepted';
  let query = `
    SELECT scored
    FROM online_assessment 
    WHERE company_id = $1 
      AND assessment_platform = $2
      AND max_score = $3
      AND status = $4
  `;
  let params = [internal_company_id, selectedPlatform, total, accept_status];
  if (selectedSeason !== 7) {
    query += ` AND season_id = $${params.length + 1}`;
    params.push(selectedSeason);
  }
  query += ` ORDER BY scored DESC;`;

  if (isNaN(scored)) {
    return 'Invalid score';
  } else if (isNaN(total)) {
    return 'Invalid total';
  }

  try {
    const { rows } = await pool.query(query, params);
    if (!rows || rows.length === 0) {
      return 'No results found';
    }
    const allScores = rows.map(row => row.scored);
    allScores.push(scored);
    allScores.sort((a, b) => a - b);
    const newPosition = allScores.findLastIndex(score => score === scored) + 1;
    const percentileRank = (newPosition / allScores.length) * 100;
    return Math.round(percentileRank);
  }
  catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
}

const createCompanyOnlineAssessment = async (companyId, data) => {
  console.log('createCompanyOnlineAssessment');
  internal_company_id = await getCompanyIdFromName(companyId);
  const query = 'INSERT INTO online_assessment (company_id, assessment_platform, assessment_date, status, scored, max_score, season_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  const params = [internal_company_id, data.platform, data.date, data.status, data.scored, data.total, data.season];
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, params, (error, results) => {
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
    throw new Error(`Internal server error for creating online assessment for ${companyId}`);
  }
}

const createCompany = async (companyName, userEmail) => {
  console.log('createCompany');
  const query = 'INSERT INTO requested_companies (company_name, user_email) VALUES ($1, $2) RETURNING *';
  const params = [companyName, userEmail];
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) {
          reject(error);
        } else if (results && results.rows && results.rows.length > 0) {
          resolve(results.rows[0]);
        } else {
          reject(new Error('No results found'));
        }
      });
    }
    )
  }
  catch (error) {
    console.error(error.message);
    throw new Error('Internal server error for creating company');
  }
}

const createScoreReport = async (explanation, selectedScores) => {
  console.log('createScoreReport');
  const query = 'INSERT INTO score_reports (selected_scores, explanation) VALUES ($1, $2) RETURNING *';
  const params = [selectedScores, explanation];
  if (explanation.length > 5000) {
    throw new Error('Explanation is too long');
  }
  try {
    return await new Promise((resolve, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) {
          reject(error);
        } else if (results && results.rows && results.rows.length > 0) {
          resolve(results.rows[0]);
        } else {
          reject(new Error('No results found'));
        }
      });
    }
    )
  }
  catch (error) {
    console.error(error.message);
    throw new Error('Internal server error for creating score report');
  }
}


module.exports = {
  getSeasons,
  getCompanyTypes,
  getCompanies,
  getCompany,
  getCompanyOnlineAssessment,
  createCompanyOnlineAssessment,
  getScorePosition,
  getOnlineAssessmentStats,
  createCompany,
  createScoreReport
};