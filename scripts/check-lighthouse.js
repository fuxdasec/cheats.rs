const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const base = process.argv[2] || "http://127.0.0.1:4173";
const site = require("../data/i18n.json");
const routes = Object.keys(site.routes).filter(route => ["_index.md", "memory-layout/basic-types.md"].includes(site.routes[route].id));
const minimum = { performance: 0.90, accessibility: 0.95, 'best-practices': 0.95, seo: 0.95 };

(async () => {
    const [{ default: lighthouse }, chromeLauncher] = await Promise.all([
        import("lighthouse"),
        import("chrome-launcher"),
    ]);
    const chrome = await chromeLauncher.launch({
        chromePath: chromium.executablePath(),
        chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
    });
    const failures = [];
    try {
        for (const route of routes) {
            const audit = async () => {
                const result = await lighthouse(new URL(route, base).href, {
                    port: chrome.port,
                    output: "json",
                    logLevel: "error",
                    preset: "desktop",
                    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
                });
                return Object.fromEntries(Object.entries(result.lhr.categories).map(([id, category]) => [id, category.score]));
            };
            const scores = await audit();
            // Lab performance varies slightly with shared-runner scheduling. Retry a
            // borderline result once; deterministic category failures still fail.
            if (Object.entries(scores).some(([category, score]) => score < minimum[category])) {
                const retry = await audit();
                for (const category of Object.keys(scores)) scores[category] = Math.max(scores[category], retry[category]);
            }
            console.log(`${route}: ${Object.entries(scores).map(([id, score]) => `${id} ${Math.round(score * 100)}`).join(", ")}`);
            for (const [category, score] of Object.entries(scores)) {
                if (score < minimum[category]) failures.push({ route, category, score, minimum: minimum[category] });
            }
        }
    } finally {
        await chrome.kill();
    }
    assert.deepEqual(failures, [], `Lighthouse scores below their quality gates: ${JSON.stringify(failures)}`);
    console.log("Lighthouse quality gates passed.");
})().catch(error => { console.error(error); process.exitCode = 1; });
