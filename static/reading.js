// Progressive enhancements: the section menu itself works without JavaScript.
(() => {
    if (location.pathname === '/' && location.hash && location.hash !== '#_print') {
        fetch('/legacy-anchors.json')
            .then(response => response.ok ? response.json() : {})
            .then(routes => {
                const destination = routes[decodeURIComponent(location.hash.slice(1))];
                if (destination) location.replace(destination);
            })
            .catch(() => {});
    }

    const menu = document.querySelector('.section-menu');
    const summary = menu?.querySelector('summary');
    menu?.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
        menu.open = false;
        if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu?.open) {
            menu.open = false;
            summary.focus();
        }
    });
    document.addEventListener('click', event => {
        if (menu?.open && !menu.contains(event.target)) menu.open = false;
    });

    const toolbar = document.querySelector('.reading-toolbar');
    if (toolbar) {
        new ResizeObserver(() => {
            document.documentElement.style.setProperty('--reading-offset', `${toolbar.offsetHeight + 16}px`);
        }).observe(toolbar);
    }

    const regions = [];
    const register = (region, kind) => {
        region.classList.add('scroll-region', `${kind}-scroll`);
        const hint = document.createElement('div');
        hint.className = 'scroll-hint';
        hint.id = `scroll-hint-${regions.length}`;
        hint.textContent = `Scroll horizontally to see the full ${kind}.`;
        region.before(hint);
        regions.push({ region, hint, kind });
    };
    const wrap = (element, kind) => {
        const region = document.createElement('div');
        if (element.matches('datum')) region.classList.add('datum-scroll');
        element.before(region);
        region.append(element);
        register(region, kind);
    };
    // Several hand-positioned illustrations already have a scroll container.
    // Reuse it instead of introducing nested scrolling or changing its geometry.
    document.querySelectorAll('.book-content div[style]').forEach(region => {
        if (region.style.overflow === 'auto') register(region, 'content');
    });
    document.querySelectorAll('.book-content table').forEach(table => {
        if (!table.closest('.scroll-region, datum, zoo, mini-zoo, lifetime-example, threading-section')) wrap(table, 'table');
    });
    document.querySelectorAll('lifetime-example, threading-section, zoo, mini-zoo, datum').forEach(diagram => {
        if (!diagram.parentElement.closest('lifetime-example, threading-section, zoo, mini-zoo, datum, .scroll-region')) {
            wrap(diagram, 'diagram');
        }
    });
    const refresh = () => {
        regions.forEach(({ region, hint, kind }) => {
            const overflow = region.clientWidth > 0 && region.scrollWidth > region.clientWidth + 1;
            hint.classList.toggle('is-visible', overflow);
            if (overflow) {
                region.setAttribute('tabindex', '0');
                region.setAttribute('role', 'region');
                region.setAttribute('aria-label', `Scrollable ${kind}`);
                region.setAttribute('aria-describedby', hint.id);
            } else {
                ['tabindex', 'role', 'aria-label', 'aria-describedby'].forEach(name => region.removeAttribute(name));
            }
        });
    };
    const observer = new ResizeObserver(refresh);
    regions.forEach(({ region }) => observer.observe(region));
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    refresh();
})();
