import React from "react";

export function PresenzIcon({ size = 40, className = "" }) {
  return (
    <div 
      className={`relative rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-[0_4px_20px_rgba(100,181,171,0.25)] border border-[#7EC8C0]/30 ${className}`}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 75% 25%, #183339 0%, #0E2024 70%, #091518 100%)",
      }}
    >
      {/* Top Gloss Reflection */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent pointer-events-none" />
      
      {/* Ambient Soft Glow */}
      <div className="absolute w-3/4 h-3/4 rounded-full bg-[#7EC8C0]/15 blur-sm pointer-events-none" />

      {/* SVG Waveform and Signal Emitter */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-[82%] h-[82%] relative z-10 drop-shadow-[0_0_4px_#7EC8C0]"
      >
        <defs>
          <linearGradient id="presenzPulseGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#7EC8C0" stopOpacity="0.4" />
            <stop offset="30%" stopColor="#7EC8C0" />
            <stop offset="70%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#7EC8C0" />
          </linearGradient>
        </defs>

        {/* ECG Lead Line */}
        <path
          d="M 5 54 L 28 54 L 38 32 L 48 74 L 56 50 L 68 50"
          fill="none"
          stroke="url(#presenzPulseGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Radio Emitter Core Dot */}
        <circle 
          cx="72" 
          cy="50" 
          r="4.5" 
          fill="#FFFFFF" 
        />

        {/* Wave 1 */}
        <path
          d="M 77 40 A 13 13 0 0 1 77 60"
          fill="none"
          stroke="#7EC8C0"
          strokeWidth="3.8"
          strokeLinecap="round"
        />

        {/* Wave 2 */}
        <path
          d="M 83 33 A 22 22 0 0 1 83 67"
          fill="none"
          stroke="#7EC8C0"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function PresenzLogo({ size = "md", showSlogan = true, className = "" }) {
  const iconSizes = {
    sm: 32,
    md: 44,
    lg: 56,
  };

  const currentSize = iconSizes[size] || 44;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <PresenzIcon size={currentSize} />

      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className="font-poppins font-bold text-white tracking-tight" style={{ fontSize: currentSize * 0.52 }}>
            Pre
          </span>
          <span 
            className="font-poppins font-extrabold tracking-tight bg-gradient-to-r from-[#8BE3D7] via-[#7EC8C0] to-[#64B5AB] bg-clip-text text-transparent"
            style={{ fontSize: currentSize * 0.52 }}
          >
            Senz
          </span>
        </div>

        {showSlogan && (
          <div className="flex items-center gap-1.5 -mt-0.5">
            <div className="h-[1px] w-3 bg-gradient-to-r from-transparent to-[#7EC8C0]/50" />
            <span className="text-[7.5px] font-extrabold uppercase tracking-[0.22em] text-[#7EC8C0] font-poppins">
              Cuidado em Tempo Real
            </span>
            <div className="h-[1px] w-3 bg-gradient-to-l from-transparent to-[#7EC8C0]/50" />
          </div>
        )}
      </div>
    </div>
  );
}
