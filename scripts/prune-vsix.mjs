import fs from 'node:fs';
import path from 'node:path';

const VSIX_DIR = path.resolve('VSIX');
const KEEP = 5;

function parseVersion(filename) {
  const match = filename.match(/(\d+\.\d+\.\d+)/);
  if (!match) {
    return [0, 0, 0];
  }

  return match[1].split('.').map(Number);
}

function compareVersionsDesc(a, b) {
  const va = parseVersion(a);
  const vb = parseVersion(b);

  for (let i = 0; i < 3; i += 1) {
    if (va[i] !== vb[i]) {
      return vb[i] - va[i];
    }
  }

  return b.localeCompare(a);
}

if (!fs.existsSync(VSIX_DIR)) {
  process.exit(0);
}

const files = fs
  .readdirSync(VSIX_DIR)
  .filter((name) => name.endsWith('.vsix'))
  .sort(compareVersionsDesc);

for (const name of files.slice(KEEP)) {
  fs.unlinkSync(path.join(VSIX_DIR, name));
  console.log(`Removed old VSIX: VSIX/${name}`);
}
