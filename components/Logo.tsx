
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
  return (
    <div 
      style={{ width: size, height: size }} 
      className={`relative shrink-0 ${className}`}
    >
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Squircle Background Shadow Base */}
        <rect x="2" y="6" width="96" height="90" rx="26" fill="#e5e7eb" />
        {/* Main White Squircle */}
        <rect x="2" y="2" width="96" height="90" rx="26" fill="white" />
        
        {/* Deep Purple Ring */}
        <circle 
          cx="50" 
          cy="47" 
          r="34" 
          stroke="#46178f" 
          strokeWidth="11" 
          fill="none" 
        />
        
        {/* Eyes */}
        <circle cx="39" cy="40" r="5" fill="#46178f" />
        <circle cx="61" cy="40" r="5" fill="#46178f" />
        
        {/* Thick Curved Smile */}
        <path 
          d="M34 56C34 56 42 66 50 66C58 66 66 56 66 56" 
          stroke="#46178f" 
          strokeWidth="9" 
          strokeLinecap="round" 
          fill="none" 
        />
      </svg>
    </div>
  );
};

export default Logo;
