import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({ 
  variant = "primary", 
  size = "md", 
  className = "", 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#166F63] text-white hover:bg-[#1A7A6E] active:bg-[#145A52]",
    secondary: "bg-[#EDF2F0] text-[#1A7A6E] hover:bg-[#E0EAE7]",
    outline: "border-2 border-[#166F63] text-[#166F63] hover:bg-[#EDF2F0]",
    ghost: "text-[#166F63] hover:bg-[#EDF2F0]",
    danger: "bg-[#E53935] text-white hover:bg-[#D32F2F]",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
