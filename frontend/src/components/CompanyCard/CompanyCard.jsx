import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./company-card.css";

const CompanyCard = ({ company }) => {
  const navigate = useNavigate();
  let logoBase64 = null;
  if (company && company.logo) {
    const bytes = new Uint8Array(company.logo.data);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    logoBase64 = "data:image/png;base64," + btoa(binary);
  }

  const handleClick = () => {
    navigate("/companies/" + company.name);
  };

  return (
    <div className="company-card" onClick={handleClick}>
      <div className="basic-info">
        <div className="logo">
          {company.logo && <img src={logoBase64} alt={company.name} />}
        </div>
        <div className="company-info">
          <div className="company-name-container">
            <h2 className="company-name">{company.name}</h2>
          </div>
          <p>Entries: {company.entries}</p>
        </div>
      </div>
    </div>
  );
};

CompanyCard.propTypes = {
  company: PropTypes.shape({
    company_id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    logo: PropTypes.object.isRequired,
    entries: PropTypes.number.isRequired,
  }).isRequired,
};

export default CompanyCard;
