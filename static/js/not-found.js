(() => {
    const requested = location.pathname.split('/')[1];
    const sections = [...document.querySelectorAll('[data-not-found]')];
    const active = sections.find(section => section.lang === requested) || sections.find(section => section.lang === 'en');
    if (!active) return;
    document.documentElement.lang = active.lang;
    document.documentElement.dir = active.dir;
    for (const section of sections) section.hidden = section !== active;
})();
