(() => {
    const root = document.documentElement;
    const themeButton = document.getElementById("toggle_night_mode");
    const ligatureButton = document.getElementById("toggle_ligatures");
    const systemDark = () => !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const storedTheme = () => {
        try { return localStorage.getItem("rsds-theme"); } catch (_) { return null; }
    };
    const effectiveTheme = () => storedTheme() || (systemDark() ? "dark" : "light");

    const syncTheme = theme => {
        const dark = theme === "dark";
        root.dataset.theme = theme;
        document.body.classList.toggle("night-mode", dark);
        document.body.classList.toggle("day-mode", !dark);
        themeButton?.setAttribute("aria-pressed", String(dark));
    };

    syncTheme(effectiveTheme());
    themeButton?.addEventListener("click", () => {
        const theme = effectiveTheme() === "dark" ? "light" : "dark";
        try {
            localStorage.setItem("rsds-theme", theme);
            localStorage.setItem("night-mode", theme === "dark" ? "night" : "day");
        } catch (_) {}
        syncTheme(theme);
    });

    const ligaturesEnabled = () => {
        try { return localStorage.getItem("ligatures") === "ligatures"; } catch (_) { return false; }
    };
    const syncLigatures = enabled => {
        root.dataset.ligatures = enabled ? "on" : "off";
        ligatureButton?.setAttribute("aria-pressed", String(enabled));
    };
    syncLigatures(ligaturesEnabled());
    ligatureButton?.addEventListener("click", () => {
        const enabled = !ligaturesEnabled();
        try { localStorage.setItem("ligatures", enabled ? "ligatures" : "no-ligatures"); } catch (_) {}
        syncLigatures(enabled);
    });
})();
