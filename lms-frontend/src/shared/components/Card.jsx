import PropTypes from "prop-types";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-surface border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
