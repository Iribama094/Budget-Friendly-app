import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };



  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    // Show fallback
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center relative`}>
        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-large border-2 border-white/20">
          <span className={`${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-xl' : 'text-2xl'}`}>
            BF
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center relative`}>
      <img
        src="/Budget-Friendly-app/logo.png"
        alt="Budget Friendly Logo"
        className="w-full h-full object-contain rounded-2xl"
        onError={handleImageError}
      />
    </div>
  );
};
