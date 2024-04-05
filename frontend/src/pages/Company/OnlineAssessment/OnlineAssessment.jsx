import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import propTypes from "prop-types";
import BasicTable from "../../../components/BasicTable/BasicTable";
import NewPost from "../../../components/NewPost/NewPost";
import { fetchOnlineAssessmentData } from "../../../Api";
import COLUMNS from "../columns";
import chevronLeft from "../../../icons/chevron-left.svg";
import chevronRight from "../../../icons/chevron-right.svg";
import "./online-assessment.css";
import NewScoreReport from "../../../components/NewScoreReport/NewScoreReport";

const OnlineAssessment = ({ company, seasons, selectedSeason }) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [queryCursorDate, setQueryCursorDate] = useState(
    new Date().toISOString(),
  );
  const [queryCursorId, setQueryCursorId] = useState(null);
  const [queryLimit, setQueryLimit] = useState(10);
  const [direction, setDirection] = useState("next");
  const [showNewPost, setShowNewPost] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: [
      "company",
      company,
      queryCursorDate,
      queryCursorId,
      queryLimit,
      direction,
      selectedSeason,
    ],
    keepPreviousData: true,
    queryFn: () =>
      fetchOnlineAssessmentData(
        company,
        queryCursorDate,
        queryCursorId,
        queryLimit,
        direction,
        selectedSeason,
      ),
  });

  const queryInfo = {
    company: company,
    queryCursorDate: queryCursorDate,
    queryCursorId: queryCursorId,
    queryLimit: queryLimit,
    direction: direction,
    selectedSeason: selectedSeason,
  };

  let tableData = data?.data || [];
  tableData = tableData.map((row) => {
    const season = seasons.find((season) => season.id === row.season_id);
    return { ...row, season_id: season?.name || "All seasons" };
  });

  const handleRowSelect = (rows) => {
    setSelectedRows(rows);
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

  const onNextPage = () => {
    if (data.data && data.data.length > 0) {
      setDirection("next");
      const earliestEntryDate = data.data[data.data.length - 1].entry_date;
      const earliestEntryId = data.data[data.data.length - 1].assessment_id;
      setQueryCursorDate(earliestEntryDate);
      setQueryCursorId(earliestEntryId);
    }
  };

  const onPrevPage = () => {
    if (data.data && data.data.length > 0) {
      setDirection("prev");
      const latestEntryDate = data.data[0].entry_date;
      const latestEntryId = data.data[0].assessment_id;
      setQueryCursorDate(latestEntryDate);
      setQueryCursorId(latestEntryId);
    }
  };

  const handleQueryLimit = (limit) => {
    setDirection("same_large");
    const latestEntryDate = data.data[0].entry_date;
    const latestEntryId = data.data[0].assessment_id;
    setQueryCursorDate(latestEntryDate);
    setQueryCursorId(latestEntryId);
    setQueryLimit(limit);
  };

  return (
    <div className="oa-section">
      <h2>Online Assessments (OA):</h2>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching data</div>}
      {isSuccess && (
        <div className="oa-table">
          <div className="modify">
            <button
              className="add-button regular-button"
              onClick={() => setShowNewPost(true)}
            >
              Add
            </button>
            <button
              className="report-button regular-button"
              onClick={() => setShowReport(true)}
            >
              Report
            </button>
          </div>
          <BasicTable
            column_struct={COLUMNS}
            company_data={tableData}
            onSelectedRows={handleRowSelect}
            manualPagination={true}
          />
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
              {[10, 25, 50].map((queryLimit) => (
                <option key={queryLimit} value={queryLimit}>
                  Show {queryLimit}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {showNewPost && (
        <NewPost
          queryInfo={queryInfo}
          handleShowNewPost={setShowNewPost}
          handleQueryDate={setQueryCursorDate}
          seasons={seasons}
        />
      )}
      {showReport && (
        <NewScoreReport
          handleShowNewScoreReport={setShowReport}
          selectedScores={selectedRows}
        />
      )}
    </div>
  );
};

OnlineAssessment.propTypes = {
  company: propTypes.string.isRequired,
  seasons: propTypes.array.isRequired,
  selectedSeason: propTypes.number.isRequired,
};

export default OnlineAssessment;
