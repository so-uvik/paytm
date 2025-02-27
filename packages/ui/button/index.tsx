import * as React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  appName?: string;
  onClick?: () => void | Promise<any>;
}

export function Button({ children, className, appName, onClick }: ButtonProps) {
  return (
    <button 
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
} 