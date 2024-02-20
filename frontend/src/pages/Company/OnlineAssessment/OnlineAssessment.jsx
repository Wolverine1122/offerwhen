import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import propTypes from "prop-types";
import BasicTable from "../../../components/BasicTable/BasicTable";
import NewPost from "../NewPost";
import { fetchOnlineAssessmentData } from "../../../Api";
import COLUMNS from "../columns";
import chevronLeft from "../../../icons/chevron-left.svg";
import chevronRight from "../../../icons/chevron-right.svg";
import "./online-assessment.css";

const OnlineAssessment = ({ company }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [queryCursorDate, setQueryCursorDate] = useState(
    new Date().toISOString(),
  );
  const [queryCursorId, setQueryCursorId] = useState(null);
  const [queryLimit, setQueryLimit] = useState(5);
  const [direction, setDirection] = useState("next");

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: [
      "company",
      company,
      queryCursorDate,
      queryCursorId,
      queryLimit,
      direction,
    ],
    keepPreviousData: true,
    queryFn: () =>
      fetchOnlineAssessmentData(
        company,
        queryCursorDate,
        queryCursorId,
        queryLimit,
        direction,
      ),
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
              onClick={() => <NewPost />}
            >
              Add
            </button>
            <button className="report-button regular-button">Report</button>
          </div>
          <BasicTable
            column_struct={COLUMNS}
            company_data={data.data}
            onSelectedRows={handleRowSelect}
            manualPagination={true}
          />
        </div>
      )}
      <div className="pagination-controls">
        <div className="jump-controls">
          <button
            onClick={onPrevPage}
            className="prev"
            disabled={disablePrevButton()}
          >
            <img src={chevronLeft} alt="prev" />
          </button>
          <button
            onClick={onNextPage}
            className="next"
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
      <pre>{JSON.stringify({ selectedRows }, null, 2)}</pre>
    </div>
  );
};

OnlineAssessment.propTypes = {
  company: propTypes.string.isRequired,
};

export default OnlineAssessment;
