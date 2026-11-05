import { mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'app', 'fonts');
mkdirSync(OUT, { recursive: true });

const map = {
  'archivo-latin-400-normal.woff2': 'Archivo-400.woff2',
  'archivo-latin-500-normal.woff2': 'Archivo-500.woff2',
  'archivo-latin-600-normal.woff2': 'Archivo-600.woff2',
  'archivo-latin-700-normal.woff2': 'Archivo-700.woff2',
  'archivo-latin-800-normal.woff2': 'Archivo-800.woff2',
  'ibm-plex-mono-latin-400-normal.woff2': 'IBMPlexMono-400.woff2',
  'ibm-plex-mono-latin-500-normal.woff2': 'IBMPlexMono-500.woff2',
  'ibm-plex-mono-latin-600-normal.woff2': 'IBMPlexMono-600.woff2',
};

const srcArchivo = join(ROOT, 'node_modules', '@fontsource', 'archivo', 'files');
const srcPlex = join(ROOT, 'node_modules', '@fontsource', 'ibm-plex-mono', 'files');

for (const [src, dst] of Object.entries(map)) {
  const from = src.startsWith('archivo') ? join(srcArchivo, src) : join(srcPlex, src);
  copyFileSync(from, join(OUT, dst));
  console.log('copied', dst);
}
console.log('app/fonts:', readdirSync(OUT).join(', '));
