const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const axe = require("axe-core");

const base = process.argv[2] || "http://127.0.0.1:4173";

(async () => {
    const sitemap = await (await fetch(new URL("/sitemap.xml", base))).text();
    const routes = [...sitemap.matchAll(/<loc>https:\/\/cheats\.rs([^<]*)<\/loc>/g)].map(match => match[1]);
    const browser = await chromium.launch();
    const failures = [];
    try {
        for (const theme of ["light", "dark"]) {
            for (const width of [390, 1440]) {
                const context = await browser.newContext({ viewport: { width, height: 900 } });
                await context.addInitScript(value => localStorage.setItem("rsds-theme", value), theme);
                const page = await context.newPage();
                for (const route of routes) {
                    await page.goto(base + route, { waitUntil: "domcontentloaded" });
                    await page.addScriptTag({ content: axe.source });
                    const violations = await page.evaluate(async () => {
                        const result = await axe.run(document, {
                            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
                        });
                        return result.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target.join(" ")) }));
                    });
                    if (violations.length) failures.push({ theme, width, route, violations });
                }
                await context.close();
            }
        }
    } finally {
        await browser.close();
    }
    assert.deepEqual(failures, [], `accessibility violations:\n${JSON.stringify(failures, null, 2)}`);
    console.log(`WCAG 2.1 AA checks passed for ${routes.length} routes in both themes.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
