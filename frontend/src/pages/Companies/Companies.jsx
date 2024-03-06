import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import { fetchCompanies, fetchSeasons, fetchCompanyTypes } from "../../Api";
import InfoPopUp from "../../components/InfoPopUp/InfoPopUp";
import info from "../../icons/info.svg";
import "./companies.css";

const Companies = () => {
  const [seasons, setSeasons] = useState([{ id: null, name: "All" }]);
  const [companyTypes, setcompanyTypes] = useState([
    { id: null, name: "General" },
  ]);
  const [showInfo, setShowInfo] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams({
    search: "",
    season: "All",
    companyType: "General",
    page: 1,
  });
  let search = searchParams.get("search");

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["companies", search],
    queryFn: () => fetchCompanies(search),
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
        <div className="company-cards-grid">
          {data.map((company) => (
            <CompanyCard key={company.company_id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
