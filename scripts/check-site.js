const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || "public");
const finalArtifact = process.argv.includes("--final");
const content = path.resolve("content");
const categories = fs.readdirSync(content, { withFileTypes: true }).filter(entry => entry.isDirectory());
const topics = categories.flatMap(category => fs.readdirSync(path.join(content, category.name)).filter(name => name.endsWith(".md") && name !== "_index.md"));
assert.equal(categories.length, 8, "expected eight category sections");
assert.equal(topics.length, 45, "expected 45 topic pages");

const htmlFiles = [];
(function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(filename);
        else if (entry.name === "index.html") htmlFiles.push(filename);
    }
})(root);

const published = htmlFiles.filter(filename => !filename.includes(`${path.sep}_print${path.sep}`));
assert.equal(published.length, 56, "expected home, categories, topics, FAQ, and legal pages");
if (finalArtifact) assert(!fs.existsSync(path.join(root, "_print")), "final artifact must not publish the print source");
const titles = new Set();
const descriptions = new Set();
const decode = value => value.replaceAll("&#x2F;", "/").replaceAll("&amp;", "&");
const capture = (html, regex, message) => { const value = html.match(regex)?.[1]; assert(value, message); return decode(value); };

for (const filename of published) {
    const html = fs.readFileSync(filename, "utf8");
    const relative = path.relative(root, filename);
    const title = capture(html, /<title>([^<]+)/, `${relative}: title`);
    const description = capture(html, /<meta name="description" content="([^"]+)"/, `${relative}: description`);
    const canonical = capture(html, /<link rel="canonical" href="([^"]+)"/, `${relative}: canonical`);
    assert(!titles.has(title), `${relative}: duplicate title`); titles.add(title);
    assert(!descriptions.has(description), `${relative}: duplicate description`); descriptions.add(description);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${relative}: exactly one H1`);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${relative}: duplicate IDs`);
    assert(html.includes('<meta property="og:title"'), `${relative}: Open Graph metadata`);
    assert(html.includes('<meta name="twitter:title"'), `${relative}: Twitter metadata`);
    const route = relative === "index.html" ? "/" : `/${path.dirname(relative).split(path.sep).join("/")}/`;
    assert.equal(canonical, `https://cheats.rs${route}`, `${relative}: canonical URL`);
    assert.equal(capture(html, /<meta property="og:title" content="([^"]+)"/, `${relative}: og:title`), title, `${relative}: Open Graph title`);
    assert.equal(capture(html, /<meta property="og:description" content="([^"]+)"/, `${relative}: og:description`), description, `${relative}: Open Graph description`);
    assert.equal(capture(html, /<meta property="og:url" content="([^"]+)"/, `${relative}: og:url`), canonical, `${relative}: Open Graph URL`);
    assert.equal(capture(html, /<meta property="og:image" content="([^"]+)"/, `${relative}: social image`), "https://cheats.rs/social-card.png", `${relative}: social image URL`);
    assert(html.includes('<meta property="og:image:width" content="1200">'), `${relative}: social image width`);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    if (route === "/") assert.deepEqual(schemas.map(schema => schema["@type"]), ["WebSite"], "home WebSite schema");
    else if (!['/faq/', '/legal/'].includes(route)) assert.deepEqual(schemas.map(schema => schema["@type"]), ["BreadcrumbList"], `${relative}: breadcrumb schema`);
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
assert.equal((sitemap.match(/<loc>/g) || []).length, 56, "sitemap URL count");
assert(!sitemap.includes("/_print/"), "print source excluded from sitemap");
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
assert(robots.includes("Sitemap: https://cheats.rs/sitemap.xml"), "robots.txt advertises sitemap");
for (const filename of published) {
    const relative = path.relative(root, filename);
    const route = relative === "index.html" ? "/" : `/${path.dirname(relative).split(path.sep).join("/")}/`;
    assert(sitemap.includes(`<loc>https://cheats.rs${route}</loc>`), `sitemap missing ${route}`);
}

const internalErrors = [];
for (const filename of htmlFiles) {
    const html = fs.readFileSync(filename, "utf8");
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const url = decode(match[1]);
        if (!url.startsWith("/") || url.startsWith("//") || (!finalArtifact && url.startsWith("/dl/"))) continue;
        const [pathname, fragment] = url.split("#");
        let target = path.join(root, pathname);
        if (pathname.endsWith("/") || !path.extname(target)) target = path.join(target, "index.html");
        if (!fs.existsSync(target)) { internalErrors.push(`${path.relative(root, filename)} -> ${url}`); continue; }
        if (fragment && target.endsWith(".html") && !fs.readFileSync(target, "utf8").includes(`id="${fragment}"`)) internalErrors.push(`${path.relative(root, filename)} -> ${url}`);
    }
}
assert.deepEqual(internalErrors, [], "all internal links and fragments resolve");

const legacy = JSON.parse(fs.readFileSync(path.join(root, "legacy-anchors.json"), "utf8"));
for (const [old, destination] of Object.entries(legacy)) {
    const [pathname, fragment] = destination.split("#");
    const target = path.join(root, pathname, "index.html");
    assert(fs.existsSync(target), `legacy ${old}: route exists`);
    assert(fs.readFileSync(target, "utf8").includes(`id="${fragment}"`), `legacy ${old}: fragment exists`);
}
assert.equal(Object.keys(legacy).length, 61, "all legacy heading fragments are mapped");

for (const stylesheet of ["font-opensans.css", "font-firacode.css", "main.css"]) {
    const css = fs.readFileSync(path.join(root, stylesheet), "utf8");
    for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
        const url = match[1];
        if (url.startsWith("data:") || url.startsWith("http")) continue;
        assert(fs.existsSync(path.join(root, url.replace(/^\//, ""))), `${stylesheet}: missing ${url}`);
    }
}
const searchIndex = JSON.parse(fs.readFileSync(path.join(root, "search_index.en.json"), "utf8"));
assert(Array.isArray(searchIndex) && searchIndex.length >= published.length, "native search index covers the published site");
assert(searchIndex.every(item => item.title && item.path?.startsWith("/")), "search entries contain titles and local paths");
assert(searchIndex.every(item => !item.path.startsWith("/_print/")), "print source is excluded from search");
for (const route of ["data-structures", "references-pointers", "functions-behavior", "control-flow", "organizing-code", "type-aliases-and-casts", "macros-attributes"]) {
    const html = fs.readFileSync(path.join(root, "language-constructs", route, "index.html"), "utf8");
    assert(html.includes("reference-table-frame"), `${route}: reference tables use the design-system frame`);
    assert(html.includes("reference-table--language"), `${route}: reference tables use the language tone`);
}
for (const filename of ["js/theme.js", "js/nav.js", "js/search.js", "js/copy.js"]) {
    assert(fs.statSync(path.join(root, filename)).size > 100, `${filename}: interface behavior is present`);
}
const socialCard = fs.readFileSync(path.join(root, "social-card.png"));
assert(socialCard.length > 10_000, "social card is present and non-empty");
if (finalArtifact) {
    for (const pdf of ["rust_cheat_sheet_a4.pdf", "rust_cheat_sheet_letter.pdf"]) {
        assert(fs.statSync(path.join(root, "dl", pdf)).size > 100_000, `${pdf}: generated PDF is present`);
    }
}
console.log(`SEO and route checks passed for ${published.length} published pages.`);
