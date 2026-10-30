import React from 'react';

interface Props {
  className?: string;
  wingAngle?: number; // In degrees (-15 to 25)
  isSleeping?: boolean;
  eyeState?: 'sleep' | 'open' | 'happy' | 'dizzy';
  hasBackpack?: boolean;
  hasPropeller?: boolean;
}

export const CapybaraDuckIllustration: React.FC<Props> = ({
  className = 'w-48 h-32',
  wingAngle = 0,
  eyeState = 'sleep',
  hasBackpack = false,
  hasPropeller = false,
}) => {
  return (
    <svg
      viewBox="0 0 240 160"
      className={`overflow-visible select-none pointer-events-none drop-shadow-md ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.12" />
        </filter>
      </defs>

      <g filter="url(#soft-shadow)">
        {/* DUCK FEET (Yellow webbed feet trailing behind) */}
        <g id="duck-feet" transform="translate(18, 88)">
          <path
            d="M 12 12 C 4 8, -6 14, -12 18 C -14 26, -6 32, 2 34 C 14 36, 26 28, 32 20 Z"
            fill="#F6C344"
            stroke="#1E1E1E"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M 2 34 C -4 38, -10 32, -6 24 C -2 18, 6 16, 14 18"
            stroke="#1E1E1E"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M -6 24 C -12 22, -14 14, -8 10"
            stroke="#1E1E1E"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* DUCK BODY (Plump White Body) */}
        <path
          d="M 68 82 
             C 48 84, 40 102, 54 116 
             C 68 130, 96 136, 134 134 
             C 172 132, 194 118, 204 98 
             C 200 86, 186 78, 172 78 
             C 152 78, 140 82, 126 84 
             C 104 84, 88 80, 68 82 Z"
          fill="#FFFFFF"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* DUCK HEAD & BEAK */}
        {/* Yellow Beak */}
        <path
          d="M 194 92 
             C 208 92, 218 94, 224 102 
             C 222 108, 214 116, 198 116 
             C 192 116, 188 112, 190 106 Z"
          fill="#F6C344"
          stroke="#1E1E1E"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Beak nostril mark */}
        <path
          d="M 204 100 Q 206 101 208 101"
          stroke="#1E1E1E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Duck Eye */}
        <circle cx="184" cy="94" r="3.8" fill="#1E1E1E" />
        <circle cx="185.2" cy="92.8" r="1.2" fill="#FFFFFF" />

        {/* DUCK WING (Animated with wingAngle) */}
        <g transform={`rotate(${wingAngle}, 100, 108)`}>
          <path
            d="M 78 100 
               C 82 118, 92 126, 114 124 
               C 124 122, 134 112, 126 98 
               C 114 94, 94 94, 78 100 Z"
            fill="#FFFFFF"
            stroke="#1E1E1E"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Feather accents */}
          <path
            d="M 94 102 C 98 114, 106 118, 118 114"
            fill="none"
            stroke="#1E1E1E"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>

        {/* ================= CAPYBARA (Resting on Duck) ================= */}
        {/* Capybara Little Tail Nub */}
        <ellipse
          cx="62"
          cy="70"
          rx="6.5"
          ry="6.5"
          fill="#C48E58"
          stroke="#1E1E1E"
          strokeWidth="3.5"
        />

        {/* Capybara Main Body */}
        <path
          d="M 68 76 
             C 62 62, 70 48, 92 46 
             C 120 44, 134 40, 150 44 
             C 168 48, 186 58, 188 74 
             C 188 84, 182 92, 172 94 
             C 152 96, 146 88, 132 88 
             C 118 88, 112 92, 94 92 
             C 78 92, 72 86, 68 76 Z"
          fill="#C48E58"
          stroke="#1E1E1E"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Capybara Snout / Muzzle (Darker warm tan) */}
        <path
          d="M 166 56 
             C 178 54, 188 62, 188 74 
             C 188 84, 182 90, 172 92 
             C 162 92, 156 84, 158 74 
             C 160 64, 162 58, 166 56 Z"
          fill="#A46E3E"
          stroke="#1E1E1E"
          strokeWidth="3"
        />

        {/* Capybara Nose & Smiling mouth */}
        <path
          d="M 183 67 C 182 66, 180 67, 181 69 C 182 71, 184 71, 185 69 Z"
          fill="#3B2314"
        />
        <path
          d="M 182 78 C 178 82, 175 80, 176 76"
          stroke="#1E1E1E"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Capybara Rosy Pink Cheek */}
        <ellipse cx="148" cy="74" rx="7" ry="5.5" fill="#FF8D8D" opacity="0.85" />

        {/* Capybara Eyes based on state */}
        {eyeState === 'sleep' && (
          // Sleepy cute curved eye arc
          <path
            d="M 152 64 C 156 61, 162 61, 165 64"
            stroke="#1E1E1E"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {eyeState === 'open' && (
          <g>
            <circle cx="158" cy="63" r="3.5" fill="#1E1E1E" />
            <circle cx="159" cy="62" r="1" fill="#FFFFFF" />
          </g>
        )}
        {eyeState === 'happy' && (
          <path
            d="M 151 65 Q 158 59 165 65"
            stroke="#1E1E1E"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {eyeState === 'dizzy' && (
          <path
            d="M 153 60 L 161 68 M 161 60 L 153 68"
            stroke="#1E1E1E"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        )}

        {/* Capybara Little Round Ears */}
        {/* Back Ear */}
        <path
          d="M 124 44 C 122 36, 130 32, 136 36 C 140 40, 138 46, 134 46 Z"
          fill="#945F34"
          stroke="#1E1E1E"
          strokeWidth="3"
        />
        {/* Front Ear */}
        <path
          d="M 132 46 C 130 38, 140 34, 146 38 C 150 42, 148 48, 142 48 Z"
          fill="#A87244"
          stroke="#1E1E1E"
          strokeWidth="3"
        />

        {/* Capybara Cute Front & Back Paws Resting */}
        {/* Back Paw */}
        <path
          d="M 72 82 C 70 88, 76 96, 84 94 C 90 92, 88 82, 82 80 Z"
          fill="#A46E3E"
          stroke="#1E1E1E"
          strokeWidth="3"
        />
        {/* Front Paw */}
        <path
          d="M 144 86 C 142 92, 148 98, 156 96 C 162 94, 160 86, 154 84 Z"
          fill="#A46E3E"
          stroke="#1E1E1E"
          strokeWidth="3"
        />

        {/* Adventurer Blue Backpack */}
        {hasBackpack && (
          <g id="capy-backpack">
            <rect
              x="82"
              y="40"
              width="24"
              height="30"
              rx="7"
              fill="#0284C7"
              stroke="#1E1E1E"
              strokeWidth="3"
            />
            <rect
              x="86"
              y="49"
              width="16"
              height="14"
              rx="4"
              fill="#38BDF8"
              stroke="#1E1E1E"
              strokeWidth="2"
            />
            <path
              d="M 88 42 C 92 36, 104 36, 108 42"
              stroke="#0369A1"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* Adventurer Propeller Beanie Hat */}
        {hasPropeller && (
          <g id="capy-propeller-hat">
            <path
              d="M 134 38 C 137 28, 149 28, 152 38 Z"
              fill="#0284C7"
              stroke="#1E1E1E"
              strokeWidth="2.5"
            />
            <line
              x1="143"
              y1="30"
              x2="143"
              y2="20"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse
              cx="143"
              cy="19"
              rx="18"
              ry="3.5"
              fill="#FACC15"
              stroke="#1E1E1E"
              strokeWidth="2"
              className="animate-spin origin-[143px_19px]"
            />
            <circle cx="143" cy="19" r="2.2" fill="#EF4444" />
          </g>
        )}
      </g>
    </svg>
  );
};
