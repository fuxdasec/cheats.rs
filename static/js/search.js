(() => {
    const search = document.querySelector("[data-search]");
    const menu = document.querySelector(".section-menu");
    if (!search || !menu) return;
    const input = search.querySelector("[data-search-input]");
    const results = search.querySelector("[data-search-results]");
    const status = search.querySelector("[data-search-status]");
    const panel = search.closest(".section-panel");
    let indexPromise;

    const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const text = html => {
        const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
        return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
    };
    const localHref = raw => {
        try {
            const url = new URL(raw, location.origin);
            return `${url.pathname}${url.search}${url.hash}`;
        } catch (_) { return "/"; }
    };
    const groupName = href => {
        const category = menu.querySelector(`[data-category-path="${CSS.escape(href)}"]`);
        return category?.textContent || '';
    };
    const loadIndex = () => {
        if (!indexPromise) {
            status.textContent = window.rsI18n.t("Loading search…");
            indexPromise = fetch(search.dataset.indexUrl)
                .then(response => {
                    if (!response.ok) throw new Error(`Search index returned ${response.status}`);
                    return response.json();
                })
                .then(data => Array.isArray(data) ? data : (data.items || data.docs || []))
                .catch(error => { indexPromise = undefined; throw error; });
        }
        return indexPromise;
    };
    const snippet = (body, token) => {
        const clean = text(body);
        const normalized = normalize(clean);
        const at = normalized.indexOf(token);
        const start = Math.max(0, at < 0 ? 0 : at - 62);
        const end = Math.min(clean.length, start + 150);
        return `${start ? "…" : ""}${clean.slice(start, end).trim()}${end < clean.length ? "…" : ""}`;
    };
    const render = (items, query) => {
        results.replaceChildren();
        const tokens = normalize(query).split(/\s+/).filter(Boolean);
        if (tokens.join("").length < 2) {
            status.textContent = window.rsI18n.t("Type at least two characters.");
            panel.classList.remove("is-searching");
            return;
        }
        const ranked = items.map(item => {
            const href = localHref(item.permalink || item.url || item.path);
            if (href.includes("/_print/")) return null;
            const title = item.title || window.rsI18n.t("Untitled");
            const description = item.description || "";
            const body = item.body || item.content || "";
            const fields = [normalize(title), normalize(description), normalize(text(body))];
            if (!tokens.every(token => fields.some(field => field.includes(token)))) return null;
            const score = tokens.reduce((sum, token) => sum + (fields[0].includes(token) ? 10 : 0) + (fields[1].includes(token) ? 4 : 0) + (fields[2].includes(token) ? 1 : 0), 0);
            return { item, href, title, body, score };
        }).filter(Boolean).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, window.rsI18n.lang)).slice(0, 8);

        panel.classList.add("is-searching");
        status.textContent = ranked.length ? window.rsI18n.t(ranked.length === 1 ? "{count} result." : "{count} results.", { count: ranked.length }) : window.rsI18n.t("No results found.");
        for (const hit of ranked) {
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.href = hit.href;
            const top = document.createElement("span");
            top.className = "search-result__top";
            const title = document.createElement("span");
            title.className = "search-result__title";
            title.textContent = hit.title;
            const group = document.createElement("span");
            group.className = "search-result__group";
            group.textContent = hit.item.category || groupName(hit.href);
            const excerpt = document.createElement("span");
            excerpt.className = "search-result__snippet";
            excerpt.textContent = snippet(hit.body || hit.item.description, tokens[0]);
            top.append(title, group);
            link.append(top, excerpt);
            li.append(link);
            results.append(li);
        }
    };

    let timer;
    input.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => loadIndex().then(items => render(items, input.value)).catch(() => {
            status.textContent = window.rsI18n.t("Search is temporarily unavailable.");
            results.replaceChildren();
        }), 80);
    });
    menu.addEventListener("sections:open", () => loadIndex().then(() => { if (!input.value) status.textContent = window.rsI18n.t("Search titles and page content."); }).catch(() => { status.textContent = window.rsI18n.t("Search is temporarily unavailable. Try again."); }));
    document.addEventListener("keydown", event => {
        const target = event.target;
        const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
        const shortcut = (event.key === "/" && !editing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k");
        if (!shortcut) return;
        event.preventDefault();
        window.rustdsSections?.open(true);
    });
})();
