import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Full vector SVG of Capybara Aviator with Propeller Hat
const getSvg = (isMaskable = false) => {
  const scale = isMaskable ? 0.72 : 0.88;
  const offset = (512 * (1 - scale)) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="60%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
      <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#c48a58"/>
        <stop offset="100%" stop-color="#9a5b28"/>
      </linearGradient>
      <linearGradient id="muzzleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#d99b66"/>
        <stop offset="100%" stop-color="#b07038"/>
      </linearGradient>
      <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="100%" stop-color="#0369a1"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fde047"/>
        <stop offset="100%" stop-color="#eab308"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.3"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="512" height="512" fill="url(#bgGrad)" rx="${isMaskable ? '0' : '96'}"/>

    <!-- Subtle Clouds / Sparkles -->
    <circle cx="80" cy="110" r="40" fill="#ffffff" opacity="0.15"/>
    <circle cx="120" cy="95" r="50" fill="#ffffff" opacity="0.18"/>
    <circle cx="160" cy="110" r="35" fill="#ffffff" opacity="0.15"/>

    <circle cx="430" cy="380" r="45" fill="#ffffff" opacity="0.12"/>
    <circle cx="390" cy="400" r="35" fill="#ffffff" opacity="0.12"/>

    <!-- Scaled Main Character Group -->
    <g transform="translate(${offset}, ${offset}) scale(${scale})" filter="url(#shadow)">
      
      <!-- Ears -->
      <ellipse cx="140" cy="170" rx="28" ry="32" fill="#78350f" transform="rotate(-15 140 170)"/>
      <ellipse cx="142" cy="170" rx="16" ry="20" fill="#f472b6" opacity="0.8" transform="rotate(-15 142 170)"/>

      <ellipse cx="372" cy="170" rx="28" ry="32" fill="#78350f" transform="rotate(15 372 170)"/>
      <ellipse cx="370" cy="170" rx="16" ry="20" fill="#f472b6" opacity="0.8" transform="rotate(15 370 170)"/>

      <!-- Head Base -->
      <path d="M 150 200 C 130 250, 140 370, 170 410 C 200 440, 312 440, 342 410 C 372 370, 382 250, 362 200 C 340 150, 172 150, 150 200 Z" fill="url(#furGrad)" stroke="#582a0b" stroke-width="12" stroke-linejoin="round"/>

      <!-- Muzzle / Snout -->
      <path d="M 180 290 C 180 240, 332 240, 332 290 C 332 380, 180 380, 180 290 Z" fill="url(#muzzleGrad)" stroke="#582a0b" stroke-width="8"/>

      <!-- Nostrils -->
      <ellipse cx="225" cy="305" rx="8" ry="12" fill="#451a03"/>
      <ellipse cx="287" cy="305" rx="8" ry="12" fill="#451a03"/>

      <!-- Cute Smile -->
      <path d="M 235 340 Q 256 362 277 340" fill="none" stroke="#451a03" stroke-width="8" stroke-linecap="round"/>

      <!-- Eyes (Happy Arcs) -->
      <path d="M 180 220 Q 198 200 216 220" fill="none" stroke="#451a03" stroke-width="9" stroke-linecap="round"/>
      <path d="M 296 220 Q 314 200 332 220" fill="none" stroke="#451a03" stroke-width="9" stroke-linecap="round"/>

      <!-- Cheeks Blush -->
      <ellipse cx="170" cy="275" rx="22" ry="14" fill="#fb7185" opacity="0.75"/>
      <ellipse cx="342" cy="275" rx="22" ry="14" fill="#fb7185" opacity="0.75"/>

      <!-- Blue Capybara Cap -->
      <path d="M 180 165 C 190 105, 322 105, 332 165 C 290 155, 220 155, 180 165 Z" fill="url(#capGrad)" stroke="#0c4a6e" stroke-width="10" stroke-linejoin="round"/>
      <!-- Cap Visor -->
      <path d="M 160 170 C 200 185, 312 185, 352 170" fill="none" stroke="#0369a1" stroke-width="12" stroke-linecap="round"/>

      <!-- Propeller Stem -->
      <rect x="250" y="70" width="12" height="42" fill="#e2e8f0" rx="4" stroke="#475569" stroke-width="4"/>
      <circle cx="256" cy="68" r="14" fill="#dc2626" stroke="#991b1b" stroke-width="4"/>

      <!-- Propeller Blades (Cyan / Sky) -->
      <ellipse cx="190" cy="68" rx="55" ry="14" fill="#38bdf8" stroke="#0284c7" stroke-width="5" transform="rotate(-8 190 68)"/>
      <ellipse cx="322" cy="68" rx="55" ry="14" fill="#38bdf8" stroke="#0284c7" stroke-width="5" transform="rotate(8 322 68)"/>
      <circle cx="256" cy="68" r="7" fill="#fef08a"/>

      <!-- Golden Star / Badge -->
      <g transform="translate(256, 435)">
        <circle cx="0" cy="0" r="32" fill="url(#goldGrad)" stroke="#b45309" stroke-width="6"/>
        <text x="0" y="10" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="28" fill="#78350f" text-anchor="middle">★</text>
      </g>
    </g>
  </svg>`;
};

async function generate() {
  const standardSvg = getSvg(false);
  const maskableSvg = getSvg(true);

  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), standardSvg);

  // 192x192 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 512x512 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // Maskable 512x512 PNG
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // Apple touch icon 180x180 PNG (no transparency)
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Favicon 32x32 PNG
  await sharp(Buffer.from(standardSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Generated favicon-32x32.png');

  console.log('All icons generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
