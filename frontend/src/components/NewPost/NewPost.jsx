import { useMutation, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { useState, useEffect } from "react";
import { createNewOnlineAssessmentData } from "../../Api";
import close from "../../icons/close.svg";
import "./new-post.css";

const NewPost = ({ queryInfo, handleShowNewPost, handleQueryDate }) => {
  const [date, setDate] = useState("");
  const [scored, setScored] = useState("");
  const [total, setTotal] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const platformsOptions = [
    "CodeSignal",
    "HackerRank",
    "Codility",
    "Karat",
    "Qualified.io",
    "Other",
  ];
  const statusOptions = ["Accepted", "Rejected"];

  const queryClient = useQueryClient();

  const createNewPostMutation = useMutation({
    mutationFn: createNewOnlineAssessmentData,
    onSuccess: () => {
      queryClient.invalidateQueries(
        [
          "company",
          queryInfo.company,
          queryInfo.queryCursorDate,
          queryInfo.queryCursorId,
          queryInfo.queryLimit,
          queryInfo.direction,
        ],
        {
          exact: true,
        },
      );
      handleShowNewPost(false);
      handleQueryDate(new Date().toISOString());
    },
  });

  useEffect(() => {
    const isFormValid =
      dateErrorMessage === "" &&
      date !== "" &&
      scored !== "" &&
      total !== "" &&
      platform !== "" &&
      status !== "";
    setIsSubmitDisabled(!isFormValid);
  }, [dateErrorMessage, date, scored, total, platform, status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewPostMutation.mutate({
      company: queryInfo.company,
      data: {
        date: date,
        scored: scored,
        total: total,
        platform: platform,
        status: status,
      },
    });
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    const inputDate = e.target.value;
    const isValidDate = /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(inputDate);
    if (!isValidDate) {
      setDateErrorMessage("MM/dd/YYYY format required");
    } else {
      const [month, day, year] = inputDate.split("/");
      const parsedMonth = parseInt(month, 10);
      const parsedDay = parseInt(day, 10);
      const parsedYear = parseInt(year, 10);
      if (
        parsedMonth < 1 ||
        parsedMonth > 12 ||
        parsedDay < 1 ||
        parsedDay > 31 ||
        parsedYear < 2010
      ) {
        setDateErrorMessage("Invalid date. Stop playin");
      } else {
        const userEnteredDate = new Date(
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        );
        const currentDate = getCurrentDate();
        if (userEnteredDate > new Date(currentDate)) {
          setDateErrorMessage("Date cannot be in the future");
        } else {
          setDateErrorMessage("");
        }
      }
    }
  };

  return (
    <div className="new-post">
      <div className="close-button">
        <button
          onClick={() => handleShowNewPost(false)}
          className="close icon-button"
        >
          <img src={close} alt="close button" />
        </button>
      </div>
      {createNewPostMutation.isError &&
        JSON.stringify(createNewPostMutation.error)}
      <div className="title">
        <h2>New Post</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-set">
          <label htmlFor="date">Date you took the OA (MM/dd/YYYY):</label>
          <input
            type="text"
            value={date}
            placeholder="MM/dd/YYYY"
            pattern="\d{1,2}/\d{1,2}/\d{4}"
            onChange={handleDateChange}
          />
          {dateErrorMessage && (
            <span className="error-message">{dateErrorMessage}</span>
          )}
        </div>
        <div className="input-set">
          <label htmlFor="scored">Scored:</label>
          <input
            type="number"
            value={scored}
            onChange={(e) => setScored(e.target.value)}
            placeholder="Scored"
          />
        </div>
        <div className="input-set">
          <label htmlFor="total">Total:</label>
          <input
            type="number"
            value={total}
            placeholder="Total"
            onChange={(e) => setTotal(e.target.value)}
          />
        </div>
        <div className="input-set">
          <label htmlFor="platform-select">Platform:</label>
          <div className="custom-select">
            <select
              className="regular-select"
              value={platform}
              id="platform-select"
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">Select platform</option>
              {platformsOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-set">
          <label htmlFor="status-select">Status:</label>
          <div className="custom-select">
            <select
              className="regular-select"
              value={status}
              id="status-select"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select status</option>
              {statusOptions.map((decision) => (
                <option key={decision} value={decision.toLowerCase()}>
                  {decision}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          disabled={createNewPostMutation.isLoading || isSubmitDisabled}
          type="submit"
          className="action-button"
        >
          {createNewPostMutation.isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

NewPost.propTypes = {
  queryInfo: propTypes.shape({
    company: propTypes.string.isRequired,
    queryCursorDate: propTypes.string.isRequired,
    queryCursorId: propTypes.oneOfType([
      propTypes.number,
      propTypes.instanceOf(null),
    ]),
    queryLimit: propTypes.number.isRequired,
    direction: propTypes.string.isRequired,
  }).isRequired,
  handleShowNewPost: propTypes.func.isRequired,
  handleQueryDate: propTypes.func.isRequired,
};

export default NewPost;
