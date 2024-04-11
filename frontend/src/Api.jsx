import axios from "axios";

const fetchCompanies = (
  searchParamsForQuery,
  cursorId,
  entriesId,
  limit,
  direction,
) => {
  const searchParams = new URLSearchParams(searchParamsForQuery).toString();
  return axios
    .get(
      `http://localhost:3001/api/companies?cursorId=${cursorId}&entriesId=${entriesId}&limit=${limit}&direction=${direction}&${searchParams}`,
    )
    .then((res) => res.data);
};

const fetchSeasons = () => {
  return axios.get("http://localhost:3001/api/seasons").then((res) => res.data);
};

const fetchCompanyTypes = () => {
  return axios
    .get("http://localhost:3001/api/companyTypes")
    .then((res) => res.data);
};

const fetchCompany = (companyId) => {
  return axios
    .get(`http://localhost:3001/api/companies/${companyId}`)
    .then((res) => res.data);
};

const fetchOnlineAssessmentData = (
  companyId,
  cursorDate,
  cursorId,
  limit,
  direction = "next",
  selectedSeaon,
) => {
  return axios
    .get(
      `http://localhost:3001/api/companies/${companyId}/oa?cursorDate=${cursorDate}&cursorId=${cursorId}&limit=${limit}&direction=${direction}&selectedSeason=${selectedSeaon}`,
    )
    .then((res) => res.data);
};

const fetchScorePosition = (
  company,
  selectedSeason,
  selectedPlatform,
  scored,
  total,
) => {
  return axios
    .get(
      `http://localhost:3001/api/scorePosition?company=${company}&selectedSeason=${selectedSeason}&selectedPlatform=${selectedPlatform}&scored=${scored}&total=${total}`,
    )
    .then((res) => res.data);
};

const fetchOnlineAssessmentStats = (company, selectedSeason) => {
  return axios
    .get(
      `http://localhost:3001/api/companies/${company}/oa/stats?selectedSeason=${selectedSeason}`,
    )
    .then((res) => res.data);
};

const createNewOnlineAssessmentData = (newOAData) => {
  return axios
    .post(
      `http://localhost:3001/api/companies/${newOAData.company}/oa`,
      newOAData.data,
    )
    .then((res) => res.data);
};

const createNewCompany = (newCompany) => {
  return axios
    .post("http://localhost:3001/api/companies", newCompany)
    .then((res) => res.data);
};

const createNewScoreReport = (newScoreReport) => {
  return axios
    .post("http://localhost:3001/api/scoreReports", newScoreReport)
    .then((res) => res.data);
};

export {
  fetchCompanies,
  fetchSeasons,
  fetchCompanyTypes,
  fetchCompany,
  fetchOnlineAssessmentData,
  fetchScorePosition,
  fetchOnlineAssessmentStats,
  createNewOnlineAssessmentData,
  createNewCompany,
  createNewScoreReport,
};
