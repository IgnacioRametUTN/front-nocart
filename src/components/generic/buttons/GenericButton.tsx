import React, { } from 'react';

interface ButtonProps {
  color: string;
  icon: React.ComponentType;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  size?: number;
  text?: string;
  className?: string;
}

const GenericButton: React.FC<ButtonProps> = ({ color, icon: Icon, onClick,  text = "", className = "", }) => {
  return (
    <button className={className}
      style={{ backgroundColor: color, padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
      onClick={onClick}
    >
      {Icon && <Icon />}
      {" " + text + " "}
    </button>
  )
}

export default GenericButton;