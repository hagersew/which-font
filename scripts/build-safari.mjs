import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const distDir = 'dist-safari';
const projectLocation = 'safari';

if (!existsSync(distDir)) {
  console.error(`Missing ${distDir}. Run npm run build:safari first.`);
  process.exit(1);
}

const check = spawnSync('xcrun', ['--find', 'safari-web-extension-converter'], {
  encoding: 'utf8',
});

if (check.status !== 0) {
  console.log(`Built Safari-compatible extension at ${distDir}/`);
  console.log(
    'Install Xcode to run safari-web-extension-converter, or load the folder in Safari:',
  );
  console.log('  Safari → Settings → Extensions → turn on Developer mode → Load Extension…');
  process.exit(0);
}

execSync(
  [
    'xcrun',
    'safari-web-extension-converter',
    distDir,
    '--project-location',
    projectLocation,
    '--app-name',
    'Which Font?',
    '--copy-resources',
    '--force',
  ].join(' '),
  { stdio: 'inherit' },
);

console.log(`Safari Xcode project created at ${projectLocation}/`);
