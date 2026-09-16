// Reproduce the release artifact and verify the exact files that will be deployed.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawn } = require('node:child_process');
const { ROOT } = require('./i18n');
const run = (command, args) => new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: ROOT, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} exited ${code}`)));
});
(async () => {
    for (const script of ['check:content', 'check:design', 'check:i18n', 'test:i18n']) await run('npm', ['run', script]);
    await run('npm', ['run', 'i18n:prepare']);
    await run('zola', ['build']);
    await run('bash', ['scripts/ci_pack_public.sh']);
    await run('npm', ['run', 'check:site', '--', 'public.clean']);
    const root = path.join(ROOT, 'public.clean');
    const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff' };
    const server = http.createServer((request, response) => {
        let filename;
        try {
            const url = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
            filename = path.resolve(root, '.' + (url.endsWith('/') ? url + 'index.html' : url));
        } catch { response.writeHead(400).end(); return; }
        if (!filename.startsWith(root + path.sep) || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) { response.writeHead(404).end(); return; }
        response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream' });
        fs.createReadStream(filename).pipe(response);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
        for (const script of ['check:reading', 'check:i18n-browser', 'check:a11y', 'check:lighthouse']) await run('npm', ['run', script, '--', base]);
    } finally { await new Promise(resolve => server.close(resolve)); }
    await run('npm', ['run', 'pdf']);
    await run('npm', ['run', 'check:site', '--', 'public.clean', '--final']);
    console.log('Release verification passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
