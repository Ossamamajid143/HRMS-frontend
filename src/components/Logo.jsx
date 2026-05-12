import React from 'react';

const Logo = ({ className = "w-10 h-10", textClassName = "text-xl", showText = true }) => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`${className} flex-shrink-0`}>
        {/* Modern SVG Recreation of the 'X' Logo */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
          <rect 
            x="25.5" y="10" width="18" height="80" rx="9" 
            transform="rotate(-45 25.5 10)" 
            fill="#3B82F6" 
            className="group-hover:fill-blue-400 transition-colors"
          />
          <rect 
            x="74.5" y="10" width="18" height="80" rx="9" 
            transform="rotate(45 74.5 10)" 
            fill="#60A5FA" 
            className="group-hover:fill-blue-300 transition-colors"
          />
          {/* Subtle overlay detail */}
          <path d="M40 40L60 60M40 60L60 40" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-20" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col justify-center border-l border-white/20 pl-3">
          <span className={`font-black tracking-tight leading-tight text-white ${textClassName} group-hover:text-blue-200 transition-colors`}>
            Xnerds<span className="text-blue-500">.</span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none mt-0.5">
            Solutions
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
