const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const generatedAt = new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
const gitHash = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();

function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(filename);
        if (entry.isFile() && entry.name.endsWith(".html")) {
            const html = fs.readFileSync(filename, "utf8")
                .replaceAll("_NOW_HUMAN_", generatedAt)
                .replaceAll("_GITHASH_", gitHash);
            fs.writeFileSync(filename, html);
        }
    }
}

visit(".");

const sitemap = "sitemap.xml";
if (fs.existsSync(sitemap)) {
    const xml = fs.readFileSync(sitemap, "utf8")
        .replace(/\s*<url>\s*<loc>https:\/\/cheats\.rs\/_print\/<\/loc>[\s\S]*?<\/url>/, "");
    fs.writeFileSync(sitemap, xml);
}
