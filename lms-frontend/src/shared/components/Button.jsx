import PropTypes from "prop-types";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";

  const variants = {
    primary: "bg-primary hover:bg-primary-2 text-white focus:ring-primary/50",
    secondary:
      "bg-secondary hover:bg-blue-700 text-white focus:ring-secondary/50",
    accent: "bg-accent hover:bg-pink-600 text-white focus:ring-accent/50",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary/50",
    ghost: "text-primary hover:bg-primary/10 hover:text-primary-2",
    danger: "bg-error hover:bg-red-600 text-white focus:ring-error/50",
    surface: "bg-white text-primary hover:bg-gray-100 focus:ring-white/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "accent",
    "outline",
    "ghost",
    "danger",
    "surface",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
