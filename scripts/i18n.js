const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const TOML = require('@iarna/toml');
const ROOT = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const json = p => JSON.parse(read(p));
const writeJSON = (p, value) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), JSON.stringify(value, null, 2) + '\n'); };
function files(dir = 'content') {
    return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(`${dir}/${e.name}`) : e.name.endsWith('.md') ? [`${dir}/${e.name}`] : []);
}
function parse(source) {
    const match = source.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+(?:\r?\n|$)([\s\S]*)$/);
    if (!match) throw new Error('Missing TOML front matter');
    return { meta: TOML.parse(match[1]), body: match[2] };
}
const encode = ({ meta, body }) => `+++\n${TOML.stringify(meta)}+++\n${body}`;
function fingerprint(source) {
    const { meta, body } = parse(source);
    return crypto.createHash('sha256').update(JSON.stringify({ title: meta.title, description: meta.description, seo_title: meta.extra?.seo_title, body })).digest('hex');
}
function sourceFiles() { return files().filter(p => !/\.[^.\/]+\.md$/.test(p)); }
function target(file, code) { return file.replace(/\.md$/, `.${code}.md`); }
function config() { return TOML.parse(read('config.toml')); }
function codes() { const c = config(); return [c.default_language, ...Object.keys(c.languages || {})]; }
function assertCode(code) {
    if (!code || !/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(code)) throw new Error('Use a language code such as pt-BR, fr, or zh-Hans.');
    if (Intl.getCanonicalLocales(code)[0] !== code) throw new Error('Use the canonical language code returned by Intl.getCanonicalLocales.');
}
function scaffold(code, add) {
    assertCode(code);
    if (code === config().default_language) throw new Error('The source language cannot be scaffolded.');
    if (!codes().includes(code)) {
        if (!add) throw new Error(`Unknown language: ${code}`);
        fs.appendFileSync(path.join(ROOT, 'config.toml'), `\n[languages.${code}]\nbuild_search_index = true\n`);
    }
    const en = json('i18n/en.json');
    const catalogPath = `i18n/${code}.json`;
    const catalog = fs.existsSync(path.join(ROOT, catalogPath)) ? json(catalogPath) : {
        code, name: new Intl.DisplayNames([code], { type: 'language' }).of(code), dir: 'ltr', ready: false, messages: {},
    };
    for (const key of Object.keys(en.messages)) if (!(key in catalog.messages)) catalog.messages[key] = '';
    writeJSON(catalogPath, catalog);
    let created = 0;
    for (const file of sourceFiles()) {
        const out = target(file, code);
        if (fs.existsSync(path.join(ROOT, out))) continue;
        const page = parse(read(file));
        const section = path.basename(file) === '_index.md';
        page.meta.extra ||= {};
        page.meta.extra.translation_of = file.slice('content/'.length);
        page.meta.extra.source_hash = fingerprint(read(file));
        delete page.meta.extra.previous; delete page.meta.extra.next;
        delete page.meta.extra.previous_title; delete page.meta.extra.next_title;
        if (section) page.meta.render = false; else page.meta.draft = true;
        if (page.meta.path) page.meta.path = `${code}/${page.meta.path.replace(/^\//, '')}`;
        fs.writeFileSync(path.join(ROOT, out), encode(page));
        created++;
    }
    console.log(`${code}: created ${created} drafts; existing translations preserved.`);
}
function status(code) {
    if (!codes().includes(code)) throw new Error(`Unknown language: ${code}`);
    const rows = sourceFiles().map(file => {
        const translated = target(file, code);
        if (!fs.existsSync(path.join(ROOT, translated))) return { file, state: 'missing' };
        const { meta } = parse(read(translated));
        const state = meta.draft || meta.render === false ? 'draft' : 'published';
        return { file: translated, state, outdated: meta.extra?.source_hash !== fingerprint(read(file)) };
    });
    console.table(rows);
    return rows;
}
function prepare() {
    const cfg = config();
    const site = { default_language: cfg.default_language, base_url: cfg.base_url.replace(/\/$/, ''), languages: [], locales: {}, pages: {}, routes: {}, categories: [], topics: [] };
    for (const code of codes()) {
        const catalog = json(`i18n/${code}.json`);
        const complete = Object.keys(json('i18n/en.json').messages).every(k => typeof catalog.messages[k] === 'string' && catalog.messages[k].trim());
        const language = { code, name: catalog.name, dir: catalog.dir, home: code === cfg.default_language ? '/' : `/${code}/`, enabled: code === cfg.default_language || (catalog.ready && complete), pdf: false };
        site.languages.push(language);
        site.locales[code] = { ...language, topics: [], categories: [] };
    }
    for (const file of sourceFiles()) {
        const id = file.slice(8);
        const original = parse(read(file)).meta;
        const section = path.basename(file) === '_index.md';
        const baseRoute = original.path ? `/${original.path.replace(/^\//, '').replace(/\/$/, '')}/` : section ? '/' + id.replace(/_index\.md$/, '') : '/' + id.replace(/\.md$/, '/') ;
        site.pages[id] = {};
        if (section && id !== '_index.md') site.categories.push(id);
        if (!section && id.includes('/')) site.topics.push(id);
        for (const code of codes()) {
            const localized = code === cfg.default_language ? file : target(file, code);
            if (!fs.existsSync(path.join(ROOT, localized))) continue;
            const { meta } = parse(read(localized));
            const url = code === cfg.default_language ? baseRoute : `/${code}${baseRoute}`;
            const entry = { id, file: localized.slice(8), url, title: meta.title || '', description: meta.description || '', seo_title: meta.extra?.seo_title || meta.title || '', anchor: meta.extra?.anchor || '', category: id.includes('/') ? id.split('/').slice(0, -1).join('/') + '/_index.md' : '', weight: meta.weight || 0, section, print: !!meta.extra?.print, published: !meta.draft && meta.render !== false };
            site.pages[id][code] = entry;
        }
    }
    for (const language of site.languages) {
        language.enabled = !!(language.enabled && site.pages['_index.md']?.[language.code]?.published);
        const locale = site.locales[language.code];
        locale.enabled = language.enabled;
        for (const [id, variants] of Object.entries(site.pages)) {
            const entry = variants[language.code];
            if (!entry) continue;
            entry.published = !!(entry.published && language.enabled && (!entry.category || site.pages[entry.category]?.[language.code]?.published));
            if (entry.published) {
                site.routes[entry.url] = { id, lang: language.code };
                if (site.topics.includes(id)) locale.topics.push(entry);
                if (site.categories.includes(id)) locale.categories.push(entry);
            }
        }
        locale.topics.sort((a, b) => a.weight - b.weight);
        locale.categories.sort((a, b) => a.weight - b.weight);
        language.pdf = locale.pdf = !!site.pages['print-source.md']?.[language.code]?.published && site.topics.filter(id => site.pages[id][cfg.default_language].print).every(id => site.pages[id]?.[language.code]?.published);
    }
    site.categories.sort((a,b) => site.pages[a][cfg.default_language].weight - site.pages[b][cfg.default_language].weight);
    site.topics.sort((a,b) => site.pages[a][cfg.default_language].weight - site.pages[b][cfg.default_language].weight);
    writeJSON('data/i18n.json', site);
    return site;
}
// Extract Markdown and HTML code independently of prose. A translation must not
// change executable snippets, API identifiers, or the literal examples in tables.
function codeExamples(body) {
    const withoutComments = body.replace(/<!--[\s\S]*?-->/g, '');
    const examples = [];
    const remainder = withoutComments.replace(/^(`{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, block => {
        examples.push(block); return '';
    }).replace(/<code\b[^>]*>[\s\S]*?<\/code>/g, block => {
        examples.push(block); return '';
    });
    for (const match of remainder.matchAll(/(?<!`)(`+)(?!`)([\s\S]*?)(?<!`)\1(?!`)/g)) examples.push(match[0]);
    return examples;
}
function check() {
    const en = json('i18n/en.json');
    const placeholders = text => [...text.matchAll(/\{([a-zA-Z][\w]*)\}/g)].map(m => m[1]).sort().join(',');
    for (const code of codes()) {
        const catalog = json(`i18n/${code}.json`);
        if (catalog.code !== code || !['ltr', 'rtl'].includes(catalog.dir) || !catalog.name) throw new Error(`${code}: invalid catalog metadata`);
        for (const [key, source] of Object.entries(en.messages)) {
            if (!(key in catalog.messages)) throw new Error(`${code}: missing message ${key}`);
            const value = catalog.messages[key];
            if (typeof value !== 'string' || (catalog.ready && !value.trim())) throw new Error(`${code}: untranslated message ${key}`);
            if (value && placeholders(value) !== placeholders(source)) throw new Error(`${code}: parameters differ for ${key}`);
        }
        for (const key of Object.keys(catalog.messages)) if (!(key in en.messages)) throw new Error(`${code}: unknown message ${key}`);
    }
    for (const file of files()) {
        const { meta } = parse(read(file));
        if (!meta.extra?.translation_of) continue;
        const source = `content/${meta.extra.translation_of}`;
        if (!sourceFiles().includes(source)) throw new Error(`${file}: unknown translation source`);
        const code = file.slice(0, -3).split('.').pop();
        if (!codes().includes(code) || target(source, code) !== file) throw new Error(`${file}: incorrect translation filename`);
        if (!/^[a-f0-9]{64}$/.test(meta.extra.source_hash || '')) throw new Error(`${file}: missing source hash`);
        if (meta.extra.source_hash !== fingerprint(read(source))) console.warn(`${file}: original changed; review translation`);
        const originalPage = parse(read(source));
        const original = originalPage.meta;
        if (JSON.stringify(codeExamples(parse(read(file)).body)) !== JSON.stringify(codeExamples(originalPage.body))) throw new Error(`${file}: code examples differ from the original`);
        if (meta.weight !== original.weight || meta.extra.anchor !== original.extra?.anchor) throw new Error(`${file}: stable identity or order changed`);
    }
    console.log('Translation catalogs and source references passed.');
}
if (require.main === module) {
    try {
        const [command, code, filename] = process.argv.slice(2);
        if (command === 'add' || command === 'sync') { scaffold(code, command === 'add'); prepare(); }
        else if (command === 'status') status(code);
        else if (command === 'prepare') prepare();
        else if (command === 'check') check();
        else if (command === 'reviewed') {
            assertCode(code);
            if (!filename || !sourceFiles().includes(`content/${filename.replace(/^content\//, '')}`)) throw new Error('Supply the original Markdown path relative to content/.');
            const source = `content/${filename.replace(/^content\//, '')}`;
            const out = target(source, code);
            const page = parse(read(out));
            page.meta.extra.source_hash = fingerprint(read(source));
            fs.writeFileSync(path.join(ROOT, out), encode(page));
        } else throw new Error('Usage: i18n.js add|sync|status|reviewed|prepare|check [language] [source.md]');
    } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { codeExamples, ROOT, read, json, writeJSON, files, sourceFiles, parse, encode, fingerprint, target, prepare, check, scaffold, status };
