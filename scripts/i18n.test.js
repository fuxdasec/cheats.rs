const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { ROOT } = require('./i18n');

test('new languages are drafts; sync preserves work and detects changes', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cheats-i18n-'));
    try {
        for (const name of ['scripts', 'templates', 'content', 'i18n', 'sass', 'static']) fs.cpSync(path.join(ROOT, name), path.join(root, name), { recursive: true });
        fs.copyFileSync(path.join(ROOT, 'config.toml'), path.join(root, 'config.toml'));
        fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(root, 'node_modules'), 'dir');
        const run = (...args) => execFileSync(process.execPath, ['scripts/i18n.js', ...args], { cwd: root, encoding: 'utf8' });
        run('add', 'fr');
        const filename = path.join(root, 'content/language-constructs/hello-rust.fr.md');
        let source = fs.readFileSync(filename, 'utf8');
        assert.match(source, /draft = true/);
        assert.match(fs.readFileSync(path.join(root, 'content/_index.fr.md'), 'utf8'), /render = false/);
        const custom = source.replace('Hello, Rust!', 'Bonjour Rust');
        fs.writeFileSync(filename, custom);
        run('add', 'fr'); run('sync', 'fr');
        assert.equal(fs.readFileSync(filename, 'utf8'), custom);
        assert(!JSON.parse(fs.readFileSync(path.join(root, 'data/i18n.json'))).languages.find(l=>l.code==='fr').enabled);
        fs.appendFileSync(path.join(root, 'content/language-constructs/hello-rust.md'), '\nNew source paragraph.\n');
        assert.match(run('status', 'fr'), /true/);
        run('reviewed', 'fr', 'language-constructs/hello-rust.md');
        assert.notEqual(fs.readFileSync(filename, 'utf8'), custom);
        // Publish a translated shell and one topic; everything else remains unavailable.
        const catalog = JSON.parse(fs.readFileSync(path.join(root, 'i18n/en.json')));
        catalog.code = 'fr'; catalog.name = 'Français'; catalog.ready = true;
        fs.writeFileSync(path.join(root, 'i18n/fr.json'), JSON.stringify(catalog));
        for (const name of ['_index.fr.md', 'language-constructs/_index.fr.md']) {
            const p = path.join(root, 'content', name);
            fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace('render = false', 'render = true'));
        }
        fs.writeFileSync(filename, fs.readFileSync(filename, 'utf8').replace('draft = true', 'draft = false'));
        run('prepare');
        const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/i18n.json')));
        assert(manifest.locales.fr.enabled);
        assert.equal(manifest.locales.fr.topics.length, 1);
        assert.equal(manifest.locales.fr.pdf, false);
        assert(manifest.routes['/fr/language-constructs/hello-rust/']);
        assert(!manifest.routes['/fr/language-constructs/data-structures/']);
        execFileSync('zola', ['build'], { cwd: root, stdio: 'pipe' });
        const translatedPage = fs.readFileSync(path.join(root, 'public/fr/language-constructs/hello-rust/index.html'), 'utf8');
        assert.match(translatedPage, /lang="fr"/);
        assert.match(translatedPage, /Read in English/);
        assert.match(translatedPage, /href="\/language-constructs\/data-structures\/"/);
        assert(!fs.existsSync(path.join(root, 'public/fr/language-constructs/data-structures/index.html')));
        // Missing UI strings block ready catalogs, and parameter mismatches fail validation.
        delete catalog.messages['Home'];
        fs.writeFileSync(path.join(root, 'i18n/fr.json'), JSON.stringify(catalog));
        assert.throws(()=>run('check'), /missing message Home/);
        catalog.messages.Home = 'Accueil';
        catalog.messages['Copy code block {number}'] = 'Copier';
        fs.writeFileSync(path.join(root, 'i18n/fr.json'), JSON.stringify(catalog));
        assert.throws(()=>run('check'), /parameters differ/);
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
