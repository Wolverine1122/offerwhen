const express = require('express')
const app = express()
const port = 3001

const company_model = require('./companyModel');

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get('/api/seasons', async (req, res) => {
  try {
    const seasons = await company_model.getSeasons();
    res.status(200).json(seasons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/companyTypes', async (req, res) => {
  try {
    const companyTypes = await company_model.getCompanyTypes();
    res.status(200).json(companyTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/companies', async (req, res) => {
  const { cursorId, entriesId, limit, direction, search, season, companyType } = req.query;
  const searchParams = { search, season, companyType };
  const safeCursorId = cursorId === 'null' ? null : cursorId;
  const safeEntriesId = entriesId === 'null' ? null : entriesId;
  try {
    const initialResults = await company_model.getCompanies(safeCursorId, safeEntriesId, parseInt(limit), direction, searchParams);
    let hasNextPage = false;
    let hasPrevPage = false;
    if (initialResults.length > 0) {
      const nextPageCompanyCursorId = initialResults[initialResults.length - 1].company_id;
      const nextPageEntriesCursorId = initialResults[initialResults.length - 1].entries;
      const nextPageResults = await company_model.getCompanies(nextPageCompanyCursorId, nextPageEntriesCursorId, 1, "next", searchParams);

      const prevPageCompanyCursorId = initialResults[0].company_id;
      const prevPageEntriesCursorId = initialResults[0].entries;
      const prevPageResults = await company_model.getCompanies(prevPageCompanyCursorId, prevPageEntriesCursorId, 1, "prev", searchParams);
      hasNextPage = nextPageResults.length > 0;
      hasPrevPage = prevPageResults.length > 0;
    }

    res.status(200).json({
      data: initialResults,
      hasPrevPage,
      hasNextPage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/companies/:companyId', async (req, res) => {
  const { companyId } = req.params;
  try {
    const company = await company_model.getCompany(companyId);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/companies/:companyId/oa', async (req, res) => {
  const { companyId } = req.params;
  const { cursorDate, cursorId, limit, direction, selectedSeason } = req.query;
  const safeCursorId = cursorId === 'null' ? null : cursorId;
  try {
    const initialResults = await company_model.getCompanyOnlineAssessment(companyId, cursorDate, safeCursorId, parseInt(limit), direction, parseInt(selectedSeason));
    let hasNextPage = false;
    let hasPrevPage = false;

    if (initialResults.length > 0) {
      const nextPageCursorId = initialResults[initialResults.length - 1].assessment_id;
      const nextPageCursorDate = initialResults[initialResults.length - 1].entry_date.toISOString();
      const nextPageResults = await company_model.getCompanyOnlineAssessment(companyId, nextPageCursorDate, nextPageCursorId, 1, "next", parseInt(selectedSeason));

      const prevPageCursorId = initialResults[0].assessment_id;
      const prevPageCursorDate = initialResults[0].entry_date.toISOString();
      const prevPageResults = await company_model.getCompanyOnlineAssessment(companyId, prevPageCursorDate, prevPageCursorId, 1, "prev", parseInt(selectedSeason));
      hasNextPage = nextPageResults.length > 0;
      hasPrevPage = prevPageResults.length > 0;
    }

    res.status(200).json({
      data: initialResults,
      hasPrevPage,
      hasNextPage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/companies/:companyId/oa', async (req, res) => {
  const { companyId } = req.params;
  const data = req.body;
  try {
    const newAssessment = await company_model.createCompanyOnlineAssessment(companyId, data);
    res.status(201).json(newAssessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/companies', async (req, res) => {
  const data = req.body;
  try {
    const newCompany = await company_model.createCompany(data.companyName, data.userEmail);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scoreReports', async (req, res) => {
  const data = req.body;
  try {
    const newScoreReport = await company_model.createScoreReport(data.explanation, data.selectedScores);
    res.status(201).json(newScoreReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});