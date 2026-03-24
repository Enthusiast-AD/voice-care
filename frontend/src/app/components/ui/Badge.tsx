import React from "react";
import { getRiskColor, getRiskBgColor, type RiskLevel } from "../../data/mockData";

interface BadgeProps {
  children: React.ReactNode;
  variant?: RiskLevel | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  if (variant === "default") {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-[#EDF2F0] text-[#1A7A6E] ${className}`}>
        {children}
      </span>
    );
  }
  
  const bgColor = getRiskBgColor(variant);
  const textColor = getRiskColor(variant);
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs capitalize ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {children}
    </span>
  );
}
