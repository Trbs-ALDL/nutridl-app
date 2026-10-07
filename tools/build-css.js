// Regenera css/tailwind.css con las clases que usan index.html y js/**/*.js
// Uso: npm run css
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');
const cli = path.join(root, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
execFileSync(process.execPath, [cli, '-c', path.join(__dirname, 'tailwind.config.js'), '-i', path.join(__dirname, 'input.css'), '-o', path.join(root, 'css', 'tailwind.css'), '--minify'], { cwd: root, stdio: 'inherit' });
