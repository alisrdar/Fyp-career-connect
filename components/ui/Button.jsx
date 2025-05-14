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
  const baseStyle =
    "rounded-lg font-semibold transition duration-200 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/40 hover:shadow-sm active:scale-[.98]";

  const sizeVariants = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-primary text-white dark:bg-muted hover:bg-primary/90 dark:hover:bg-muted/80 focus-visible:ring-primary/60",

    secondary:
      "bg-transparent border border-primary text-primary hover:bg-primary/10 hover:text-primary dark:border-muted dark:text-muted dark:hover:bg-muted/20 dark:hover:text-muted",

    ghost:
      "bg-transparent text-primary dark:text-muted hover:bg-primary/5 hover:text-primary dark:hover:bg-muted/10 dark:hover:text-muted"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        baseStyle,
        sizeVariants[size],
        variants[variant],
        fullWidth ? "w-full" : "",
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
