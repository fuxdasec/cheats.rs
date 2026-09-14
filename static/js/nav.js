(() => {
    const menu = document.querySelector(".section-menu");
    const trigger = document.querySelector(".section-trigger");
    const panel = menu?.querySelector(".section-panel");
    if (!(menu instanceof HTMLDialogElement) || !trigger || !panel) return;

    const close = (restoreFocus = true) => {
        if (!menu.open) return;
        menu.close();
        document.body.classList.remove("sections-open");
        if (restoreFocus) requestAnimationFrame(() => trigger.focus());
    };
    const open = (focusSearch = false) => {
        if (!menu.open) menu.showModal();
        document.body.classList.add("sections-open");
        menu.dispatchEvent(new CustomEvent("sections:open"));
        requestAnimationFrame(() => (focusSearch ? panel.querySelector("[data-search-input]") : panel.querySelector("[data-close-sections]"))?.focus());
    };

    window.rustdsSections = { open, close };
    trigger.addEventListener("click", event => {
        event.preventDefault();
        open();
    });
    panel.querySelector("[data-close-sections]")?.addEventListener("click", () => close());
    panel.addEventListener("click", event => {
        if (event.target.closest("a[href]")) close(false);
    });
    menu.addEventListener("click", event => {
        if (event.target === menu) close();
    });
    menu.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        close();
    }, true);
    menu.addEventListener("cancel", event => {
        event.preventDefault();
        close();
    });
    menu.addEventListener("close", () => document.body.classList.remove("sections-open"));

    const toc = document.querySelector("[data-responsive-toc]");
    if (toc) {
        const tablet = matchMedia("(min-width: 641px) and (max-width: 1024px)");
        const syncToc = () => { toc.open = !tablet.matches; };
        tablet.addEventListener?.("change", syncToc);
        syncToc();
    }
})();
