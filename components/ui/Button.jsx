import React from 'react'

const Button = ({btnText, variant= "primary", onClick, className =""}) => {
    const baseStyle= "px-5 cursor-pointer  py-2.5 rounded-lg  font-semibold transition duration-200 text-sm";
    const variants = {
        primary: "bg-primary dark:bg-muted text-white hover:bg-primary/50",
        secondary: "border border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "text-primary dark:text-foreground-dark  hover:bg-primary/20 hover:text-primary dark:hover:bg-muted/20 dark:hover:text-white"
    };
  return (
    <button
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]} ${className}   `}
    >
        {btnText}
    </button>
  )
}

export default Button
