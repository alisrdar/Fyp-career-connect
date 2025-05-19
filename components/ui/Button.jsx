import React from "react";
import { twMerge } from "tailwind-merge";

const Button = ({
  btnText,
  disabled = false,
  loading = false,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  iconLeft,
  iconRight,
  onClick,
  className = "",
}) => {
  const baseStyle = `
    rounded-lg font-medium transition-all duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    hover:shadow-sm active:scale-[.98] cursor-pointer transition-colors
  `;

  const sizeVariants = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary: `
      bg-primary text-white
      hover:bg-primary/90
      dark:bg-muted dark:text-white dark:hover:bg-muted/80
      focus-visible:ring-primary/60
    `,
    secondary: `
      border border-primary text-primary bg-transparent
      hover:bg-accent/20 hover:text-primary
      dark:border-muted dark:text-muted dark:hover:bg-muted/20
      focus-visible:ring-primary/40
    `,
    ghost: `
      bg-transparent text-primary
      hover:bg-primary/10
      dark:text-muted dark:hover:bg-muted/10
      focus-visible:ring-primary/30
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        baseStyle,
        sizeVariants[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <span className="h-4 w-4 border-t-2 border-white animate-spin rounded-full" />
        ) : (
          <>
            {iconLeft && <span>{iconLeft}</span>}
            {btnText}
            {iconRight && <span>{iconRight}</span>}
          </>
        )}
      </div>
    </button>
  );
};

export default Button;
