import PropTypes from "prop-types";
import "./bullet-list.css";
import chevronRight from "../../icons/chevron-right.svg";

const BulletList = ({ items }) => {
  return (
    <ul className="bullet-list-with-images">
      {items.map((item, index) => (
        <li key={index} className="bullet-with-images">
          <img src={chevronRight} alt="chevron left" />
          {item}
        </li>
      ))}
    </ul>
  );
};

BulletList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BulletList;
