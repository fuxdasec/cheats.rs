const { chromium } = require("playwright");
const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "../public.clean");

function opts(pdf, format) {
    return { path: pdf, margin: { top: "0.5cm", bottom: "1cm", left: "0.5cm", right: "0.5cm" }, format,
        displayHeaderFooter: true, headerTemplate: "&nbsp;", footerTemplate: "<div class='pageNumber' style='font-size:8pt;text-align:center;width:100%;opacity:.5'></div>", printBackground: true };
}

function serve(request, response) {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
    catch { response.writeHead(400).end(); return; }
    const relative = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
    const filename = path.resolve(root, `.${relative}`);
    const relation = path.relative(root, filename);
    if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation) || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) {
        response.writeHead(404).end(); return;
    }
    const types = {
        ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
        ".png": "image/png", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".woff": "font/woff", ".woff2": "font/woff2",
    };
    const type = types[path.extname(filename)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    fs.createReadStream(filename).pipe(response);
}

(async () => {
    fs.mkdirSync(path.join(root, "dl"), { recursive: true });
    const server = http.createServer(serve);
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address();
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        let apiRequests = 0;
        const failedResponses = [];
        const failedRequests = [];
        await page.route("https://api.cheats.rs/**", route => { apiRequests++; route.abort(); });
        page.on("response", response => {
            if (response.url().startsWith(`http://127.0.0.1:${port}`) && response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
        });
        page.on("requestfailed", request => {
            if (request.url().startsWith(`http://127.0.0.1:${port}`)) failedRequests.push(`${request.url()}: ${request.failure()?.errorText}`);
        });
        await page.goto(`http://127.0.0.1:${port}/_print/#_print`, { waitUntil: "networkidle" });
        await page.emulateMedia({ media: "print" });
        if (apiRequests !== 0) throw new Error("Print source attempted to call the production API.");
        if (failedResponses.length) throw new Error(`Print resources failed: ${failedResponses.join(", ")}`);
        if (failedRequests.length) throw new Error(`Print requests failed: ${failedRequests.join(", ")}`);
        if (await page.locator("feedback").count()) throw new Error("Feedback controls were attached to the print source.");
        if (await page.locator(".print-topic").count() !== 42) throw new Error("Print source does not contain all 42 printable topics.");
        if (await page.locator(".print-category").count() !== 6) throw new Error("Print source does not contain all six printable category headings.");
        if (!await page.locator("tab > panel").evaluateAll(panels => panels.every(panel => getComputedStyle(panel).display !== "none"))) throw new Error("Not all tab panels are visible for printing.");
        await page.pdf(opts(path.join(root, "dl/rust_cheat_sheet_a4.pdf"), "A4"));
        await page.pdf(opts(path.join(root, "dl/rust_cheat_sheet_letter.pdf"), "Letter"));
    } finally {
        try { await browser.close(); } finally {
            server.close();
            fs.rmSync(path.join(root, "_print"), { recursive: true, force: true });
        }
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
