const assert = require('node:assert/strict');
const { chromium, firefox } = require('playwright');
const site = require('../data/i18n.json');
const base = process.argv[2] || 'http://127.0.0.1:4173';
(async () => {
    for (const engine of [chromium, firefox]) {
        const browser = await engine.launch();
        try {
            const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
            await context.addInitScript(() => {
                Object.defineProperty(navigator, 'clipboard', {
                    configurable: true,
                    value: { writeText: async value => { window.__copiedCode = value; } },
                });
            });
            await context.route('https://api.cheats.rs/**', route => route.fulfill({json:{}}));
            const page = await context.newPage();
            const errors = []; page.on('pageerror', e => errors.push(e.message));
            for (const language of site.languages.filter(l=>l.enabled)) {
                const catalog = require(`../i18n/${language.code}.json`).messages;
                await page.goto(base + language.home);
                assert.equal(await page.locator('html').getAttribute('lang'), language.code);
                assert.equal(await page.locator('.language-switcher [aria-current=true]').innerText(), language.name);
                assert.equal((await page.locator('.section-trigger').innerText()).replace(/\s+/g, ' ').trim(), `▸ ${catalog.Sections}`);
                await page.locator('.section-trigger').click();
                await page.locator('[data-search-input]').fill(language.code==='pt-BR' ? 'referências' : 'references');
                await page.locator('.search-results li').first().waitFor();
                const links = await page.locator('.search-results a').evaluateAll(nodes => nodes.map(n=>new URL(n.href).pathname));
                assert(links.every(url => site.routes[url].lang === language.code));
                await page.keyboard.press('Escape');
                const topic = site.locales[language.code].topics[0];
                await page.goto(base + topic.url);
                const source = await page.locator('main pre > code').first().textContent();
                await page.locator('.copy-button').first().click();
                await page.locator('.copy-button').first().getByText(catalog['Copied!'], { exact: true }).waitFor();
                assert.equal(await page.locator('main pre > code').first().textContent(), source);
                assert.equal(await page.evaluate(() => window.__copiedCode), source);
                assert.equal(await page.locator('.page-navigation [rel=prev]').getAttribute('href'), language.home);
                for (const link of await page.locator('.language-switcher a').all()) {
                    const code = await link.getAttribute('hreflang');
                    const destination = await link.getAttribute('href');
                    const route = site.routes[destination];
                    assert.equal(route.lang, code);
                    assert(route.id === topic.id || destination === site.languages.find(item => item.code === code).home);
                }
                const diagram = language.home + 'memory-layout/basic-types/';
                if (site.routes[diagram]) {
                    await page.goto(base + diagram);
                    assert.equal(await page.locator('.basic-type-gallery').count(), 2, 'localized route enhances the same diagram');
                }
            }
            assert.deepEqual(errors, []);
            await context.close();
        } finally { await browser.close(); }
    }
    console.log('Language switching, translated search, copying, navigation and diagrams passed in Chromium and Firefox.');
})().catch(error=>{console.error(error);process.exitCode=1});
