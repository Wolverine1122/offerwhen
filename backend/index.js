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
  try {
    const companies = await company_model.getCompanies();
    res.status(200).json(companies);
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
  const { cursorDate, cursorId, limit, direction } = req.query;
  const safeCursorId = cursorId === 'null' ? null : cursorId;
  try {
    const initialResults = await company_model.getCompanyOnlineAssessment(companyId, cursorDate, safeCursorId, limit, direction);
    let hasNextPage = false;
    let hasPrevPage = false;

    if (initialResults.length > 0) {
      const nextPageCursorId = initialResults[initialResults.length - 1].assessment_id;
      const nextPageCursorDate = initialResults[initialResults.length - 1].entry_date.toISOString();
      const nextPageResults = await company_model.getCompanyOnlineAssessment(companyId, nextPageCursorDate, nextPageCursorId, 1, "next");

      const prevPageCursorId = initialResults[0].assessment_id;
      const prevPageCursorDate = initialResults[0].entry_date.toISOString();
      const prevPageResults = await company_model.getCompanyOnlineAssessment(companyId, prevPageCursorDate, prevPageCursorId, 1, "prev");
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

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});