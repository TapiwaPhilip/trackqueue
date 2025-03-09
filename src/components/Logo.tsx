
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      {/* Main circle with gradient */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-br from-nightPurple via-nightBlue to-nightPink animate-pulse-gentle"
        style={{ animationDuration: '3s' }}
      />
      
      {/* Inner elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Stylized "Q" */}
        <div className="relative w-3/5 h-3/5 flex items-center justify-center">
          {/* Queue line representation */}
          <div className="absolute w-full h-1/3 flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full opacity-90" />
            <div className="w-2 h-2 bg-white rounded-full opacity-70" />
            <div className="w-2 h-2 bg-white rounded-full opacity-50" />
          </div>
          
          {/* Circle outline to represent "Q" */}
          <div className="absolute inset-0 border-2 border-white rounded-full opacity-80" />
          
          {/* Opening in the "Q" */}
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-transparent border-r-2 border-b-2 border-white rounded-br-full" />
        </div>
      </div>
    </div>
  );
};

export default Logo;
