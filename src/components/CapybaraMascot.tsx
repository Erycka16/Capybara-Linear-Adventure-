import React from 'react';

interface CapybaraMascotProps {
  rank: 1 | 2 | 3 | 4 | 5;
  isPlayer?: boolean;
  className?: string;
  hasCrown?: boolean;
}

export const CapybaraMascot: React.FC<CapybaraMascotProps> = ({
  rank,
  isPlayer = false,
  className = 'w-28 h-36',
  hasCrown = false,
}) => {
  return (
    <div
      className={`relative flex flex-col items-center select-none ${
        isPlayer ? 'animate-capy-podium-jump' : 'hover:scale-105 transition-transform'
      } ${className}`}
    >
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full overflow-visible drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="capyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.25" />
          </filter>
          <linearGradient id="furGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D49B6A" />
            <stop offset="50%" stopColor="#BA7D49" />
            <stop offset="100%" stopColor="#9C6234" />
          </linearGradient>
          <linearGradient id="bellyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5D8B5" />
            <stop offset="100%" stopColor="#E3BFA0" />
          </linearGradient>
          <linearGradient id="trophyGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="silverMedal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="bronzeMedal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>
          <linearGradient id="backpackBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* BLUE BACKPACK (Visible behind body) */}
        <g id="backpack">
          <rect
            x="42"
            y="95"
            width="32"
            height="58"
            rx="12"
            fill="url(#backpackBlue)"
            stroke="#0369A1"
            strokeWidth="3.5"
          />
          <rect
            x="48"
            y="110"
            width="14"
            height="22"
            rx="6"
            fill="#0284C7"
            stroke="#075985"
            strokeWidth="2.5"
          />
        </g>

        {/* FEET (Two sturdy hind paws standing firmly on podium) */}
        <g id="feet">
          {/* Left Foot */}
          <ellipse
            cx="78"
            cy="214"
            rx="18"
            ry="11"
            fill="#8B5127"
            stroke="#5C3417"
            strokeWidth="3.5"
          />
          <line x1="72" y1="218" x2="72" y2="223" stroke="#45230C" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="84" y1="218" x2="84" y2="223" stroke="#45230C" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Foot */}
          <ellipse
            cx="126"
            cy="214"
            rx="18"
            ry="11"
            fill="#8B5127"
            stroke="#5C3417"
            strokeWidth="3.5"
          />
          <line x1="120" y1="218" x2="120" y2="223" stroke="#45230C" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="132" y1="218" x2="132" y2="223" stroke="#45230C" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* CHUBBY UPRIGHT CAPYBARA BODY */}
        <path
          d="M 64 125 
             C 52 145, 50 185, 62 208 
             C 72 216, 132 216, 142 208 
             C 154 185, 152 145, 140 125 
             C 134 114, 70 114, 64 125 Z"
          fill="url(#furGradient)"
          stroke="#5C3417"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* SOFT WARM BELLY PATCH */}
        <path
          d="M 76 136 
             C 70 152, 68 184, 78 202 
             C 86 208, 118 208, 126 202 
             C 136 184, 134 152, 128 136 
             C 122 130, 82 130, 76 136 Z"
          fill="url(#bellyGradient)"
        />

        {/* BACKPACK STRAPS OVER SHOULDERS */}
        <path
          d="M 72 120 Q 66 142 68 165"
          stroke="#0284C7"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 72 120 Q 66 142 68 165"
          stroke="#38BDF8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* MEDAL RIBBON AROUND NECK (Red, White, Blue stripes) */}
        <path
          d="M 74 118 C 88 136, 114 136, 128 118"
          stroke="#EF4444"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 78 122 C 90 138, 112 138, 124 122"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 82 126 C 92 140, 110 140, 120 126"
          stroke="#2563EB"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* NECK MEDAL BADGE (Ranks 1, 2, 3) */}
        {rank <= 3 && (
          <g transform="translate(101, 140)">
            <circle
              cx="0"
              cy="0"
              r="13"
              fill={rank === 1 ? 'url(#trophyGold)' : rank === 2 ? 'url(#silverMedal)' : 'url(#bronzeMedal)'}
              stroke={rank === 1 ? '#78350F' : rank === 2 ? '#334155' : '#7C2D12'}
              strokeWidth="2.5"
            />
            <circle cx="0" cy="0" r="10" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            <text
              x="0"
              y="4.5"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fontFamily="system-ui"
              fill={rank === 1 ? '#451A03' : rank === 2 ? '#0F172A' : '#431407'}
            >
              {rank}
            </text>
          </g>
        )}

        {/* ROUND ADORABLE HEAD */}
        <g id="head">
          {/* Main Head Shape */}
          <path
            d="M 62 82 
               C 56 60, 72 40, 102 38 
               C 132 40, 148 60, 142 82 
               C 144 98, 138 116, 126 122 
               C 114 126, 90 126, 78 122 
               C 66 116, 60 98, 62 82 Z"
            fill="url(#furGradient)"
            stroke="#5C3417"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Rounded Ears */}
          {/* Left Ear */}
          <path
            d="M 64 54 C 54 50, 52 64, 60 70 Z"
            fill="#8B5127"
            stroke="#5C3417"
            strokeWidth="3.5"
          />
          <ellipse cx="60" cy="62" rx="3.5" ry="5" fill="#F472B6" opacity="0.6" />

          {/* Right Ear */}
          <path
            d="M 140 54 C 150 50, 152 64, 144 70 Z"
            fill="#8B5127"
            stroke="#5C3417"
            strokeWidth="3.5"
          />
          <ellipse cx="144" cy="62" rx="3.5" ry="5" fill="#F472B6" opacity="0.6" />

          {/* Chubby Snout (Muzzle) */}
          <ellipse
            cx="102"
            cy="88"
            rx="25"
            ry="19"
            fill="#D49B6A"
            stroke="#783E18"
            strokeWidth="2.5"
          />

          {/* Cute Nostril / Dark Nose */}
          <path
            d="M 94 80 C 97 77, 107 77, 110 80 C 112 83, 105 86, 102 86 C 99 86, 92 83, 94 80 Z"
            fill="#381D0B"
          />
          <ellipse cx="98" cy="82" rx="1.5" ry="2" fill="#1C0C04" />
          <ellipse cx="106" cy="82" rx="1.5" ry="2" fill="#1C0C04" />

          {/* Happy Mouth Curve */}
          <path
            d="M 102 86 L 102 91 M 95 91 Q 102 97 109 91"
            stroke="#381D0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Little open pink tongue */}
          <path
            d="M 98 92 Q 102 97 106 92 Z"
            fill="#F43F5E"
          />

          {/* Rosy Cheeks */}
          <ellipse cx="76" cy="88" rx="8" ry="5.5" fill="#FB7185" opacity="0.75" />
          <ellipse cx="128" cy="88" rx="8" ry="5.5" fill="#FB7185" opacity="0.75" />

          {/* Happy Arched Eyes (◠ ‿ ◠) */}
          <path
            d="M 78 72 Q 84 64 90 72"
            stroke="#271206"
            strokeWidth="3.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 114 72 Q 120 64 126 72"
            stroke="#271206"
            strokeWidth="3.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* BLUE AVIATOR CAP WITH SPINNING PROPELLER */}
        <g id="propeller-cap">
          {/* Cap Dome */}
          <path
            d="M 72 44 C 74 24, 130 24, 132 44 Z"
            fill="#0284C7"
            stroke="#075985"
            strokeWidth="3.5"
          />
          {/* Cap Brim */}
          <path
            d="M 68 44 C 82 48, 122 48, 136 44"
            stroke="#0369A1"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Center Pin / Shaft */}
          <rect x="100" y="16" width="4" height="12" fill="#38BDF8" rx="2" stroke="#0369A1" strokeWidth="1" />
          <circle cx="102" cy="16" r="4.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />

          {/* SPINNING PROPELLER BLADES (Cyan blue blades with fast spin animation) */}
          <g transform="translate(102, 16)">
            <g className="animate-propeller-spin origin-center" style={{ transformOrigin: '0 0' }}>
              {/* Blade Left */}
              <ellipse cx="-20" cy="0" rx="20" ry="5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
              {/* Blade Right */}
              <ellipse cx="20" cy="0" rx="20" ry="5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
              {/* Blade Center Hub */}
              <circle cx="0" cy="0" r="5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            </g>
          </g>
        </g>

        {/* SHINING GOLDEN CROWN (For Rank 1 or hasCrown) */}
        {(rank === 1 || hasCrown) && (
          <g id="crown" transform="translate(80, 0)">
            <path
              d="M 2 24 L 8 4 L 22 16 L 36 4 L 42 24 Z"
              fill="url(#trophyGold)"
              stroke="#78350F"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="8" cy="4" r="2.5" fill="#EF4444" />
            <circle cx="22" cy="16" r="2.5" fill="#3B82F6" />
            <circle cx="36" cy="4" r="2.5" fill="#10B981" />
            <rect x="2" y="22" width="40" height="4" rx="2" fill="#B45309" />
          </g>
        )}

        {/* PAWS & ACCESSORIES ACCORDING TO RANK */}
        {/* RANK 1: Holds Golden Trophy in Right Paw & Left Fist Pumped High */}
        {rank === 1 && (
          <g id="rank1-arms">
            {/* Left Arm: Pumping Air in Victory */}
            <path
              d="M 136 128 C 152 118, 164 100, 160 86"
              stroke="#BA7D49"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d="M 136 128 C 152 118, 164 100, 160 86"
              stroke="#5C3417"
              strokeWidth="15"
              strokeLinecap="round"
              strokeDasharray="0 100 1 0"
            />
            {/* Clenched Fist */}
            <circle cx="160" cy="84" r="11" fill="#8B5127" stroke="#5C3417" strokeWidth="3" />

            {/* Right Arm: Holding Trophy Proudly */}
            <path
              d="M 68 132 C 50 134, 38 142, 42 154"
              stroke="#BA7D49"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="44" cy="154" r="10" fill="#8B5127" stroke="#5C3417" strokeWidth="3" />

            {/* GOLDEN TROPHY WITH STAR EMBLEM */}
            <g id="golden-trophy" transform="translate(14, 94)" className="animate-trophy-shine">
              {/* Trophy Base */}
              <rect x="18" y="52" width="22" height="10" rx="3" fill="#78350F" stroke="#451A03" strokeWidth="2" />
              <rect x="23" y="44" width="12" height="9" fill="url(#trophyGold)" stroke="#92400E" strokeWidth="1.5" />
              {/* Trophy Cup */}
              <path
                d="M 14 12 C 14 36, 44 36, 44 12 Z"
                fill="url(#trophyGold)"
                stroke="#78350F"
                strokeWidth="2.5"
              />
              {/* Cup Rim */}
              <ellipse cx="29" cy="12" rx="15" ry="4" fill="#FDE047" stroke="#78350F" strokeWidth="2" />
              {/* Left Handle */}
              <path
                d="M 14 16 C 4 18, 4 30, 15 32"
                stroke="#B45309"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Right Handle */}
              <path
                d="M 44 16 C 54 18, 54 30, 43 32"
                stroke="#B45309"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              {/* Star on Trophy */}
              <path
                d="M 29 18 L 30.5 22 L 35 22 L 31.5 24.5 L 33 29 L 29 26.5 L 25 29 L 26.5 24.5 L 23 22 L 27.5 22 Z"
                fill="#FEF08A"
                stroke="#B45309"
                strokeWidth="1"
              />
            </g>
          </g>
        )}

        {/* RANK 2: Holds Shiny Silver Medal in Paw & Waving */}
        {rank === 2 && (
          <g id="rank2-arms">
            {/* Right Arm holding big silver medal */}
            <path
              d="M 68 132 C 48 136, 40 148, 46 160"
              stroke="#BA7D49"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="48" cy="160" r="10" fill="#8B5127" stroke="#5C3417" strokeWidth="3" />

            {/* Held Silver Medal */}
            <g transform="translate(24, 140)">
              <circle cx="16" cy="16" r="15" fill="url(#silverMedal)" stroke="#334155" strokeWidth="2.5" />
              <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0F172A">
                #2
              </text>
            </g>

            {/* Left Arm waving */}
            <path
              d="M 136 130 C 154 122, 166 112, 162 100"
              stroke="#BA7D49"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="162" cy="98" r="10" fill="#8B5127" stroke="#5C3417" strokeWidth="3" />
          </g>
        )}

        {/* RANK 3: Holds Bronze Medal & Cheerful Thumbs Up */}
        {rank === 3 && (
          <g id="rank3-arms">
            {/* Right Arm holding bronze medal */}
            <path
              d="M 68 132 C 48 136, 42 148, 48 160"
              stroke="#BA7D49"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="50" cy="160" r="10" fill="#8B5127" stroke="#5C3417" strokeWidth="3" />

            {/* Held Bronze Medal */}
            <g transform="translate(26, 142)">
              <circle cx="16" cy="16" r="15" fill="url(#bronzeMedal)" stroke="#7C2D12" strokeWidth="2.5" />
              <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="900" fill="#431407">
                #3
              </text>
            </g>

            {/* Left Arm cheering */}
            <path
              d="M 136 132 C 150 136, 158 144, 154 156"
              stroke="#BA7D49"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="152" cy="156" r="10" fill="#8B5127" stroke="#5C3417" strokeWidth="3" />
          </g>
        )}

        {/* RANK 4 & 5: Cute Cheerful & Encouraging Poses */}
        {(rank === 4 || rank === 5) && (
          <g id="encouraging-arms">
            {/* Double paws cheerful wave / cheer */}
            <path
              d="M 68 132 C 54 126, 48 116, 52 104"
              stroke="#BA7D49"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="52" cy="102" r="10" fill="#8B5127" stroke="#5C3417" strokeWidth="3" />

            <path
              d="M 136 132 C 150 126, 156 116, 152 104"
              stroke="#BA7D49"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="152" cy="102" r="10" fill="#8B5127" stroke="#5C3417" strokeWidth="3" />

            {/* Encouraging Star / Heart Badge on chest */}
            <g transform="translate(93, 148)">
              <circle cx="8" cy="8" r="10" fill={rank === 4 ? '#10B981' : '#3B82F6'} stroke="#FFFFFF" strokeWidth="2" />
              <text x="8" y="12" textAnchor="middle" fontSize="11" fontWeight="900" fill="#FFFFFF">
                {rank === 4 ? '★4' : '★5'}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
