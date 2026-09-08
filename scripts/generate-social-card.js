const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
        const logo = `data:image/png;base64,${fs.readFileSync(path.resolve(__dirname, "../static/logo.png"), "base64")}`;
        await page.setContent(`<!doctype html><style>
            * { box-sizing: border-box; }
            body { margin: 0; width: 1200px; height: 630px; display: grid; place-items: center; background: #f4f6f8; color: #293340; font-family: Arial, sans-serif; }
            main { width: 1080px; height: 510px; display: flex; align-items: center; gap: 64px; padding: 72px; border: 4px solid #ccd4de; border-radius: 32px; background: white; }
            img { width: 240px; height: auto; image-rendering: auto; }
            h1 { max-width: 650px; margin: 0 0 28px; font-size: 76px; line-height: 1.05; letter-spacing: -2px; }
            p { margin: 0; color: #1d5d9f; font-size: 38px; font-weight: bold; }
        </style><main><img src="${logo}" alt=""><div><h1>Rust Language Cheat Sheet</h1><p>cheats.rs</p></div></main>`);
        await page.locator("img").evaluate(image => image.decode());
        await page.screenshot({ path: path.resolve(__dirname, "../static/social-card.png") });
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
