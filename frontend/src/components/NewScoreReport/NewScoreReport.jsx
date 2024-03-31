import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import PropTypes from "prop-types";
import "./new-score-report.css";
import close from "../../icons/close.svg";
import { createNewScoreReport } from "../../Api";

const NewScoreReport = ({ handleShowNewScoreReport, selectedScores }) => {
  const [explanation, setExplanation] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  let selectedScoresArray = [];
  for (const [key, value] of Object.entries(selectedScores)) {
    if (value) {
      selectedScoresArray.push(key);
    }
  }

  const createNewScoreReportMutation = useMutation({
    mutationFn: createNewScoreReport,
    onSuccess: () => {
      handleShowNewScoreReport(false);
    },
    onError: () => {
      setIsSubmitDisabled(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewScoreReportMutation.mutate({
      explanation: explanation,
      selectedScores: Object.keys(selectedScores),
    });
  };

  const handleExplanationChange = (e) => {
    setExplanation(e.target.value);
    if (e.target.value === "" || e.target.value.split(" ").join("") === "") {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
  };

  return (
    <div className="new-post new-score-report">
      <div className="close-button">
        <button
          onClick={() => handleShowNewScoreReport(false)}
          className="close icon-button"
        >
          <img src={close} alt="close button" />
        </button>
      </div>
      <div className="title">
        <h2>Sus Score Report</h2>
      </div>
      {selectedScoresArray.length === 0 ? (
        <p>You didn&apos;t select any specific score</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="show-selected-scores">
            <div className="display-selected-scores-wrapper">
              <p>You selected the following report IDs:</p>
              <pre className="selected-scores">
                {selectedScoresArray.join(", ")}
              </pre>
            </div>
          </div>
          <div className="explanation-wrapper">
            <label htmlFor="explanation">
              Please explanation why you think they are suspicious:
            </label>
            <textarea
              id="explanation"
              name="explanation"
              value={explanation}
              onChange={handleExplanationChange}
            />
          </div>
          {createNewScoreReportMutation.isError && (
            <div className="error-message">
              {createNewScoreReportMutation.error.message}
            </div>
          )}
          <button
            disabled={
              createNewScoreReportMutation.isLoading || isSubmitDisabled
            }
            type="submit"
            className="action-button"
          >
            {createNewScoreReportMutation.isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

NewScoreReport.propTypes = {
  handleShowNewScoreReport: PropTypes.func.isRequired,
  selectedScores: PropTypes.object.isRequired,
};

export default NewScoreReport;
