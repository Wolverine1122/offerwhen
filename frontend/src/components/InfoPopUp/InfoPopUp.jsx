import PropTypes from "prop-types";
import BulletList from "../BulletList/BulletList";
import close from "../../icons/close.svg";
import "./info-popup.css";

const InfoPopUp = ({ handleShowInfo }) => {
  return (
    <div className="new-post">
      <div className="close-button">
        <button
          onClick={() => handleShowInfo(false)}
          className="close icon-button"
        >
          <img src={close} alt="close button" />
        </button>
      </div>
      <div className="card-info-popup">
        <p>
          We display the lowest scores reported that moved candidates to the
          next stage.
        </p>
        <hr />
        <p>
          Online assessments and technical interviews are quite straightforward:
          how many you solved divided by the total number of questions
        </p>
        <p>
          We understand that solving a problem is not always binary, so you can
          report if you halfway solved the problem or passed half of the tests.
        </p>
        <hr />
        <p>
          As for phone and behavioral interviews, we currently have four
          categories:
        </p>
        <BulletList items={["laid an egg", "meh", "decent", "rizzed up"]} />
      </div>
    </div>
  );
};

InfoPopUp.propTypes = {
  handleShowInfo: PropTypes.func.isRequired,
};

export default InfoPopUp;
