const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const parser = require("posthtml-parser");
const render = require("posthtml-render");

const generatedAt = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
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
            const lineage = [...ancestors, node.tag, ...classes(node)];

            if (classes(node).includes("reading-toolbar")) {
                node.attrs ||= {};
                node.attrs.role = "navigation";
                node.attrs["aria-label"] = "Reading controls";
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
                    attrs: { class: `scroll-region reference-table-frame table-scroll${twoColumn ? " table--two-column" : ""}`, tabindex: "0", role: "region", "aria-label": "Scrollable table", "aria-describedby": hintId },
                    content: [node],
                };
                nodes.splice(index, 1, { tag: "div", attrs: { class: "scroll-hint", id: hintId }, content: ["↔ Drag to see the complete table"] }, wrapper);
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
                        { tag: "button", attrs: { type: "button", class: "copy-button", "aria-label": `Copy code block ${codeNumber}` }, content: ["Copy"] },
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
            const html = normalizeGeneratedHtml(fs.readFileSync(filename, "utf8")
                .replaceAll("_NOW_HUMAN_", generatedAt)
                .replaceAll("_GITHASH_", gitHash), filename);
            fs.writeFileSync(filename, html);
        }
    }
}

const searchIndex = "search_index.en.json";
if (fs.existsSync(searchIndex)) {
    const entries = JSON.parse(fs.readFileSync(searchIndex, "utf8"));
    fs.writeFileSync(searchIndex, JSON.stringify(entries.filter(entry => entry.path !== "/_print/")));
}

visit(".");

const sitemap = "sitemap.xml";
if (fs.existsSync(sitemap)) {
    const xml = fs.readFileSync(sitemap, "utf8")
        .replace(/\s*<url>\s*<loc>https:\/\/cheats\.rs\/_print\/<\/loc>[\s\S]*?<\/url>/, "");
    fs.writeFileSync(sitemap, xml);
}
