const express = require('express')
const app = express()
const port = 3001

const company_model = require('./companyModel');

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get('/', (req, res) => {
  company_model.getCompanies()
    .then((companies) => {
      res.status(200).json(companies);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})