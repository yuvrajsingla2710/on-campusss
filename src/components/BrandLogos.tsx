import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * ON CAMPUS Logo based on reference image:
 * Features a glowing celestial ring/torus with a luminous cyan-to-violet gradient
 * and an orbiting bright beacon/portal at 1 o'clock, with ambient neon flare.
 */
export const OnCampusOrbitalIcon: React.FC<LogoProps> = ({ 
  className = '', 
  size = 48,
  glow = true 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow halo */}
      {glow && (
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#fbcfe8]/20 via-[#f472b6]/15 to-[#e2e8f0]/10 blur-sm pointer-events-none" 
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          {/* Main Gradient for the Ring in Grey & Very Light Pink */}
          <linearGradient id="onCampusRingGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#fce7f3" />
            <stop offset="70%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          {/* Inner Glow Gradient */}
          <radialGradient id="onCampusCoreGlow" cx="50" cy="50" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#12131a" stopOpacity="0" />
          </radialGradient>

          {/* Shimmer filter */}
          <filter id="neonBloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Dark Core */}
        <circle cx="50" cy="50" r="38" fill="#14151e" stroke="rgba(251,207,232,0.15)" strokeWidth="1" />
        <circle cx="50" cy="50" r="28" fill="url(#onCampusCoreGlow)" />

        {/* Outer Radiant Torus Ring */}
        <circle
          cx="50"
          cy="50"
          r="34"
          stroke="url(#onCampusRingGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#neonBloom)"
        />

        {/* Inner Precision Guideline */}
        <circle
          cx="50"
          cy="50"
          r="26"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Central Aperture Core */}
        <circle cx="50" cy="50" r="12" fill="#181922" stroke="#fbcfe8" strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill="#ffffff" />

        {/* Orbiting Bright Celestial Bead at ~1 o'clock (x=73, y=27) */}
        <circle cx="73" cy="27" r="6.5" fill="#ffffff" filter="url(#neonBloom)" />
        <circle cx="73" cy="27" r="3.5" fill="#f472b6" />
      </svg>
    </div>
  );
};

/**
 * COMPASS AI Logo based on reference image:
 * Features a radiant geometric 4-point / 8-point multifaceted starburst / compass
 * with vibrant hot-pink and pure-white laser rays, diamond crystal sheen, and glowing concentric orbital rings.
 */
export const CompassStarIcon: React.FC<LogoProps> = ({ 
  className = '', 
  size = 48,
  glow = true 
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient pink & white glow halo */}
      {glow && (
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#fbcfe8]/25 via-[#f472b6]/15 to-[#ffffff]/20 blur-sm pointer-events-none animate-pulse-slow" 
        />
      )}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          {/* Main Pink and White Gradient */}
          <linearGradient id="compassStarGradPinkWhite" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#fdf2f8" />
            <stop offset="70%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          {/* Soft Grey-Rose Pink Gradient for faceted shadow */}
          <linearGradient id="compassFacetShadow" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#831843" />
          </linearGradient>

          {/* Core Radial Glow: White center radiating into Soft Pink */}
          <radialGradient id="compassGlowCorePinkWhite" cx="50" cy="50" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fbcfe8" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#f472b6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#181922" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Concentric Precision Guidance Rings */}
        <circle cx="50" cy="50" r="43" stroke="rgba(251,207,232,0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="33" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

        {/* Diagonal Minor Star Rays (45 degree offset) */}
        <path
          d="M50 24 L54 46 L76 50 L54 54 L50 76 L46 54 L24 50 L46 46 Z"
          fill="url(#compassStarGradPinkWhite)"
          opacity="0.65"
        />

        {/* Primary 4-Point Faceted Compass Star */}
        <path
          d="M50 8 L57 43 L92 50 L57 57 L50 92 L43 57 L8 50 L43 43 Z"
          fill="url(#compassStarGradPinkWhite)"
        />

        {/* Diamond Facet Highlights (Top & Right wings shine in pure white) */}
        <path
          d="M50 8 L50 50 L92 50 Z"
          fill="#ffffff"
          opacity="0.45"
        />
        <path
          d="M50 92 L50 50 L8 50 Z"
          fill="#ffffff"
          opacity="0.3"
        />

        {/* Facet Shading */}
        <path
          d="M50 8 L50 50 L8 50 Z"
          fill="url(#compassFacetShadow)"
          opacity="0.5"
        />
        <path
          d="M50 92 L50 50 L92 50 Z"
          fill="url(#compassFacetShadow)"
          opacity="0.5"
        />

        {/* Glowing Center Core */}
        <circle cx="50" cy="50" r="10" fill="url(#compassGlowCorePinkWhite)" />
        <circle cx="50" cy="50" r="4.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />
      </svg>
    </div>
  );
};
