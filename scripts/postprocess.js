const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const parser = require("posthtml-parser");
const render = require("posthtml-render");

const site = require("../data/i18n.json");
const catalogs = Object.fromEntries(site.languages.map(({code}) => [code, require(`../i18n/${code}.json`).messages]));
const translate = (lang, key, params = {}) => (catalogs[lang]?.[key] || key).replace(/\{([A-Za-z]\w*)\}/g, (match, name) => Object.hasOwn(params, name) ? String(params[name]) : match);
const gitHash = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();

const parse = parser.parser || parser.default || parser;
const stringify = render.render || render.default || render;
const classes = node => (node.attrs?.class || "").split(/\s+/).filter(Boolean);
const addClass = (node, name) => {
    node.attrs ||= {};
    node.attrs.class = [...new Set([...classes(node), name])].join(" ");
};
const plainText = node => {
    if (typeof node === "string") return node;
    return (node.content || []).map(plainText).join("").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
};
const findAll = (nodes, predicate, found = []) => {
    for (const node of nodes || []) {
        if (!node || typeof node !== "object") continue;
        if (predicate(node)) found.push(node);
        findAll(node.content, predicate, found);
    }
    return found;
};

function normalizeGeneratedHtml(html, filename) {
    if (filename.includes(`${path.sep}_print${path.sep}`)) return html;
    const tree = parse(html);
    const lang = html.match(/<html[^>]*lang="([^" ]+)"/)?.[1] || "en";
    const t = (key, params) => translate(lang, key, params);
    const state = { table: 0, code: 0 };
    const excludedTables = new Set(["datum", "zoo", "mini-zoo", "lifetime-example", "threading-section"]);
    const routeParts = filename.split(path.sep);
    const tableTone = routeParts.includes("language-constructs") ? "language"
        : routeParts.includes("standard-library") ? "std"
            : routeParts.includes("tooling") ? "tooling" : "neutral";

    const walk = (nodes, ancestors = []) => {
        for (let index = 0; index < (nodes || []).length; index++) {
            const node = nodes[index];
            if (!node || typeof node !== "object") continue;
            if (node.tag === 'a' && classes(node).includes('tooltip') && !node.attrs?.href) node.tag = 'span';
            if (node.tag === 'time' && node.attrs?.['data-local-date'] !== undefined) node.content = [new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(node.attrs.datetime))];
            const lineage = [...ancestors, node.tag, ...classes(node)];
            // Resolve content links by source identity. An untranslated destination stays
            // on its original URL and is explicitly identified as English.
            if (lang !== site.default_language && node.tag === 'a' && node.attrs?.href && (ancestors.includes('topic-body') || ancestors.includes('localized-content'))) {
                const raw = node.attrs.href;
                if (!raw.startsWith('#') && !raw.startsWith('javascript:')) {
                    const destination = new URL(raw, site.base_url);
                    if (destination.origin === new URL(site.base_url).origin) {
                        const route = destination.pathname.endsWith('/') ? destination.pathname : destination.pathname + '/';
                        const identity = site.routes[route];
                        if (identity) {
                            const variants = site.pages[identity.id];
                            const translated = variants[lang];
                            if (translated?.published) node.attrs.href = translated.url + destination.search + destination.hash;
                            else {
                                node.attrs.href = variants[site.default_language].url + destination.search + destination.hash;
                                node.attrs.lang = site.default_language;
                                node.attrs.hreflang = site.default_language;
                                if (!node.attrs['data-language-fallback']) {
                                    node.attrs['data-language-fallback'] = 'true';
                                    node.content ||= [];
                                    node.content.push({ tag: 'small', attrs: { lang }, content: [` (${t('Read in English')})`] });
                                }
                            }
                        }
                    }
                }
            }


            if (classes(node).includes("reading-toolbar")) {
                node.attrs ||= {};
                node.attrs.role = "navigation";
                node.attrs["aria-label"] = t("Reading controls");
            }

            if (classes(node).includes("topic-body")) {
                const headings = findAll(node.content, candidate => /^h[2-6]$/.test(candidate.tag || ""));
                const minimum = Math.min(...headings.map(heading => Number(heading.tag.slice(1))));
                if (Number.isFinite(minimum) && minimum > 2) {
                    for (const heading of headings) heading.tag = `h${Math.min(6, Number(heading.tag.slice(1)) - minimum + 2)}`;
                }
            }

            walk(node.content, lineage);

            if (node.tag === "table" && !ancestors.some(tag => excludedTables.has(tag)) && !ancestors.includes("scroll-region")) {
                const tableNumber = state.table++;
                const headers = findAll(node.content, child => child.tag === "th");
                headers.forEach((header, column) => {
                    header.attrs ||= {};
                    header.attrs.scope ||= "col";
                    header.attrs.id ||= `rs-table-${tableNumber}-col-${column}`;
                });
                const rows = findAll(node.content, child => child.tag === "tr");
                for (const row of rows) {
                    const cells = (row.content || []).filter(child => child && typeof child === "object" && child.tag === "td");
                    cells.forEach((cell, column) => {
                        cell.attrs ||= {};
                        if (headers[column]) {
                            cell.attrs.headers = headers[column].attrs.id;
                            cell.attrs["data-label"] = plainText(headers[column]);
                        }
                    });
                }
                addClass(node, "reference-table");
                addClass(node, `reference-table--${tableTone}`);
                const twoColumn = headers.length === 2;
                const hintId = `scroll-hint-table-${tableNumber}`;
                const wrapper = {
                    tag: "div",
                    attrs: { class: `scroll-region reference-table-frame table-scroll${twoColumn ? " table--two-column" : ""}`, tabindex: "0", role: "region", "aria-label": t("Scrollable table"), "aria-describedby": hintId },
                    content: [node],
                };
                nodes.splice(index, 1, { tag: "div", attrs: { class: "scroll-hint", id: hintId }, content: [t("↔ Drag to see the complete table")] }, wrapper);
                index++;
                continue;
            }

            if (node.tag === "pre" && !classes(node).includes("code-block__pre") && (node.content || []).some(child => child && typeof child === "object" && child.tag === "code")) {
                const codeNumber = ++state.code;
                addClass(node, "code-block__pre");
                nodes[index] = {
                    tag: "div",
                    attrs: { class: "code-block" },
                    content: [
                        { tag: "button", attrs: { type: "button", class: "copy-button", "aria-label": t("Copy code block {number}", {number: codeNumber}) }, content: [t("Copy")] },
                        node,
                    ],
                };
                continue;
            }

            if (["datum", "zoo", "mini-zoo", "lifetime-example", "threading-section", "generics-section"].includes(node.tag)) addClass(node, "rs-diagram");
        }
    };

    walk(tree);
    return stringify(tree);
}

