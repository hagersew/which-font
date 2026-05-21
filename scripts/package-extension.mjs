import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const browser = process.argv[2] ?? 'chrome';
const distDir = browser === 'chrome' ? 'dist' : `dist-${browser}`;
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));

const artifactsDir = `${browser}-artifacts`;
mkdirSync(artifactsDir, { recursive: true });

const outZip = path.join(artifactsDir, `which-font-${browser}-${version}.zip`);

if (!existsSync(distDir)) {
  console.error(`Missing ${distDir}. Run npm run build:${browser} first.`);
  process.exit(1);
}

execSync(`cd "${distDir}" && zip -r "../${outZip}" .`, { stdio: 'inherit' });
console.log(`Created ${outZip}`);
