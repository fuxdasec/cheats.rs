const assert = require("node:assert/strict");
const { chromium, firefox } = require("playwright");

const base = process.argv[2] || "http://127.0.0.1:4173";

(async () => {
    const routes = await require('./sitemap').servedRoutes(base);
    const expected = Object.keys(require('../data/i18n.json').routes).filter(route => !route.includes('/_print/'));
    assert.deepEqual([...routes].sort(), expected.sort(), 'served sitemap contains every published translation');

    for (const engine of [chromium, firefox]) {
        const browser = await engine.launch();
        try {
            const context = await browser.newContext();
            await context.addInitScript(() => {
                Object.defineProperty(navigator, "clipboard", {
                    configurable: true,
                    value: { writeText: async value => { window.__copiedCode = value; } },
                });
            });
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
                const error = request.failure()?.errorText;
                if (request.url().startsWith(base) && error !== "NS_BINDING_ABORTED") requestFailures.push(`${request.url()}: ${error}`);
            });

            for (const width of [320, 390, 768, 1024, 1440]) {
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
                    assert(await page.locator("tabs.rs-tabs").evaluateAll(tabLists => tabLists.every(tabList => {
                        const tabs = [...tabList.querySelectorAll(":scope > .rs-tab-buttons > [role=tab]")];
                        return tabList.querySelector(":scope > .rs-tab-buttons")?.getAttribute("role") === "tablist"
                            && tabs.filter(tab => tab.getAttribute("aria-selected") === "true").length === 1
                            && tabs.every(tab => {
                                const panel = document.getElementById(tab.getAttribute("aria-controls"));
                                return panel?.getAttribute("role") === "tabpanel"
                                    && panel.getAttribute("aria-labelledby") === tab.id
                                    && panel.hidden === (tab.getAttribute("aria-selected") !== "true");
                            });
                    })), `${route}: tabs expose one consistent accessible interface`);
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

            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(base + "/behind-the-scenes/abstract-machine/");
            assert.equal(await page.locator("#tab-abstract-machine-1 ~ panel .mini-zoo-gallery").count(), 1, "abstract-machine overview uses one comparison grid");
            assert(await page.locator("#tab-abstract-machine-1 ~ panel .mini-zoo-card").evaluateAll(diagrams => diagrams.every(diagram => getComputedStyle(diagram).justifyContent === "center")), "abstract-machine overview illustrations are centered in their cards");

            await page.setViewportSize({ width: 390, height: 900 });
            assert(await page.locator("#tab-abstract-machine-1 ~ panel .mini-zoo-card").evaluateAll(diagrams => diagrams.every(diagram => diagram.scrollWidth <= diagram.clientWidth + 1)), "wrapped abstract-machine illustrations remain contained on mobile");

            await page.goto(base + "/memory-layout/basic-types/");
            assert.equal(await page.locator(".basic-type-group").count(), 3, "basic numeric layouts are divided into understandable families");
            assert.equal(await page.locator(".basic-type-gallery--numeric .basic-type-card").count(), 11, "every boolean and numeric layout is presented as a card");
            assert.equal(await page.locator(".basic-type-gallery--textual .basic-type-card").count(), 2, "textual layouts use the same card vocabulary");
            assert.equal(await page.locator(".basic-type-card .basic-type-size").count(), 13, "each basic type card states its memory size");
            assert.equal((await page.locator(".basic-type-gallery--textual .basic-type-size").last().innerText()).trim(), "variable length", "str is identified as variable-length memory");
            assert.equal(await page.locator(".basic-type-gallery .datum-scroll").count(), 0, "small basic type cards do not create individual scroll regions");
            assert.equal(await page.locator(".datum-card--detail").count(), 1, "the float internals datum uses the detail-card variant");
            assert.equal(await page.locator(".datum-scroll").count(), 0, "every Basic Types datum avoids a redundant scroll region");
            assert.equal(await page.locator(".basic-numeric-shell.scroll-region").count(), 0, "numeric tabs do not create a redundant outer scroll region");
            assert(await page.locator(".basic-type-gallery--numeric visual").evaluateAll(visuals => visuals.every(visual => visual.scrollWidth <= visual.clientWidth + 1 && visual.getBoundingClientRect().height < 50)), "numeric byte diagrams stay on one line inside their cards");
            for (const label of await page.locator("tabs:has(#tab-numeric-1) > .rs-tab-buttons > label").all()) {
                await label.click();
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${await label.innerText()}: numeric reference stays in the mobile viewport`);
            }

            const datumPageExpectations = [
                ["/memory-layout/custom-types/", 9, 3],
                ["/memory-layout/references-pointers/", 7, 2],
                ["/memory-layout/closures/", 2, 1],
                ["/memory-layout/standard-library-types/", 26, 6],
            ];
            for (const width of [320, 390, 768, 1024, 1440]) {
                await page.setViewportSize({ width, height: 900 });
                for (const [route, cardCount, groupCount] of datumPageExpectations) {
                    await page.goto(base + route, { waitUntil: "domcontentloaded" });
                    assert.equal(await page.locator(".datum-card").count(), cardCount, `${route}: every datum becomes a card`);
                    assert.equal(await page.locator(".datum-group").count(), groupCount, `${route}: datums retain their semantic groups`);
                    assert.equal(await page.locator(".datum-scroll").count(), 0, `${route}: datum cards do not create scroll boxes at ${width}px`);
                    assert(await page.locator(".datum-card").evaluateAll(cards => cards.every(card => {
                        const cardBox = card.getBoundingClientRect();
                        const regions = [...card.children].filter(child => {
                            const box = child.getBoundingClientRect();
                            return getComputedStyle(child).display !== "none" && box.width > 0 && box.height > 0;
                        });
                        if (card.scrollWidth > card.clientWidth + 1 || card.scrollHeight > card.clientHeight + 1) return false;
                        if (!regions.every(region => {
                            const box = region.getBoundingClientRect();
                            return box.left >= cardBox.left - 1 && box.right <= cardBox.right + 1
                                && box.top >= cardBox.top - 1 && box.bottom <= cardBox.bottom + 1;
                        })) return false;
                        for (let index = 1; index < regions.length; index++) {
                            const previous = regions[index - 1].getBoundingClientRect();
                            const current = regions[index].getBoundingClientRect();
                            if (previous.bottom > current.top + 1) return false;
                        }
                        return true;
                    })), `${route}: card regions stay contained and do not overlap at ${width}px`);
                    assert(await page.locator(".datum-card__figure").evaluateAll(figures => figures.every(figure => figure.scrollWidth <= figure.clientWidth + 1)), `${route}: technical figures fit without internal scrolling at ${width}px`);
                    assert(await page.locator(".datum-gallery").evaluateAll(galleries => galleries.every(gallery => {
                        const cards = [...gallery.children].map(card => card.getBoundingClientRect());
                        for (let left = 0; left < cards.length; left++) {
                            for (let right = left + 1; right < cards.length; right++) {
                                const a = cards[left];
                                const b = cards[right];
                                const overlapWidth = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
                                const overlapHeight = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
                                if (overlapWidth * overlapHeight > 1) return false;
                            }
                        }
                        return true;
                    })), `${route}: cards do not overlap one another at ${width}px`);
                    assert(await page.locator("datum[role=group]").evaluateAll(cards => cards.every(card => {
                        const title = document.getElementById(card.getAttribute("aria-labelledby"));
                        return title?.parentElement === card && title.getAttribute("role") === "heading";
                    })), `${route}: every titled card exposes its heading relationship`);
                }
            }

            await page.setViewportSize({ width: 320, height: 900 });
            await page.goto(base + "/memory-layout/references-pointers/");
            assert(await page.locator(".datum-card--vtable .datum-card__figure > memory-entry").evaluateAll(entries => {
                const boxes = entries.map(entry => entry.getBoundingClientRect());
                return boxes.length === 2 && boxes[0].bottom <= boxes[1].top + 1;
            }), "the trait-object target and vtable stack instead of overlapping on mobile");

            await page.setViewportSize({ width: 1440, height: 900 });
            for (const [route] of datumPageExpectations) {
                await page.goto(base + route);
                assert(await page.locator(".datum-gallery").first().evaluate(gallery => {
                    const rows = [...gallery.children].map(card => Math.round(card.getBoundingClientRect().top));
                    return new Set(rows).size < rows.length;
                }), `${route}: comparison cards share rows on desktop`);
            }

            await page.goto(base + "/memory-layout/standard-library-types/");
            await page.emulateMedia({ media: "print" });
            assert(await page.locator(".datum-card").evaluateAll(cards => cards.every(card => {
                const style = getComputedStyle(card);
                return style.display !== "none" && style.breakInside === "avoid" && card.scrollWidth <= card.clientWidth + 1;
            })), "datum cards remain complete and uncut when an individual page is printed");
            await page.emulateMedia({ media: "screen" });

            await page.goto(base + "/working-with-types/types-traits-generics/");
            await page.emulateMedia({ media: "print" });
            assert(await page.locator("generics-section > description").evaluateAll(descriptions => descriptions.every(description => getComputedStyle(description).display !== "none")), "all generics descriptions are visible in print");
            assert(await page.locator("tabs > tab > panel").evaluateAll(panels => panels.every(panel => getComputedStyle(panel).display !== "none")), "all tab panels are visible in print");
            assert(await page.locator(".mini-zoo-gallery.visual-flow").evaluateAll(flows => flows.every(flow => getComputedStyle(flow).flexWrap === "wrap" && flow.scrollWidth <= flow.clientWidth + 1)), "mini-diagram flows wrap without clipping in print");
            await page.emulateMedia({ media: "screen" });

            const miniZooPages = [
                ["/behind-the-scenes/abstract-machine/", 2, 1],
                ["/standard-library/iterators/", 11, 4],
                ["/working-with-types/types-traits-generics/", 65, 28],
            ];
            for (const width of [390, 1440]) {
                await page.setViewportSize({ width, height: 900 });
                for (const [route, miniZooCount, galleryCount] of miniZooPages) {
                    await page.goto(base + route);
                    assert.equal(await page.locator("mini-zoo").count(), miniZooCount, `${route}: every authored mini diagram remains present`);
                    assert.equal(await page.locator(".mini-zoo-gallery").count(), galleryCount, `${route}: related mini diagrams are grouped consistently`);
                    assert.equal(await page.locator(".mini-zoo-gallery mini-zoo .scroll-region").count(), 0, `${route}: mini diagrams never receive nested scroll regions`);
                    assert(await page.locator(".mini-zoo-gallery.scroll-region").evaluateAll(flows => flows.every(flow => flow.scrollHeight <= flow.clientHeight + 1)), `${route}: connected mini-diagram flows never scroll vertically`);
                    assert(await page.locator(".mini-zoo-card").evaluateAll(cards => cards.every(card => card.scrollHeight <= card.clientHeight + 1 && card.scrollWidth <= card.clientWidth + 1)), `${route}: mini-diagram cards contain their content at ${width}px`);
                }
            }

            await page.setViewportSize({ width: 390, height: 900 });
            await page.goto(base + "/working-with-types/types-traits-generics/");
            assert.equal(await page.locator(".disclosure-card").count(), 19, "every generics section becomes a disclosure card");
            assert.deepEqual(await page.locator("tabs > tab").evaluateAll(tabs => tabs.map(tab => tab.querySelectorAll('.disclosure-toggle[aria-expanded="true"]').length)), [1, 1, 1], "the first generics section in each tab starts open");
            assert(await page.locator(".disclosure-toggle").evaluateAll(buttons => buttons.every(button => button.tagName === "BUTTON" && document.getElementById(button.getAttribute("aria-controls")))), "every generics disclosure uses a real button and linked region");
            const genericsToggle = page.locator(".disclosure-toggle").nth(1);
            await genericsToggle.press("Enter");
            assert.equal(await genericsToggle.getAttribute("aria-expanded"), "true", "Enter opens a generics disclosure");
            await genericsToggle.press("Space");
            assert.equal(await genericsToggle.getAttribute("aria-expanded"), "false", "Space closes a generics disclosure");
            assert.equal(await page.locator("mini-table").count(), 23, "all generics comparison tables remain present");
            assert.equal(await page.locator("mini-table.mini-table-card").count(), 23, "all mini tables use the shared card treatment");

            await page.goto(base + "/standard-library/iterators/");
            const iteratorTabs = page.locator("tabs > .rs-tab-buttons > [role=tab]");
            await iteratorTabs.first().focus();
            await iteratorTabs.first().press("ArrowRight");
            assert.equal(await iteratorTabs.nth(1).getAttribute("aria-selected"), "true", "ArrowRight selects the next tab");
            await iteratorTabs.nth(1).press("End");
            assert.equal(await iteratorTabs.last().getAttribute("aria-selected"), "true", "End selects the last tab");
            await iteratorTabs.last().press("Home");
            assert.equal(await iteratorTabs.first().getAttribute("aria-selected"), "true", "Home selects the first tab");

            await page.setViewportSize({ width: 390, height: 900 });
            await page.goto(base + "/behind-the-scenes/memory-lifetimes/");
            const panelIsInViewport = panel => panel.evaluate(element => {
                const box = element.getBoundingClientRect();
                return box.left >= 0 && box.left < innerWidth && box.right <= innerWidth + 1;
            });
            assert.equal(await page.locator("lifetime-section > explanation").count(), 22, "lifetime guide contains every explanation");
            assert.equal(await page.locator("lifetime-section > .lifetime-toggle").count(), 22, "every lifetime explanation has an explicit toggle");
            assert.equal(await page.locator("lifetime-section > .lifetime-toggle:first-child").count(), 22, "each diagram card starts with its title and explanation control");
            assert.equal(await page.locator("tabs.lifetimes .lifetime-diagram-key").count(), 6, "every lifetime tab explains the diagram vocabulary");
            assert(await page.locator(".lifetime-diagram-key").evaluateAll(keys => keys.every(key => ["Memory bytes", "Values", "Bindings", "Earlier state"].every(label => key.textContent.includes(label)))), "diagram keys identify every visual track");
            assert(await page.locator(".lifetime-toggle").evaluateAll(buttons => {
                const controls = buttons.map(button => button.getAttribute("aria-controls"));
                return buttons.every(button => button.tagName === "BUTTON" && button.getAttribute("aria-expanded") === "false" && !button.closest(".scroll-region"))
                    && new Set(controls).size === controls.length
                    && controls.every(id => document.getElementById(id));
            }), "lifetime toggles expose unique accessible relationships outside scroll regions");

            const lifetimeTabs = await page.locator("tabs.lifetimes > .rs-tab-buttons > label").all();
            for (const label of lifetimeTabs) {
                await label.click();
                const panel = page.locator("tabs.lifetimes > tab > input:checked ~ panel");
                assert(await panelIsInViewport(panel), `${await label.innerText()}: panel stays in the mobile viewport`);
                assert(await panel.locator("memory-backdrop").evaluateAll(backdrops => backdrops.every(backdrop => {
                    const style = getComputedStyle(backdrop);
                    return style.overflowX === "hidden" && style.overflowY === "hidden" && backdrop.scrollWidth <= backdrop.clientWidth + 1;
                })), `${await label.innerText()}: memory rows do not clip or scroll internally`);
                assert(await panel.locator(".diagram-scroll").evaluateAll(regions => regions.every(region => region.scrollHeight <= region.clientHeight + 1)), `${await label.innerText()}: diagrams do not create vertical scrollbars`);
                assert(await panel.locator("memory-row").evaluateAll(rows => rows.every(row => {
                    const elements = [...row.querySelectorAll("memory-backdrop, arrows, values value, values failed, values drop, values denied, labels label")]
                        .filter(element => {
                            const style = getComputedStyle(element);
                            const box = element.getBoundingClientRect();
                            return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
                        });
                    for (let left = 0; left < elements.length; left++) {
                        for (let right = left + 1; right < elements.length; right++) {
                            const first = elements[left];
                            const second = elements[right];
                            if (first.contains(second) || second.contains(first)) continue;
                            const a = first.getBoundingClientRect();
                            const b = second.getBoundingClientRect();
                            const overlapWidth = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
                            const overlapHeight = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
                            if (overlapWidth * overlapHeight > 1) return false;
                        }
                    }
                    return true;
                })), `${await label.innerText()}: diagram objects do not overlap`);
                assert(await panel.locator("lifetime-example").evaluateAll(diagrams => diagrams.every(diagram => {
                    let scrollRegions = 0;
                    for (let parent = diagram.parentElement; parent; parent = parent.parentElement) {
                        if (parent.classList.contains("scroll-region")) scrollRegions++;
                    }
                    return scrollRegions === 1;
                })), `${await label.innerText()}: each diagram has exactly one scroll region`);
            }

            await page.setViewportSize({ width: 320, height: 900 });
            await page.reload();
            await page.locator("label[for=tab-lt-10]").click();
            assert(await panelIsInViewport(page.locator("#tab-lt-10 ~ panel")), "lifetime diagram panel stays in the 320px viewport");
            assert(await panelIsInViewport(page.locator("#tab-lt-10 ~ panel .lifetime-toggle").first()), "lifetime explanation control stays in the 320px viewport");

            await page.setViewportSize({ width: 390, height: 900 });
            await page.reload();
            await page.locator("label[for=tab-lt-10]").click();
            assert(await panelIsInViewport(page.locator("#tab-lt-10 ~ panel")), "selected lifetime diagram panel stays in the mobile viewport");
            assert.equal(await page.locator("#tab-lt-10 ~ panel memory-backdrop.past").first().evaluate(element => getComputedStyle(element).opacity), "0.25", "past lifetime rows retain their visual state");

            const explanationButton = page.locator("#tab-lt-10 ~ panel .lifetime-toggle").first();
            const explanationId = await explanationButton.getAttribute("aria-controls");
            const explanation = page.locator(`#${explanationId}`);
            assert.equal(await explanation.evaluate(element => getComputedStyle(element).display), "none", "lifetime explanations start collapsed");
            await explanationButton.click();
            assert.equal(await explanationButton.getAttribute("aria-expanded"), "true");
            assert.equal((await explanationButton.locator(".lifetime-toggle__action").innerText()).trim(), "Hide explanation");
            assert.notEqual(await explanation.evaluate(element => getComputedStyle(element).display), "none");
            await explanationButton.press("Space");
            assert.equal(await explanationButton.getAttribute("aria-expanded"), "false", "Space collapses a lifetime explanation");
            await explanationButton.press("Enter");
            assert.equal(await explanationButton.getAttribute("aria-expanded"), "true", "Enter expands a lifetime explanation");

            await page.goto(base + "/standard-library/atomics-cache/");
            assert.equal(await page.locator(".lifetime-toggle").count(), 0, "non-interactive cache diagrams do not receive explanation buttons");
            assert.equal(await page.locator(".lifetime-diagram-key").count(), 1, "standalone memory diagrams include a diagram key");
            assert.equal(await page.locator(".atomics-figure-card").count(), 3, "atomic memory sequences are divided into three readable cards");
            assert.deepEqual(await page.locator(".atomics-figure-card > h2").allInnerTexts(), ["Cache coherence", "Reordering and false sharing", "Atomic synchronization"]);
            assert(await page.locator(".atomics-diagram-board").evaluateAll(boards => boards.every(board => {
                const style = getComputedStyle(board);
                return parseFloat(style.paddingLeft) >= 12 && board.scrollHeight <= board.clientHeight + 1;
            })), "atomic diagram boards provide breathing room without vertical scrolling");
            assert(await page.locator(".atomics-diagram-canvas").evaluateAll(canvases => canvases.every(canvas => {
                const sections = [...canvas.children].filter(child => child.tagName === "LIFETIME-SECTION").map(section => section.getBoundingClientRect());
                return sections.slice(1).every((section, index) => section.top - sections[index].bottom >= 16);
            })), "adjacent cache diagrams have visible separation");
            assert(await page.locator(".atomics-diagram-canvas lifetime-example").evaluateAll(examples => examples.every(example => {
                const rows = [...example.querySelectorAll(":scope > memory-row")].map(row => row.getBoundingClientRect());
                return rows.slice(1).every((row, index) => row.top - rows[index].bottom >= 16);
            })), "successive atomic states have consistent vertical rhythm");
            assert(await page.locator("memory-backdrop").evaluateAll(backdrops => backdrops.every(backdrop => getComputedStyle(backdrop).overflowY === "hidden")), "cache memory rows do not scroll vertically");
            assert(await page.locator("lifetime-example").evaluateAll(diagrams => diagrams.every(diagram => {
                const regions = [];
                for (let parent = diagram.parentElement; parent; parent = parent.parentElement) {
                    if (parent.classList.contains("scroll-region")) regions.push(parent);
                }
                return regions.length === 1 && regions[0].classList.contains("diagram-scroll");
            })), "cache diagrams reuse one standardized horizontal scroll region");
            assert(await page.locator("memory-backdrop:has(line-comment)").evaluateAll(backdrops => backdrops.every(backdrop => {
                const backdropBox = backdrop.getBoundingClientRect();
                const commentBox = backdrop.querySelector("line-comment").getBoundingClientRect();
                return commentBox.right <= backdropBox.right + 1;
            })), "cache diagram labels remain inside their memory rows");

            for (const width of [390, 1440]) {
                await page.setViewportSize({ width, height: 900 });
                await page.goto(base + "/working-with-types/foreign-types-and-traits/");
                assert.equal(await page.locator(".foreign-types-card").count(), 1, "foreign types diagram has one explanatory card");
                assert.equal(await page.locator(".foreign-category").count(), 6, "upstream items are divided into six named categories");
                assert.equal(await page.locator(".foreign-rule").count(), 7, "the orphan-rule examples are presented as seven distinct cases");
                assert.deepEqual(await page.locator(".foreign-rule__status").evaluateAll(items => items.map(item => item.textContent)), [
                    "Allowed", "Allowed", "Rejected", "Allowed · local parameter", "Allowed", "Rejected", "Allowed · blanket impl.",
                ]);
                assert.equal(await page.locator(".foreign-types-card > .foreign-types-note").count(), 1, "diagram explanation sits outside the horizontal scroller");
                assert.equal(await page.locator(".foreign-types-board .foreign-types-note").count(), 0, "diagram explanation never requires horizontal scrolling");
                assert(await page.locator(".foreign-types-board").evaluate((board, viewportWidth) => {
                    const hasExpectedHorizontalOverflow = viewportWidth > 750 || board.scrollWidth > board.clientWidth + 1;
                    return hasExpectedHorizontalOverflow && board.scrollHeight <= board.clientHeight + 1;
                }, width), `foreign types diagram scrolls only horizontally when needed at ${width}px`);
                assert(await page.locator(".foreign-types-board zoo").evaluate(zoo => {
                    let scrollRegions = 0;
                    for (let parent = zoo.parentElement; parent; parent = parent.parentElement) {
                        if (parent.classList.contains("scroll-region")) scrollRegions++;
                    }
                    return scrollRegions === 1;
                }), "foreign types diagram has exactly one scroll region");
                assert(await page.locator(".foreign-zone--upstream, .foreign-rules").evaluateAll(containers => containers.every(container => {
                    const children = [...container.children].filter(child => {
                        const style = getComputedStyle(child);
                        const box = child.getBoundingClientRect();
                        return style.display !== "none" && box.width > 0 && box.height > 0 && !child.classList.contains("foreign-zone__title");
                    });
                    for (let left = 0; left < children.length; left++) {
                        for (let right = left + 1; right < children.length; right++) {
                            const a = children[left].getBoundingClientRect();
                            const b = children[right].getBoundingClientRect();
                            const overlapWidth = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
                            const overlapHeight = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
                            if (overlapWidth * overlapHeight > 1) return false;
                        }
                    }
                    return true;
                })), `foreign type categories and rule cards do not overlap at ${width}px`);
            }

            for (const width of [390, 1440]) {
                await page.setViewportSize({ width, height: 900 });
                await page.goto(base + "/standard-library/thread-safety/");
                assert.equal(await page.locator(".thread-safety-card.visual-card").count(), 1, "thread-safety diagram uses the shared visual card");
                assert.equal(await page.locator(".thread-safety-key span").count(), 4, "thread-safety diagram explains all four states");
                assert(await page.locator(".thread-safety-board").evaluate(board => board.scrollHeight <= board.clientHeight + 1), `thread-safety diagram never scrolls vertically at ${width}px`);
                assert(await page.locator(".thread-safety-diagram thread-row").evaluateAll(rows => rows.slice(1).every((row, index) => {
                    const previous = rows[index].getBoundingClientRect();
                    const current = row.getBoundingClientRect();
                    return current.top - previous.bottom >= 9;
                })), `thread-safety rows retain breathing room at ${width}px`);
            }

            await page.goto(base + "/language-constructs/hello-rust/");
            await page.keyboard.press("/");
            assert(await page.locator(".section-menu").evaluate(element => element.open), "search shortcut opens Sections");
            await page.waitForFunction(() => document.activeElement?.matches("[data-search-input]"));
            assert(await page.locator("[data-search-input]").evaluate(element => element === document.activeElement), "search shortcut focuses the field");
            await page.locator("[data-search-input]").fill("struct");
            await page.locator(".search-results li").first().waitFor();
            assert(await page.locator(".search-results li").count() > 0, "search returns matching pages");
            assert((await page.locator(".search-result__snippet").first().innerText()).toLowerCase().includes("struct"), "search includes a matching snippet");
            const summaryBox = await page.locator(".section-trigger").boundingBox();
            const summaryTextBox = await page.locator(".section-trigger").evaluate(element => {
                const range = document.createRange(); range.selectNodeContents(element); const box = range.getBoundingClientRect();
                return { top: box.top, bottom: box.bottom };
            });
            assert(Math.abs((summaryTextBox.top + summaryTextBox.bottom) / 2 - (summaryBox.y + summaryBox.height / 2)) < 2, "Sections text is vertically centered");
            await page.keyboard.press("Escape");
            await page.waitForFunction(() => document.activeElement?.matches(".section-trigger"));
            assert(await page.locator(".section-trigger").evaluate(element => element === document.activeElement));
            await page.locator(".copy-button").first().click();
            await page.locator(".copy-button").first().filter({ hasText: "Copied!" }).waitFor();
            assert(await page.evaluate(() => Boolean(window.__copiedCode)), "copy control writes the code text");
            await page.locator("label[for=tab-hello-1]").click();
            await page.locator("#helloctrl a").click();
            await page.locator("#helloplay iframe").waitFor();
            await page.locator("#helloctrl a").click();
            await page.locator("#helloplay iframe").waitFor({ state: "detached" });
            const themeBefore = await page.locator("html").getAttribute("data-theme");
            await page.locator("#toggle_night_mode").click();
            const themeAfter = await page.locator("html").getAttribute("data-theme");
            assert.notEqual(themeAfter, themeBefore, "theme control changes the effective theme");
            assert.equal(await page.evaluate(() => localStorage.getItem("rsds-theme")), themeAfter, "theme preference uses the design-system key");
            await page.locator("#toggle_ligatures").click();
            await page.reload();
            assert.equal(await page.locator("html").getAttribute("data-theme"), themeAfter);
            assert.equal(await page.locator("#toggle_ligatures").getAttribute("aria-pressed"), "true");

            await page.goto(base + "/memory-layout/basic-types/");
            assert(await page.locator(".local-toc a").count() >= 2);
            assert(await page.locator(".local-toc").evaluate(toc => {
                const tocBackground = getComputedStyle(toc).backgroundColor;
                const pageBackground = getComputedStyle(document.body).backgroundColor;
                return tocBackground !== "transparent" && tocBackground !== "rgba(0, 0, 0, 0)" && tocBackground !== pageBackground;
            }), "local TOC has an opaque background distinct from the page canvas");
            assert(await page.locator(".local-toc a").evaluateAll(links => links.every(link => link.getAttribute("href").startsWith("#"))), "local TOC uses local fragments");
            assert.equal(await page.locator('.local-toc a[aria-current="location"]').count(), 1, "local TOC marks the current section");
            assert(await page.locator(".reference-table th").evaluateAll(headers => headers.every(header => header.getAttribute("scope") === "col")), "table headers retain column semantics");
            assert(await page.locator(".reference-table td").evaluateAll(cells => cells.every(cell => cell.hasAttribute("headers"))), "table cells reference their headers");
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

            const darkContext = await browser.newContext({ viewport: { width: 390, height: 900 }, colorScheme: "dark" });
            await darkContext.addInitScript(() => localStorage.setItem("rsds-theme", "dark"));
            const darkPage = await darkContext.newPage();
            const darkSurfaceSelector = [
                ".visual-card",
                ".visual-canvas",
                ".rs-diagram",
                ".rs-diagram *",
                ".reference-table-frame",
                ".local-toc",
                ".color-header th",
                ".stringconversion th",
                "table.sendsync th",
                "table.sendsync td:first-child",
            ].join(",");
            for (const route of routes) {
                await darkPage.goto(base + route, { waitUntil: "domcontentloaded" });
                assert.equal(await darkPage.locator("html").getAttribute("data-theme"), "dark", `${route}: dark preference is applied`);
                const lightIslands = await darkPage.locator(darkSurfaceSelector).evaluateAll(elements => {
                    const relativeLuminance = color => {
                        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
                        if (!match || match[4] === "0") return 0;
                        const channels = [match[1], match[2], match[3]].map(value => {
                            const channel = Number(value) / 255;
                            return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
                        });
                        return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
                    };
                    return elements.flatMap(element => {
                        const background = getComputedStyle(element).backgroundColor;
                        if (relativeLuminance(background) <= .35) return [];
                        return [`${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).trim().replace(/\s+/g, ".")}` : ""}: ${background}`];
                    });
                });
                assert.deepEqual(lightIslands, [], `${route}: dark components contain no light-theme surfaces`);
            }
            await darkContext.close();

            const noScriptContext = await browser.newContext({ javaScriptEnabled: false });
            const noScriptPage = await noScriptContext.newPage();
            await noScriptPage.goto(base + "/language-constructs/hello-rust/");
            assert.equal(await noScriptPage.locator(".section-trigger").getAttribute("href"), "/", "Sections falls back to the home index without JavaScript");
            assert.equal(await noScriptPage.locator(".site-search").evaluate(element => getComputedStyle(element).display), "none", "search enhancement stays hidden without JavaScript");
            assert(await noScriptPage.locator("main").isVisible(), "content remains available without JavaScript");
            await noScriptPage.goto(base + "/behind-the-scenes/memory-lifetimes/");
            assert.equal(await noScriptPage.locator(".lifetime-toggle").count(), 0, "lifetime controls are only added when interactive behavior is available");
            assert(await noScriptPage.locator("lifetime-section > explanation").evaluateAll(explanations => explanations.every(explanation => getComputedStyle(explanation).display !== "none")), "lifetime explanations remain visible without JavaScript");
            await noScriptPage.goto(base + "/working-with-types/types-traits-generics/");
            assert.equal(await noScriptPage.locator(".disclosure-toggle").count(), 0, "generics controls are only added when interactive behavior is available");
            assert(await noScriptPage.locator("generics-section > description").evaluateAll(descriptions => descriptions.every(description => getComputedStyle(description).display !== "none")), "generics descriptions remain visible without JavaScript");
            await noScriptContext.close();
            await context.close();
            console.log(`${engine.name()}: ${routes.length} routes and interactions passed`);
        } finally {
            await browser.close();
        }
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
