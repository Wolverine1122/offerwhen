import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import OnlineAssessment from "./OnlineAssessment/OnlineAssessment";
import { fetchCompany, fetchSeasons } from "../../Api";
import "./company.css";

const Company = () => {
  const { id } = useParams();
  const [seasons, setSeasons] = useState([{ id: null, name: "All seasons" }]);
  const [season, setSeason] = useState("All seasons");
  const [searchParams, setSearchParams] = useSearchParams({
    season: "All seasons",
  });

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["companies", id, season],
    queryFn: () => fetchCompany(id, season),
  });

  const seasonQuery = useQuery({
    queryKey: ["seasons"],
    queryFn: () => fetchSeasons(),
  });

  useEffect(() => {
    if (seasonQuery.isSuccess) {
      setSeasons(seasonQuery.data);
    }
  }, [seasonQuery]);

  let logoBase64 = null;
  if (data && data.logo) {
    const bytes = new Uint8Array(data.logo.data);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    logoBase64 = "data:image/png;base64," + btoa(binary);
  }

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    setSeason(searchParams.get("season"));
  };

  const getSeasonIdFromName = (name) => {
    const season = seasons.find((season) => season.name === name);
    return season?.id || 7;
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Company not found</div>}
      {isSuccess && (
        <div className="company">
          <div className="basic-info">
            <div className="logo">
              {data.logo && <img src={logoBase64} alt={data.name} />}
            </div>
            <div className="company-info">
              <h1>
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  {data.name}
                </a>
              </h1>
              <p className="company-about">{data.about}</p>
            </div>
          </div>
          <form onSubmit={handleSubmitFilter} className="season-filter">
            <div className="custom-select">
              <select
                value={searchParams.get("season")}
                className="regular-select"
                onChange={(e) => {
                  const newSearchParams = new URLSearchParams(
                    searchParams.toString(),
                  );
                  newSearchParams.set("season", e.target.value);
                  setSearchParams(newSearchParams);
                }}
              >
                {seasons.map((season) => (
                  <option key={season.id} value={season.name}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="regular-button">
                Search
              </button>
            </div>
          </form>
          <OnlineAssessment
            company={id}
            seasons={seasons}
            selectedSeason={getSeasonIdFromName(season)}
          />
        </div>
      )}
    </>
  );
};

export default Company;
