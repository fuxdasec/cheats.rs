(() => {
    const root = document.documentElement;
    const messages = JSON.parse(document.getElementById('i18n-messages')?.textContent || '{}');
    const t = (key, parameters = {}) => (messages[key] || key).replace(/\{([A-Za-z]\w*)\}/g, (match, name) => Object.hasOwn(parameters, name) ? String(parameters[name]) : match);
    document.addEventListener('DOMContentLoaded', () => {
        for (const time of document.querySelectorAll('[data-local-date]')) time.textContent = new Intl.DateTimeFormat(root.lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(time.dateTime));
    });
    window.rsI18n = { t, lang: root.lang || 'en', route: root.dataset.sourceRoute || location.pathname, home: root.dataset.home || '/' };
})();
