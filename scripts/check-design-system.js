const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const expected = {
    "atoms.html": ["btn", "ref", "tag", "c", "ty", "kbd", "fn_ref", "link", "toggle", "byte_cell", "ribbon", "chip"],
    "molecules.html": ["table", "code", "note", "bytes", "tabs", "search", "footnotes", "disclosure", "impl_stack", "steps"],
    "organisms.html": ["navbar", "sections_menu", "hero", "group_card", "section", "index", "footer", "board"],
    "shell.html": ["page", "skip_link", "crumbs", "page_head", "toc", "pager", "scroller"],
};

for (const [filename, names] of Object.entries(expected)) {
    const source = fs.readFileSync(path.join("templates", "macros", filename), "utf8");
    for (const name of names) assert(source.includes(`{% macro ${name}(`), `${filename}: missing ${name} macro`);
}

const tokenSource = fs.readFileSync(path.join("sass", "_tokens.scss"), "utf8");
for (const token of ["canvas", "surface", "ink", "body", "muted", "primary", "info", "border", "focus", "diagram-canvas", "diagram-surface", "diagram-ink", "diagram-muted", "cell-memory", "cell-pointer", "cell-type", "cell-local", "cell-invalid", "font-sans", "font-mono", "space-1", "space-16", "radius-sm", "radius-lg", "shadow-1", "shadow-action", "press"]) {
    assert(tokenSource.includes(`--rs-${token}:`), `missing --rs-${token}`);
}

console.log("Design-system catalog checks passed; original content is audited by check:content.");
