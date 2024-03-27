import PropTypes from "prop-types";
import "./new-company.css";

const NewCompany = ({ handleShowNewCompany }) => {
  return (
    <div>
      <button onClick={() => handleShowNewCompany(false)}>Close</button>
    </div>
  );
};

NewCompany.propTypes = {
  handleShowNewCompany: PropTypes.func.isRequired,
};

export default NewCompany;
