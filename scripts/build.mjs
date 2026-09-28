import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const publicFiles = [
  'index.html', 'styles.css', 'script.js', 'profile.jpg',
  'landslide.png', 'chatbot.png', 'ai_car_parking_system.png',
  'Dinesh S.pdf', 'CNAME',
];
await mkdir(output, { recursive: true });
await Promise.all(publicFiles.map(file => copyFile(resolve(root, file), resolve(output, file))));
console.log(`Built ${publicFiles.length} public files in dist/`);
