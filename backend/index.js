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

app.get('/api/companies', (req, res) => {
  company_model.getCompanies()
    .then((companies) => {
      res.status(200).json(companies);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.get('/api/companies/:companyId', (req, res) => {
  company_model.getCompany(req.params.companyId)
    .then((company) => {
      res.status(200).json(company);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.get('/api/companies/:companyId/oa', (req, res) => {
  company_model.getCompanyOnlineAssessment(req.params.companyId, req.query.cursor, req.query.limit)
    .then((onlineAssessment) => {
      res.status(200).json(onlineAssessment);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
});