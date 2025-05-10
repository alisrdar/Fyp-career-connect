import React from 'react'

const Button = ({btnText, disabled=false,type="button", variant= "primary", onClick, className =""}) => {
  const baseStyle = "px-5 py-2.5 rounded-lg font-semibold transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 hover:shadow-sm";

    const variants = {
        primary: "bg-primary dark:bg-muted text-white hover:bg-primary/50",
        secondary: "border border-primary text-primary hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary",
        ghost: "text-primary dark:text-foreground-dark  hover:bg-primary/20 hover:text-primary dark:hover:bg-muted/20 dark:hover:text-white"
    };
  return (
    <button
        type={type}
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]} ${className}   `}
        disabled={disabled}
    >
        {btnText}

    </button>
  )
}

export default Button
