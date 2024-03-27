import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import { fetchCompanies, fetchSeasons, fetchCompanyTypes } from "../../Api";
import InfoPopUp from "../../components/InfoPopUp/InfoPopUp";
import info from "../../icons/info.svg";
import NewCompany from "../../components/NewCompany/NewCompany";
import chevronLeft from "../../icons/chevron-left.svg";
import chevronRight from "../../icons/chevron-right.svg";
import "./companies.css";

const Companies = () => {
  const [seasons, setSeasons] = useState([{ id: null, name: "All" }]);
  const [companyTypes, setcompanyTypes] = useState([
    { id: null, name: "General" },
  ]);
  const [showInfo, setShowInfo] = useState(false);
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [queryCursorId, setQueryCursorId] = useState(null);
  const [queryEntriesId, setQueryEntriesId] = useState(null);
  const [queryLimit, setQueryLimit] = useState(5);
  const [direction, setDirection] = useState("next");

  const [searchParams, setSearchParams] = useSearchParams({
    search: "",
    season: "All",
    companyType: "General",
  });

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: [
      "companies",
      queryCursorId,
      queryEntriesId,
      queryLimit,
      direction,
      searchParams,
    ],
    keepPreviousData: true,
    queryFn: () =>
      fetchCompanies(
        searchParams,
        queryCursorId,
        queryEntriesId,
        queryLimit,
        direction,
      ),
  });

  const seasonQuery = useQuery({
    queryKey: ["seasons"],
    queryFn: () => fetchSeasons(),
  });

  const companyTypesQuery = useQuery({
    queryKey: ["companyTypes"],
    queryFn: () => fetchCompanyTypes(),
  });

  useEffect(() => {
    if (seasonQuery.isSuccess) {
      setSeasons(seasonQuery.data);
    }
  }, [seasonQuery]);

  useEffect(() => {
    if (companyTypesQuery.isSuccess) {
      setcompanyTypes(companyTypesQuery.data);
    }
  }, [companyTypesQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onNextPage = () => {
    if (data.data && data.data.length > 0) {
      setDirection("next");
      const lastCompanyId = data.data[data.data.length - 1].company_id;
      const lastEntryId = data.data[data.data.length - 1].entries;
      setQueryCursorId(lastCompanyId);
      setQueryEntriesId(lastEntryId);
    }
  };

  const onPrevPage = () => {
    if (data.data && data.data.length > 0) {
      setDirection("prev");
      const firstCompanyId = data.data[0].company_id;
      const firstEntryId = data.data[0].entries;
      setQueryCursorId(firstCompanyId);
      setQueryEntriesId(firstEntryId);
    }
  };

  const disablePrevButton = () => {
    return (
      !isSuccess || !data.data || data.data.length === 0 || !data.hasPrevPage
    );
  };

  const disableNextButton = () => {
    return (
      !isSuccess || !data.data || data.data.length === 0 || !data.hasNextPage
    );
  };

  const handleQueryLimit = (limit) => {
    setDirection("same_large");
    setQueryLimit(limit);
    const firstCompanyId = data.data[0].company_id;
    const firstEntryId = data.data[0].entries;
    setQueryCursorId(firstCompanyId);
    setQueryEntriesId(firstEntryId);
  };

  return (
    <div className="companies">
      <div className="basic-info-filter">
        <h1>Companies</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchParams.get("search")}
            placeholder="Search"
            onChange={(e) =>
              setSearchParams({ ...searchParams, search: e.target.value })
            }
          />
          <select
            value={searchParams.get("season")}
            onChange={(e) =>
              setSearchParams({ ...searchParams, season: e.target.value })
            }
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.name}>
                {season.name}
              </option>
            ))}
          </select>
          <select
            value={searchParams.get("companyType")}
            onChange={(e) =>
              setSearchParams({ ...searchParams, companyType: e.target.value })
            }
          >
            {companyTypes.map((companyType) => (
              <option key={companyType.id} value={companyType.name}>
                {companyType.name}
              </option>
            ))}
          </select>
          <button type="submit">Search</button>
        </form>
        <button
          className="icon-wrapper-button"
          onClick={() => setShowInfo(true)}
        >
          What do these cards mean?
          <img src={info} alt="info" />
        </button>
      </div>
      {showInfo && <InfoPopUp />}
      {isLoading && <div>Loading...</div>}
      {isError && <div>Companies not found</div>}
      {isSuccess && (
        <div className="company-cards-grid-wrapper">
          <div className="modify">
            <button
              className="add-button regular-button"
              onClick={() => setShowNewCompany(true)}
            >
              Add Company
            </button>
          </div>
          <div className="company-cards-grid">
            {data.data.map((company) => (
              <CompanyCard key={company.company_id} company={company} />
            ))}
          </div>
        </div>
      )}
      <div className="pagination-controls">
        <div className="jump-controls">
          <button
            onClick={onPrevPage}
            className="prev icon-button"
            disabled={disablePrevButton()}
          >
            <img src={chevronLeft} alt="prev" />
          </button>
          <button
            onClick={onNextPage}
            className="next icon-button"
            disabled={disableNextButton()}
          >
            <img src={chevronRight} alt="next" />
          </button>
        </div>
        <div className="pagesize-controls">
          <div className="custom-select">
            <select
              className="regular-select"
              value={queryLimit}
              onChange={(e) => handleQueryLimit(Number(e.target.value))}
            >
              {[5, 10, 25, 50].map((queryLimit) => (
                <option key={queryLimit} value={queryLimit}>
                  Show {queryLimit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {showNewCompany && (
        <NewCompany handleShowNewCompany={setShowNewCompany} />
      )}
    </div>
  );
};

export default Companies;
