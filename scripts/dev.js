const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { prepare, ROOT } = require('./i18n');
prepare();
const server = spawn('zola', ['serve', '--extra-watch-path', 'data', ...process.argv.slice(2)], { cwd: ROOT, stdio: 'inherit' });
let timer;
const watchers = ['content', 'i18n', 'config.toml'].map(filename => fs.watch(filename, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => { try { prepare(); } catch (error) { console.error(error.message); } }, 150);
}));
server.on('exit', code => { clearTimeout(timer); watchers.forEach(watcher => watcher.close()); process.exitCode = code || 0; });
process.on('SIGINT', () => server.kill('SIGINT'));
process.on('SIGTERM', () => server.kill('SIGTERM'));
