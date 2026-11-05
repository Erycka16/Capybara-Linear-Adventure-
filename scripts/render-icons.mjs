import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const publicDir = path.resolve('public');
const iconSvg = fs.readFileSync(path.join(publicDir, 'icon.svg'), 'utf-8');
const maskableSvg = fs.readFileSync(path.join(publicDir, 'icon-maskable.svg'), 'utf-8');

const targets = [
  { svg: iconSvg, file: 'pwa-192x192.png', width: 192 },
  { svg: iconSvg, file: 'pwa-512x512.png', width: 512 },
  { svg: iconSvg, file: 'apple-touch-icon.png', width: 180 },
  { svg: maskableSvg, file: 'pwa-maskable-512x512.png', width: 512 },
];

for (const target of targets) {
  const resvg = new Resvg(target.svg, {
    fitTo: {
      mode: 'width',
      value: target.width,
    },
  });
  const pngData = resvg.render().asPng();
  const outPath = path.join(publicDir, target.file);
  fs.writeFileSync(outPath, pngData);
  console.log(`Generated ${target.file} (${pngData.length} bytes)`);
}
