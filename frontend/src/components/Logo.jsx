import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine } from 'lucide-react';

const Logo = ({ 
  className = "", 
  iconSize = 18, 
  boxSize = "w-8 h-8", 
  textSize = "text-textMain",
  showText = true,
  to = "/home"
}) => {
  return (
    <Link to={to} className={`flex items-center gap-2 font-black tracking-tight ${className}`}>
      <div className={`${boxSize} bg-accent text-white rounded-lg flex items-center justify-center shadow-md transform transition-transform hover:rotate-12`}>
        <TreePine size={iconSize} />
      </div>
      {showText && (
        <span className={textSize}>
          Lumber & Timber
        </span>
      )}
    </Link>
  );
};

export default Logo;
