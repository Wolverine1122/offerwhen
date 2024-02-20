import axios from "axios";

const fetchCompanies = () => {
  return axios
    .get("http://localhost:3001/api/companies")
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
) => {
  return axios
    .get(
      `http://localhost:3001/api/companies/${companyId}/oa?cursorDate=${cursorDate}&cursorId=${cursorId}&limit=${limit}&direction=${direction}`,
    )
    .then((res) => res.data);
};

const createNewOnlineAssessmentData = (company, data) => {
  return axios
    .post(`http://localhost:3001/api/companies/${company}/oa`, data)
    .then((res) => res.data);
};

export {
  fetchCompanies,
  fetchCompany,
  fetchOnlineAssessmentData,
  createNewOnlineAssessmentData,
};
