const assert = require("node:assert/strict");
const { chromium, firefox } = require("playwright");

const base = process.argv[2] || "http://127.0.0.1:4173";

(async () => {
    const sitemapResponse = await fetch(new URL("/sitemap.xml", base));
    assert(sitemapResponse.ok, `served sitemap returned ${sitemapResponse.status}`);
    const sitemap = await sitemapResponse.text();
    const routes = [...sitemap.matchAll(/<loc>https:\/\/cheats\.rs([^<]*)<\/loc>/g)].map(match => match[1]);
    assert.equal(routes.length, 56, "served sitemap contains every public route");

    for (const engine of [chromium, firefox]) {
        const browser = await engine.launch();
        try {
            const context = await browser.newContext();
            let apiRequests = 0;
            await context.route("https://api.cheats.rs/**", route => { apiRequests++; route.fulfill({ json: {} }); });
            await context.route("https://play.rust-lang.org/**", route => route.fulfill({ body: "<p>Editor fixture</p>" }));
            const page = await context.newPage();
            const errors = [];
            const responseErrors = [];
            const requestFailures = [];
            page.on("pageerror", error => errors.push(error.message));
            page.on("response", response => {
                if (response.url().startsWith(base) && response.status() >= 400) responseErrors.push(`${response.status()} ${response.url()}`);
            });
            page.on("requestfailed", request => {
                if (request.url().startsWith(base)) requestFailures.push(`${request.url()}: ${request.failure()?.errorText}`);
            });

            for (const width of [320, 768, 1440]) {
                await page.setViewportSize({ width, height: 900 });
                for (const route of routes) {
                    await page.goto(base + route, { waitUntil: "domcontentloaded" });
                    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${engine.name()} overflow at ${width}px: ${route}`);
                    assert.equal(await page.locator("main").count(), 1, `${route}: one main`);
                    assert.equal(await page.locator("h1").count(), 1, `${route}: one H1`);
                    assert.equal(await page.locator(".page__content").evaluate(element => getComputedStyle(element).fontSize), "16px");
                    const footerAlignment = await page.locator("footer").evaluate(footer => {
                        const footerBox = footer.getBoundingClientRect();
                        const contentBox = footer.parentElement.getBoundingClientRect();
                        return {
                            centerDelta: Math.abs((footerBox.left + footerBox.width / 2) - (contentBox.left + contentBox.width / 2)),
                            textAlign: getComputedStyle(footer).textAlign,
                        };
                    });
                    assert(footerAlignment.centerDelta < 1 && footerAlignment.textAlign === "center", `${route}: footer is centered`);
                    assert(await page.locator(".reading-toolbar a, .breadcrumbs a, .home-index a, .topic-index a, .local-toc a, .page-navigation a").evaluateAll(links => links.every(link => {
                        const href = link.getAttribute("href");
                        return href?.startsWith("/") || href?.startsWith("#");
                    })), `${route}: navigation stays on the current host`);
                }
            }

            await page.setViewportSize({ width: 320, height: 900 });
            await page.goto(base + "/");
            assert.equal(await page.locator(".category-card > p").count(), 8, "home shows every category description");
            assert(await page.locator(".home-index a").evaluateAll(links => links.every(link => link.getAttribute("href").startsWith("/"))), "home index links stay on the current host");
            await page.goto(base + "/language-constructs/");
            const topicLinks = page.locator(".topic-index a");
            assert.equal(await page.locator(".topic-index a > span").count(), await topicLinks.count(), "category index shows every topic description");
            assert(await topicLinks.evaluateAll(links => links.every(link => link.querySelector("span")?.textContent.trim())), "topic descriptions are non-empty");
            assert(await topicLinks.evaluateAll(links => links.every(link => link.getAttribute("href").startsWith("/"))), "category topic links stay on the current host");

            await page.goto(base + "/language-constructs/hello-rust/");
            await page.locator(".section-menu summary").click();
            const summaryBox = await page.locator(".section-menu summary").boundingBox();
            const summaryTextBox = await page.locator(".section-menu summary").evaluate(element => {
                const range = document.createRange(); range.selectNodeContents(element); const box = range.getBoundingClientRect();
                return { top: box.top, bottom: box.bottom };
            });
            assert(Math.abs((summaryTextBox.top + summaryTextBox.bottom) / 2 - (summaryBox.y + summaryBox.height / 2)) < 2, "Sections text is vertically centered");
            await page.keyboard.press("Escape");
            assert(await page.locator(".section-menu summary").evaluate(element => element === document.activeElement));
            await page.locator("label[for=tab-hello-1]").click();
            await page.locator("#helloctrl a").click();
            await page.locator("#helloplay iframe").waitFor();
            await page.locator("#helloctrl a").click();
            await page.locator("#helloplay iframe").waitFor({ state: "detached" });
            await page.locator("#toggle_night_mode").click();
            await page.locator("#toggle_ligatures").click();
            await page.reload();
            assert.equal(await page.locator("#toggle_night_mode").getAttribute("aria-pressed"), "true");
            assert.equal(await page.locator("#toggle_ligatures").getAttribute("aria-pressed"), "true");

            await page.goto(base + "/memory-layout/basic-types/");
            assert(await page.locator(".local-toc a").count() >= 2);
            assert(await page.locator(".local-toc a").evaluateAll(links => links.every(link => link.getAttribute("href").startsWith("#"))), "local TOC uses local fragments");
            assert.equal((await page.locator(".page-navigation a[rel=next]").innerText()).trim(), "NEXT\nCustom Types");
            await page.locator(".page-navigation a[rel=next]").click();
            assert(page.url().includes("/memory-layout/custom-types/"));

            await page.goto(base + "/404.html");
            assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex");
            assert.equal(await page.locator("main.not-found h1").count(), 1);
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${engine.name()} 404 overflow`);

            await page.goto(base + "/#data-structures");
            await page.waitForURL("**/language-constructs/data-structures/#data-structures");
            assert.equal(await page.locator("h1#data-structures").count(), 1);

            const apiRequestsBeforePrint = apiRequests;
            await page.goto(base + "/_print/#_print");
            await page.emulateMedia({ media: "print" });
            assert.equal(await page.locator(".reading-toolbar").count(), 0);
            assert.equal(await page.locator(".print-topic").count(), 42);
            assert.equal(await page.locator(".print-category").count(), 6);
            assert.equal(await page.locator("feedback").count(), 0);
            assert.equal(await page.locator("blockquote.legend").count(), 1);
            assert.equal(await page.locator("footer").count(), 1);
            assert.equal(apiRequests, apiRequestsBeforePrint, "print source must not call the API");
            assert(await page.locator("tab > panel").evaluateAll(panels => panels.every(panel => getComputedStyle(panel).display !== "none")));
            assert.deepEqual(errors, []);
            assert.deepEqual([...new Set(responseErrors)], []);
            assert.deepEqual([...new Set(requestFailures)], []);
            await context.close();
            console.log(`${engine.name()}: ${routes.length} routes and interactions passed`);
        } finally {
            await browser.close();
        }
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
