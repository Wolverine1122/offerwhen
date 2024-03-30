import PropTypes from "prop-types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createNewCompany } from "../../Api";
import close from "../../icons/close.svg";
import "./new-company.css";

const NewCompany = ({ handleShowNewCompany }) => {
  const [companyName, setCompanyName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const createNewCompanyMutation = useMutation({
    mutationFn: createNewCompany,
    onSuccess: () => {
      handleShowNewCompany(false);
      setCompanyName("");
      setUserEmail("");
    },
  });

  const handleCompanyName = (e) => {
    const companyName = e.target.value;
    if (companyName === "" || companyName.split(" ").join("") === "") {
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
    setCompanyName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewCompanyMutation.mutate({
      companyName: companyName,
      userEmail: userEmail,
    });
  };

  return (
    <div className="new-post new-company">
      <div className="close-button">
        <button
          onClick={() => handleShowNewCompany(false)}
          className="close icon-button"
        >
          <img src={close} alt="close button" />
        </button>
      </div>
      {createNewCompanyMutation.isError &&
        JSON.stringify(createNewCompanyMutation.error)}
      <div className="title">
        <h2>New Company Request</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-set">
          <label>Company Name:</label>
          <input type="text" value={companyName} onChange={handleCompanyName} />
        </div>
        <div className="input-set">
          <label htmlFor="email">Your email (optional):</label>
          <input
            type="email"
            name="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <p>We can email you when the company is added</p>
        <button
          type="submit"
          className="action-button"
          disabled={createNewCompanyMutation.isLoading || isSubmitDisabled}
        >
          {createNewCompany.isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

NewCompany.propTypes = {
  handleShowNewCompany: PropTypes.func.isRequired,
};

export default NewCompany;
