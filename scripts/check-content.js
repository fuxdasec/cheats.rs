const assert = require("node:assert/strict");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const contentRoot = path.resolve("content");
const manifest = require("./content-integrity.json");

function bodyOf(markdown) {
    if (!markdown.startsWith("+++\n")) return markdown;
    const end = markdown.indexOf("\n+++\n", 4);
    assert(end >= 0, "front matter must have a closing delimiter");
    return markdown.slice(end + 5);
}

function frontMatterOf(markdown) {
    assert(markdown.startsWith("+++\n"), "content must start with front matter");
    const end = markdown.indexOf("\n+++\n", 4);
    assert(end >= 0, "front matter must have a closing delimiter");
    return markdown.slice(4, end);
}

function stringField(frontMatter, name) {
    return frontMatter.match(new RegExp(`^${name}\\s*=\\s*"([^"]*)"`, "m"))?.[1];
}

function digest(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
}

const files = [];
for (const entry of fs.readdirSync(contentRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) {
        for (const name of fs.readdirSync(path.join(contentRoot, entry.name))) {
            if (name.endsWith(".md") && !/\.[^.]+\.md$/.test(name)) files.push(`${entry.name}/${name}`);
        }
    } else if (["faq.md", "legal.md"].includes(entry.name)) {
        files.push(entry.name);
    }
}
files.sort();

assert.equal(files.length, 55, "expected 45 topics, eight category indexes, FAQ, and legal");
assert.deepEqual(files, Object.keys(manifest.files).sort(), "content manifest file list");
for (const filename of files) {
    const source = fs.readFileSync(path.join(contentRoot, filename), "utf8");
    assert.equal(digest(bodyOf(source)), manifest.files[filename], `${filename}: audited content changed`);
}

const topics = files
    .filter(name => name.includes("/") && !name.endsWith("/_index.md"))
    .map(filename => {
        const frontMatter = frontMatterOf(fs.readFileSync(path.join(contentRoot, filename), "utf8"));
        const weight = Number(frontMatter.match(/^weight\s*=\s*(\d+)/m)?.[1]);
        return {
            filename,
            route: `/${filename.replace(/\.md$/, "")}/`,
            title: stringField(frontMatter, "title"),
            previous: stringField(frontMatter, "previous"),
            previousTitle: stringField(frontMatter, "previous_title"),
            next: stringField(frontMatter, "next"),
            nextTitle: stringField(frontMatter, "next_title"),
            weight,
        };
    })
    .sort((a, b) => a.weight - b.weight);
assert.equal(topics.length, 45, "expected 45 ordered topics");
assert.equal(new Set(topics.map(topic => topic.weight)).size, topics.length, "topic weights must be unique");
for (const [index, topic] of topics.entries()) {
    const previous = index === 0 ? { route: "/", title: "Home" } : topics[index - 1];
    const next = index === topics.length - 1 ? { route: "/", title: "Home" } : topics[index + 1];
    assert.equal(topic.previous, previous.route, `${topic.filename}: previous route`);
    assert.equal(topic.previousTitle, previous.title, `${topic.filename}: previous title`);
    assert.equal(topic.next, next.route, `${topic.filename}: next route`);
    assert.equal(topic.nextTitle, next.title, `${topic.filename}: next title`);
}

const pairedTags = ["magic", "tabs", "tab", "panel", "div", "fixed-2-column", "fixed-3-column", "twocolumn", "column"];
for (const filename of files.filter(name => name.includes("/") && !name.endsWith("/_index.md"))) {
    const source = bodyOf(fs.readFileSync(path.join(contentRoot, filename), "utf8"));
    for (const tag of pairedTags) {
        const opens = [...source.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>`, "g"))].length;
        const closes = [...source.matchAll(new RegExp(`</${tag}>`, "g"))].length;
        assert.equal(opens, closes, `${filename}: unbalanced <${tag}> wrappers`);
    }
}

console.log(`Content integrity and navigation checks passed for ${files.length} audited files.`);
