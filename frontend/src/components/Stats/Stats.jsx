import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import "./stats.css";
import BulletList from "../BulletList/BulletList";
import { fetchOnlineAssessmentStats } from "../../Api";

const Stats = ({ selectedSeason, seasons, company }) => {
  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["stats", company, selectedSeason],
    keepPreviousData: true,
    queryFn: () => fetchOnlineAssessmentStats(company, selectedSeason),
  });

  const findSeasonNameById = (id, seasons) => {
    return seasons.find((season) => season.id === id)?.name || "All seasons";
  };

  return (
    <div className="oa-stats">
      <h3>Stats</h3>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching stats</p>}
      {isSuccess && typeof data !== "string" && (
        <>
          <p>
            Out of all accepted submissions in{" "}
            {findSeasonNameById(selectedSeason, seasons)}:
          </p>
          <BulletList
            items={[
              `Upper Quartile: ${data.upperQuartile}`,
              `Median: ${data.median}`,
              `Lower Quartile: ${data.lowerQuartile}`,
              `Minimum: ${data.minimum}`,
            ]}
          />
        </>
      )}
      {isSuccess && typeof data === "string" && (
        <p>No accepted submissions to do analysis</p>
      )}
    </div>
  );
};

Stats.propTypes = {
  selectedSeason: PropTypes.number,
  seasons: PropTypes.array,
  company: PropTypes.string,
};

export default Stats;
