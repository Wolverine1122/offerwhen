import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import propTypes from "prop-types";
import { fetchScorePosition } from "../../Api";
import "./score-position.css";

const ScorePosition = ({ company, selectedSeason, seasons }) => {
  const platformOptions = [
    "CodeSignal",
    "HackerRank",
    "Codility",
    "Karat",
    "Qualified.io",
    "Other",
  ];
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(platformOptions[0]);
  const [scored, setScored] = useState("");
  const [total, setTotal] = useState("");

  const { isError, data, isSuccess } = useQuery({
    queryKey: [
      "score-position",
      company,
      selectedSeason,
      selectedPlatform,
      scored,
      total,
    ],
    keepPreviousData: true,
    enabled: isQueryEnabled,
    queryFn: () =>
      fetchScorePosition(
        company,
        selectedSeason,
        selectedPlatform,
        scored,
        total,
      ),
  });

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    if (scored !== "" && total !== "") {
      setIsQueryEnabled(true);
    }
  };

  const getSeasonNameFromId = (id) => {
    const season = seasons.find((season) => season.id === id);
    return season?.name || "all";
  };

  return (
    <div className="score-position">
      <h3>Compare your score</h3>
      <form onSubmit={handleSubmitFilter} className="platform-filter">
        <div className="input-set">
          <label>Platform</label>
          <div className="custom-select">
            <select
              value={selectedPlatform}
              className="regular-select"
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
              }}
            >
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-set">
          <label>Scored</label>
          <input
            type="number"
            value={scored}
            placeholder="Scored"
            onChange={(e) => setScored(e.target.value)}
          />
        </div>
        <div className="input-set">
          <label>Total</label>
          <input
            type="number"
            value={total}
            placeholder="Total"
            onChange={(e) => setTotal(e.target.value)}
          />
        </div>
        <div className="submit-button">
          <button type="submit" className="action-button">
            Check
          </button>
        </div>
      </form>
      {isSuccess && typeof data !== "string" && (
        <div className="score-position-info">
          You are in the top {data}% of all {selectedPlatform} submissions in
          the {getSeasonNameFromId(selectedSeason)} season.
        </div>
      )}
      {isSuccess && typeof data === "string" && (
        <div className="error">{data}</div>
      )}
      {isError && <div className="error">Error fetching data</div>}
    </div>
  );
};

ScorePosition.propTypes = {
  company: propTypes.string.isRequired,
  selectedSeason: propTypes.number.isRequired,
  seasons: propTypes.array.isRequired,
};

export default ScorePosition;
