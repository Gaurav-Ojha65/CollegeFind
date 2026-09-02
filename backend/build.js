const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../frontend');
const backendPublicDir = path.join(__dirname, 'public');

console.log('--- CollegeFind Unified Build ---');
console.log('1. Installing frontend dependencies...');
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

console.log('2. Building frontend statically...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

console.log('3. Preparing backend public directory...');
if (fs.existsSync(backendPublicDir)) {
  fs.rmSync(backendPublicDir, { recursive: true, force: true });
}
fs.mkdirSync(backendPublicDir, { recursive: true });

console.log('4. Copying frontend build to backend/public...');
const frontendOutDir = path.join(frontendDir, 'out');
if (!fs.existsSync(frontendOutDir)) {
  console.error('Error: frontend/out directory does not exist! Build failed.');
  process.exit(1);
}

// Simple recursive copy function
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(frontendOutDir, backendPublicDir);

console.log('--- Unified Build Complete! ---');
