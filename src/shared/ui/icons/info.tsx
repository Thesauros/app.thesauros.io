import React from 'react';

interface InfoIconProps {
  className?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4v4M8 12h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
