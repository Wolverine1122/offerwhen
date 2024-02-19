import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import propTypes from "prop-types";
import BasicTable from "../../components/BasicTable/BasicTable";
import NewPost from "./NewPost";
import { fetchOnlineAssessmentData } from "./Api";
import COLUMNS from "./columns";
import chevronLeft from "../../icons/chevron-left.svg";
import chevronRight from "../../icons/chevron-right.svg";
import "./online-assessment.css";

const OnlineAssessment = ({ company }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [queryCursor, setQueryCursor] = useState("2020-02-14T12:00:00Z");
  const [queryLimit, setQueryLimit] = useState(10);

  const onNextPage = () => {
    setQueryCursor(queryCursor + queryLimit);
  };

  const onPrevPage = () => {
    setQueryCursor(queryCursor - queryLimit);
  };

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["company", company, queryCursor, queryLimit],
    keepPreviousData: true,
    queryFn: () => fetchOnlineAssessmentData(company, queryCursor, queryLimit),
  });

  const handleRowSelect = (rows) => {
    setSelectedRows(rows);
  };

  const handleQueryLimit = (limit) => {
    setQueryLimit(limit);
  };

  return (
    <div className="oa-section">
      <h2>OA: {}</h2>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error fetching data</div>}
      {isSuccess && (
        <div className="oa-table">
          <BasicTable
            column_struct={COLUMNS}
            company_data={data}
            onSelectedRows={handleRowSelect}
            manualPagination={true}
          />
        </div>
      )}
      <pre>{JSON.stringify({ selectedRows }, null, 2)}</pre>
      <div className="pagination-controls">
        <div className="jump-controls">
          <button onClick={onPrevPage} className="prev">
            <img src={chevronLeft} alt="prev" />
          </button>
          <button onClick={onNextPage} className="next">
            <img src={chevronRight} alt="next" />
          </button>
        </div>
        <div className="pagesize-controls">
          <select
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
      <div className="modify">
        <button className="add" onClick={() => <NewPost />}>
          Add
        </button>
        <button className="report">Report</button>
      </div>
    </div>
  );
};

OnlineAssessment.propTypes = {
  company: propTypes.string.isRequired,
};

export default OnlineAssessment;
