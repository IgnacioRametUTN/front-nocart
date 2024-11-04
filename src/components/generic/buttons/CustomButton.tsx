// CustomButton.tsx
import React from "react";

interface CustomButtonProps {
  color: string;
  size: number;
  styles?: string[];
  icon: React.ComponentType;
  className?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ color, size, icon: Icon, onClick, className , ...styles }) => (
  <button className={className? className : ""} style={{ color, fontSize: size , ...styles}} onClick={onClick}>
    <Icon />
  </button>
);

export default CustomButton;