function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(filename);
        if (entry.isFile() && entry.name.endsWith(".html")) {
            const raw = fs.readFileSync(filename, "utf8");
            const language = raw.match(/<html[^>]*lang="([^" ]+)"/)?.[1] || "en";
            const generatedAt = new Intl.DateTimeFormat(language, { day: "numeric", month: "long", year: "numeric" }).format(new Date());
            const html = normalizeGeneratedHtml(raw
                .replaceAll("_NOW_HUMAN_", generatedAt)
                .replaceAll("_GITHASH_", gitHash), filename);
            fs.writeFileSync(filename, html);
        }
    }
}

// Filter native output against the publication manifest, including disabled locales.
for (const language of site.languages) {
    const filename = `search_index.${language.code}.json`;
    if (!fs.existsSync(filename)) continue;
    const entries = JSON.parse(fs.readFileSync(filename, "utf8")).filter(entry => {
        const route = new URL(entry.path || entry.permalink, site.base_url).pathname;
        return site.routes[route] && !route.includes("/_print/");
    }).map(entry => {
        const route = new URL(entry.path || entry.permalink, site.base_url).pathname;
        const identity = site.routes[route];
        const page = site.pages[identity.id][language.code];
        return { ...entry, category: page.category ? site.pages[page.category][language.code].title : "" };
    });
    fs.writeFileSync(filename, JSON.stringify(entries));
}

visit(".");

// Zola emits one sitemap per language and a sitemap index for multilingual sites.
for (const filename of fs.readdirSync('.').filter(name => /^sitemap.*\.xml$/.test(name))) {
    const xml = fs.readFileSync(filename, 'utf8').replace(/<url>[\s\S]*?<\/url>/g, entry => {
        const location = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
        return location && site.routes[new URL(location).pathname] && !location.includes('/_print/') ? entry : '';
    });
    fs.writeFileSync(filename, xml);
}
