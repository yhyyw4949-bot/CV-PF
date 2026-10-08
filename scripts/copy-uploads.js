import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const uploadsSrc = path.join(rootDir, 'uploads');
const uploadsDest = path.join(rootDir, 'client', 'public', 'uploads');

if (!fs.existsSync(uploadsDest)) {
  fs.mkdirSync(uploadsDest, { recursive: true });
}

if (fs.existsSync(uploadsSrc)) {
  const files = fs.readdirSync(uploadsSrc);
  for (const file of files) {
    const srcFile = path.join(uploadsSrc, file);
    const destFile = path.join(uploadsDest, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`[SYNC UPLOADS] Copied ${file} to client/public/uploads`);
    }
  }
}
