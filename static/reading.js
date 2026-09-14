// Progressive enhancements for legacy links, wide content and local navigation.
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
    const diagramSelector = 'lifetime-example, threading-section, zoo, mini-zoo, datum';

    // Normalize the custom tab markup into one accessible interaction model.
    document.querySelectorAll('.book-content tabs').forEach((tabs, tabsIndex) => {
        const records = [...tabs.querySelectorAll(':scope > tab')].map((tab, tabIndex) => ({
            tab,
            input: tab.querySelector(':scope > input[type="radio"]'),
            label: tab.querySelector(':scope > label'),
            panel: tab.querySelector(':scope > panel'),
            tabIndex,
        })).filter(record => record.input && record.label && record.panel);
        const tabButtons = document.createElement('div');
        tabButtons.className = 'rs-tab-buttons';
        tabButtons.setAttribute('role', 'tablist');
        tabs.classList.add('rs-tabs');
        tabs.prepend(tabButtons);

        const updateAll = () => records.forEach(({ input, label, panel }) => {
            label.setAttribute('aria-selected', String(input.checked));
            label.tabIndex = input.checked ? 0 : -1;
            panel.hidden = !input.checked;
        });

        records.forEach(({ input, label, panel, tabIndex }) => {
            const labelId = label.id || `rs-tab-${tabsIndex + 1}-${tabIndex + 1}`;
            const panelId = panel.id || `rs-tabpanel-${tabsIndex + 1}-${tabIndex + 1}`;
            label.id = labelId;
            input.tabIndex = -1;
            input.setAttribute('aria-hidden', 'true');
            panel.id = panelId;
            panel.dataset.tabTitle = label.textContent.trim();
            label.setAttribute('role', 'tab');
            label.setAttribute('aria-controls', panelId);
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', labelId);
            tabButtons.append(label);
            input.addEventListener('change', updateAll);
            label.addEventListener('keydown', event => {
                const current = records.findIndex(record => record.label === label);
                let destination = -1;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') destination = (current + 1) % records.length;
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') destination = (current - 1 + records.length) % records.length;
                if (event.key === 'Home') destination = 0;
                if (event.key === 'End') destination = records.length - 1;
                if (destination < 0) return;
                event.preventDefault();
                const { input: nextInput, label: nextLabel } = records[destination];
                nextInput.checked = true;
                nextInput.dispatchEvent(new Event('change', { bubbles: true }));
                nextLabel.focus();
            });
        });
        updateAll();
    });

    // The old generics overview used clickable custom <header> elements. Turn
    // them into real disclosures while keeping every explanation available
    // when JavaScript is disabled and in printable output.
    let genericsDisclosureNumber = 0;
    document.querySelectorAll('generics-section').forEach(section => {
        const header = section.querySelector(':scope > header');
        const description = section.querySelector(':scope > description');
        if (!header || !description) return;
        genericsDisclosureNumber++;
        const button = document.createElement('button');
        const title = document.createElement('span');
        const action = document.createElement('span');
        const icon = document.createElement('span');
        const sectionsInTab = [...(section.closest('tab') || section.parentElement).querySelectorAll('generics-section')];
        const firstInTab = sectionsInTab[0] === section;
        const expanded = firstInTab;
        const descriptionId = description.id || `generics-description-${genericsDisclosureNumber}`;
        const buttonId = `generics-toggle-${genericsDisclosureNumber}`;

        section.classList.remove('rs-diagram');
        section.classList.add('disclosure-card', 'has-disclosure-toggle');
        header.classList.add('disclosure-card__header');
        description.classList.add('disclosure-card__content');
        description.id = descriptionId;
        description.setAttribute('role', 'region');
        description.setAttribute('aria-labelledby', buttonId);
        description.hidden = !expanded;

        button.type = 'button';
        button.id = buttonId;
        button.className = 'disclosure-toggle';
        button.setAttribute('aria-controls', descriptionId);
        button.setAttribute('aria-expanded', String(expanded));
        title.className = 'disclosure-toggle__title';
        title.innerHTML = header.innerHTML;
        action.className = 'disclosure-toggle__action';
        action.textContent = expanded ? 'Hide details' : 'Show details';
        icon.className = 'disclosure-toggle__icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = '▾';
        button.append(title, action, icon);
        header.replaceChildren(button);

        const setExpanded = value => {
            description.hidden = !value;
            button.classList.toggle('is-expanded', value);
            button.setAttribute('aria-expanded', String(value));
            action.textContent = value ? 'Hide details' : 'Show details';
        };
        setExpanded(expanded);
        button.addEventListener('click', () => setExpanded(button.getAttribute('aria-expanded') !== 'true'));
    });

    // Adjacent mini-zoos are one comparison, not a series of unrelated
    // scrollers. Grid comparisons wrap; arrow / "vs." sequences retain their
    // reading order in one horizontally scrollable flow.
    const miniZooContainers = new Set([...document.querySelectorAll('mini-zoo')].map(zoo => zoo.parentElement));
    miniZooContainers.forEach(container => {
        let child = container.firstElementChild;
        while (child) {
            if (child.tagName !== 'MINI-ZOO') {
                child = child.nextElementSibling;
                continue;
            }
            const run = [];
            let cursor = child;
            while (cursor?.tagName === 'MINI-ZOO') {
                run.push(cursor);
                cursor = cursor.nextElementSibling;
            }
            const gallery = document.createElement('div');
            const hasConnector = run.some(zoo => /^(?:→|vs\.)$/i.test(zoo.textContent.trim()));
            gallery.className = `mini-zoo-gallery visual-${hasConnector ? 'flow' : 'grid'}`;
            child.before(gallery);
            run.forEach(zoo => {
                const text = zoo.textContent.trim().replace(/\s+/g, ' ');
                const connector = /^(?:→|vs\.)$/i.test(text);
                zoo.classList.add(connector ? 'mini-zoo-connector' : 'mini-zoo-card');
                zoo.style.removeProperty('margin-left');
                zoo.style.removeProperty('margin-right');
                if (!connector) {
                    zoo.setAttribute('role', 'group');
                    zoo.setAttribute('aria-label', `Type and trait diagram: ${text || 'relationship'}`);
                }
                gallery.append(zoo);
            });
            if (hasConnector) register(gallery, 'diagram');
            child = cursor;
        }
    });

    document.querySelectorAll('mini-table').forEach(table => {
        table.classList.add('mini-table-card');
        if (table.querySelector(':scope > mini-table')) table.classList.add('mini-table-group', 'visual-grid');
    });

    let datumCardNumber = 0;
    const enhanceDatumCard = (datum, variant = 'diagram', extraClass = '') => {
        datum.classList.add('datum-card', `datum-card--${variant}`, 'visual-card__item');
        if (extraClass) datum.classList.add(extraClass);

        const directChildren = [...datum.children];
        const title = directChildren.find(child => child.tagName === 'NAME' && !child.classList.contains('hidden'));
        const captions = [...datum.querySelectorAll('description')]
            .filter(description => description.closest('datum') === datum);
        const zooms = directChildren.filter(child => child.tagName === 'ZOOM');
        const figure = document.createElement('div');
        figure.className = 'datum-card__figure';

        directChildren.forEach(child => {
            if (child !== title && !captions.includes(child) && !zooms.includes(child)) figure.append(child);
        });
        if (title) {
            title.id ||= `datum-title-${++datumCardNumber}`;
            title.setAttribute('role', 'heading');
            title.setAttribute('aria-level', '3');
            datum.setAttribute('role', 'group');
            datum.setAttribute('aria-labelledby', title.id);
            title.after(figure);
        } else {
            datum.prepend(figure);
            datum.setAttribute('role', 'img');
            datum.setAttribute('aria-label', 'Memory layout diagram');
        }
        zooms.forEach(zoom => datum.append(zoom));
        captions.forEach(description => {
            description.querySelectorAll('br').forEach(lineBreak => lineBreak.replaceWith(' '));
            datum.append(description);
        });
    };

    const datumPages = {
        '/memory-layout/custom-types/': {
            expected: 9,
            groups: [
                { label: 'Type shapes', title: 'Type shapes', level: 2, tone: 'type', cards: [[0, 'compact'], [1, 'compact'], [2, 'compact'], [3, 'compact'], [4, 'compact']] },
                { label: 'Composite layouts', title: 'Composite layouts', level: 2, tone: 'layout', cards: [[5, 'diagram'], [6, 'diagram']] },
                { label: 'Sum types', title: 'Sum types', level: 2, tone: 'sum', cards: [[7, 'diagram'], [8, 'diagram']] },
            ],
        },
        '/memory-layout/references-pointers/': {
            expected: 7,
            groups: [
                { label: 'Reference kinds', title: 'Reference kinds', level: 2, tone: 'pointer', cards: [[0, 'diagram'], [1, 'diagram']] },
                { label: 'Pointer metadata', tone: 'pointer', cards: [[2, 'diagram'], [3, 'diagram'], [4, 'diagram'], [5, 'diagram'], [6, 'wide', 'datum-card--vtable']] },
            ],
        },
        '/memory-layout/closures/': {
            expected: 2,
            groups: [
                { label: 'Capture layouts', title: 'Capture layouts', level: 2, tone: 'closure', cards: [[0, 'diagram'], [1, 'diagram']] },
            ],
        },
        '/memory-layout/standard-library-types/': {
            expected: 26,
            groups: [
                { label: 'Core wrappers and markers', title: 'Core wrappers and markers', level: 2, tone: 'std', cards: [[0, 'compact'], [1, 'compact'], [2, 'compact'], [3, 'compact'], [4, 'compact'], [5, 'compact'], [6, 'diagram']] },
                { label: 'Cells', tone: 'cell', cards: [[7, 'compact'], [8, 'compact'], [9, 'compact'], [10, 'compact'], [11, 'compact']] },
                { label: 'Order-preserving collections', tone: 'collection', cards: [[12, 'diagram'], [13, 'diagram'], [14, 'wide'], [15, 'wide']] },
                { label: 'Other collections', tone: 'collection', cards: [[16, 'wide'], [17, 'wide']] },
                { label: 'Owned strings', tone: 'string', cards: [[18, 'diagram'], [19, 'diagram'], [20, 'diagram'], [21, 'diagram']] },
                { label: 'Shared ownership', tone: 'ownership', cards: [[22, 'wide'], [23, 'wide'], [24, 'diagram'], [25, 'diagram']] },
            ],
        },
    };

    const enhanceDatumPage = configuration => {
        const topic = document.querySelector('.topic-body');
        const datums = [...topic?.querySelectorAll('datum') || []];
        if (!topic || datums.length !== configuration.expected) {
            console.warn(`Datum layout skipped: expected ${configuration.expected}, found ${datums.length}.`);
            return;
        }

        document.documentElement.classList.add('page-datum-gallery');
        configuration.groups.forEach((definition, groupIndex) => {
            const cards = definition.cards.map(([index]) => datums[index]);
            const group = document.createElement('section');
            group.className = 'datum-group visual-card';
            group.dataset.tone = definition.tone;

            if (definition.title) {
                const heading = document.createElement(`h${definition.level || 2}`);
                heading.id = `datum-group-${groupIndex + 1}`;
                heading.textContent = definition.title;
                group.setAttribute('aria-labelledby', heading.id);
                group.append(heading);
            } else {
                group.setAttribute('aria-label', definition.label);
            }

            const gallery = document.createElement('div');
            gallery.className = 'datum-gallery visual-grid';
            group.append(gallery);
            cards[0].before(group);
            definition.cards.forEach(([index, variant, extraClass]) => {
                enhanceDatumCard(datums[index], variant, extraClass);
                gallery.append(datums[index]);
            });
        });

        topic.querySelectorAll(':scope > spacer').forEach(spacer => spacer.remove());
        topic.querySelectorAll(':scope > br').forEach(lineBreak => lineBreak.remove());
    };

    // Basic Types benefits from comparing the small memory layouts side by
    // side. Treating every datum as its own full-width scroll region obscures
    // that comparison and also creates a redundant scroller around the tabs.
    if (location.pathname === '/memory-layout/basic-types/') {
        document.documentElement.classList.add('page-basic-types');
        const numericTabs = document.querySelector('#tab-numeric-1')?.closest('tabs');
        const numericShell = numericTabs?.parentElement?.parentElement;
        if (numericShell) {
            numericShell.classList.add('basic-numeric-shell');
            numericTabs.parentElement.classList.add('basic-numeric-shell__inner');
        }

        const makeCards = datums => {
            const cards = document.createElement('div');
            cards.className = 'basic-type-cards visual-grid';
            datums.forEach(datum => {
                datum.classList.add('basic-type-card');
                const visual = datum.querySelector(':scope > visual');
                const name = datum.querySelector(':scope > name');
                const byteCount = visual?.querySelectorAll(':scope > byte').length || 0;
                if (visual?.classList.contains('bool')) datum.dataset.family = 'boolean';
                else if (visual?.classList.contains('float')) datum.dataset.family = 'float';
                else if (visual?.classList.contains('sized')) datum.dataset.family = 'pointer';
                else datum.dataset.family = 'integer';
                if (name && !name.querySelector('.basic-type-size')) {
                    const size = document.createElement('span');
                    size.className = 'basic-type-size';
                    size.textContent = datum.dataset.family === 'pointer'
                        ? 'pointer-sized'
                        : visual?.querySelector('note')
                            ? 'variable length'
                            : `${byteCount} byte${byteCount === 1 ? '' : 's'}`;
                    name.append(size);
                }
                cards.append(datum);
            });
            return cards;
        };
        const makeGroup = (id, title, datums) => {
            const group = document.createElement('section');
            group.className = 'basic-type-group visual-card';
            group.setAttribute('aria-labelledby', id);
            const heading = document.createElement('h3');
            heading.id = id;
            heading.textContent = title;
            group.append(heading, makeCards(datums));
            return group;
        };

        const numericHeading = document.querySelector('#boolean-and-numeric-types');
        const numericDatums = [...document.querySelectorAll('datum.spaced')]
            .filter(datum => numericHeading?.compareDocumentPosition(datum) & Node.DOCUMENT_POSITION_FOLLOWING)
            .filter(datum => numericTabs?.compareDocumentPosition(datum) & Node.DOCUMENT_POSITION_PRECEDING);
        if (numericDatums.length) {
            const gallery = document.createElement('div');
            gallery.className = 'basic-type-gallery basic-type-gallery--numeric';
            numericDatums[0].before(gallery);
            gallery.append(
                makeGroup('fixed-width-types', 'Boolean and fixed-width integers', numericDatums.filter(datum => datum.querySelector('visual.bool, visual.bytes'))),
                makeGroup('pointer-sized-types', 'Pointer-sized integers', numericDatums.filter(datum => datum.querySelector('visual.sized'))),
                makeGroup('floating-point-types', 'Floating-point types', numericDatums.filter(datum => datum.querySelector('visual.float'))),
            );
        }

        const textualHeading = document.querySelector('#textual-types');
        const textualTabs = document.querySelector('#tab-textual-3')?.closest('tabs');
        const textualDatums = [...document.querySelectorAll('datum.spaced')]
            .filter(datum => textualHeading?.compareDocumentPosition(datum) & Node.DOCUMENT_POSITION_FOLLOWING)
            .filter(datum => textualTabs?.compareDocumentPosition(datum) & Node.DOCUMENT_POSITION_PRECEDING);
        if (textualDatums.length) {
            const gallery = document.createElement('div');
            gallery.className = 'basic-type-gallery basic-type-gallery--textual';
            textualDatums[0].before(gallery);
            gallery.append(makeCards(textualDatums));
        }

        const floatInternals = document.querySelector('#tab-numeric-2 ~ panel datum');
        if (floatInternals) enhanceDatumCard(floatInternals, 'detail');
    }

    if (datumPages[location.pathname]) enhanceDatumPage(datumPages[location.pathname]);

    if (location.pathname === '/standard-library/atomics-cache/') {
        document.documentElement.classList.add('page-atomics-cache');
        const titles = [
            ['Cache coherence', 'Main memory and per-CPU cache state'],
            ['Reordering and false sharing', 'How independent reads and writes can become observable'],
            ['Atomic synchronization', 'How atomic operations coordinate memory visibility'],
        ];
        const boards = [...document.querySelectorAll('.topic-body > div[style]')]
            .filter(board => board.style.overflow === 'auto' && board.querySelector('lifetime-example'));
        boards.forEach((board, index) => {
            const [title, summary] = titles[index] || [`Memory sequence ${index + 1}`, 'Memory and cache state'];
            const card = document.createElement('section');
            const heading = document.createElement('h2');
            const description = document.createElement('p');
            heading.id = `atomics-diagram-${index + 1}`;
            heading.textContent = title;
            description.textContent = summary;
            card.className = 'atomics-figure-card visual-card';
            card.setAttribute('aria-labelledby', heading.id);
            description.className = 'atomics-figure-card__summary';
            board.classList.add('atomics-diagram-board', 'visual-canvas');
            board.firstElementChild?.classList.add('atomics-diagram-canvas');
            board.before(card);
            card.append(heading, description, board);
        });
    }

    if (location.pathname === '/working-with-types/foreign-types-and-traits/') {
        const zoo = document.querySelector('.topic-body > div[style*="overflow"] zoo.zoo');
        const board = zoo?.closest('div[style*="overflow"]');
        const canvas = zoo?.parentElement;
        const footnote = canvas?.querySelector(':scope > footnotes');
        const regions = [...zoo?.querySelectorAll(':scope > region') || []];
        const regionLabels = [...zoo?.querySelectorAll(':scope > region-label') || []];

        if (zoo && board && canvas && regions.length === 2 && regionLabels.length === 2) {
            document.documentElement.classList.add('page-foreign-types');
            const card = document.createElement('section');
            const heading = document.createElement('h2');
            const summary = document.createElement('p');
            const legend = document.createElement('div');
            card.className = 'foreign-types-card visual-card';
            card.setAttribute('aria-labelledby', 'foreign-types-map-title');
            heading.id = 'foreign-types-map-title';
            heading.textContent = 'Type and trait ownership map';
            summary.className = 'foreign-types-card__summary';
            summary.textContent = 'See what is defined upstream, what belongs to your crate, and which implementations the orphan rules allow.';
            legend.className = 'foreign-types-key visual-key';
            legend.setAttribute('role', 'note');
            legend.setAttribute('aria-label', 'Diagram key');
            legend.innerHTML = `
                <strong>Diagram key</strong>
                <span><i class="foreign-key__sample foreign-key__sample--local" aria-hidden="true"></i>Local</span>
                <span><i class="foreign-key__sample foreign-key__sample--foreign" aria-hidden="true"></i>Foreign</span>
                <span><i class="foreign-key__sample foreign-key__sample--allowed" aria-hidden="true"></i>Allowed</span>
                <span><i class="foreign-key__sample foreign-key__sample--rejected" aria-hidden="true"></i>Rejected</span>
                <span><i class="foreign-key__sample foreign-key__sample--generic" aria-hidden="true"></i>Generic family</span>`;

            board.before(card);
            card.append(heading, summary, legend, board);
            board.classList.add('foreign-types-board', 'visual-canvas');
            canvas.classList.add('foreign-types-canvas');

            regions.forEach((region, index) => {
                const label = regionLabels[index];
                region.classList.add(index === 0 ? 'foreign-zone--upstream' : 'foreign-zone--local');
                label.classList.add('foreign-zone__title');
                label.setAttribute('role', 'heading');
                label.setAttribute('aria-level', '3');
                region.prepend(label);
            });

            const upstreamGroups = [...regions[0].querySelectorAll(':scope > group')];
            upstreamGroups.forEach((group, index) => {
                group.classList.add('foreign-category', `foreign-category--${index + 1}`);
                const label = group.querySelector(':scope > label');
                label?.classList.add('foreign-category__title');
            });

            // Repeated, offset entries previously suggested a generic family by
            // drawing a stack. Keep the semantic item and remove visual duplicates.
            const removeStackDuplicates = group => {
                const entries = [...group.querySelectorAll(':scope > entry')];
                entries.forEach((entry, index) => {
                    const next = entries[index + 1];
                    if (next && entry.textContent.trim() === next.textContent.trim()) {
                        entry.classList.add('foreign-stack-copy');
                        entry.setAttribute('aria-hidden', 'true');
                    }
                });
            };
            upstreamGroups.forEach(removeStackDuplicates);

            const [localTraits, localRules] = [...regions[1].querySelectorAll(':scope > group')];
            localTraits?.classList.add('foreign-local-traits');
            localRules?.classList.add('foreign-rules');
            if (localTraits) {
                const title = document.createElement('h4');
                title.textContent = 'Traits defined here';
                localTraits.prepend(title);
            }
            if (localRules) {
                removeStackDuplicates(localRules);
                const blanketStack = [...localRules.querySelectorAll(':scope > entry')].slice(-3);
                blanketStack.slice(0, -1).forEach(entry => {
                    entry.classList.add('foreign-stack-copy');
                    entry.setAttribute('aria-hidden', 'true');
                });
                const definitions = [
                    ['allowed', 'Allowed'],
                    ['allowed', 'Allowed'],
                    ['rejected', 'Rejected'],
                    ['exception', 'Allowed · local parameter'],
                    ['allowed', 'Allowed'],
                    ['rejected', 'Rejected'],
                    ['allowed', 'Allowed · blanket impl.'],
                ];
                const examples = [...localRules.querySelectorAll(':scope > entry:not(.foreign-stack-copy)')];
                examples.forEach((entry, index) => {
                    const [status, text] = definitions[index] || ['allowed', 'Allowed'];
                    const badge = document.createElement('span');
                    entry.classList.add('foreign-rule', `foreign-rule--${status}`);
                    badge.className = 'foreign-rule__status';
                    badge.textContent = text;
                    entry.prepend(badge);
                });
            }

            if (footnote) {
                footnote.classList.add('foreign-types-note');
                board.after(footnote);
            }
        }
    }

    if (location.pathname === '/standard-library/thread-safety/') {
        const diagram = document.querySelector('threading-section');
        const board = diagram?.closest('div[style*="overflow"]');
        const canvas = board?.firstElementChild;
        if (diagram && board && canvas) {
            document.documentElement.classList.add('page-thread-safety');
            const card = document.createElement('section');
            const heading = document.createElement('h2');
            const summary = document.createElement('p');
            const legend = document.createElement('div');
            card.className = 'thread-safety-card visual-card';
            card.setAttribute('aria-labelledby', 'thread-safety-map-title');
            heading.id = 'thread-safety-map-title';
            heading.textContent = 'Send and Sync across threads';
            summary.className = 'visual-card__summary';
            summary.textContent = 'Compare which values can move to another thread and which references can be shared.';
            legend.className = 'thread-safety-key visual-key';
            legend.setAttribute('role', 'note');
            legend.setAttribute('aria-label', 'Thread safety diagram key');
            legend.innerHTML = `
                <strong>Diagram key</strong>
                <span><i class="thread-key__sample thread-key__sample--both" aria-hidden="true"></i>Send + Sync</span>
                <span><i class="thread-key__sample thread-key__sample--one" aria-hidden="true"></i>One trait only</span>
                <span><i class="thread-key__sample thread-key__sample--none" aria-hidden="true"></i>Neither</span>
                <span><i class="thread-key__sample thread-key__sample--unavailable" aria-hidden="true"></i>Unavailable in this thread</span>`;
            board.classList.add('thread-safety-board', 'visual-canvas');
            canvas.classList.add('thread-safety-canvas');
            diagram.classList.add('thread-safety-diagram');
            board.before(card);
            card.append(heading, summary, legend, board);
        }
    }

    // Several hand-positioned illustrations already have a scroll container.
    // Reuse it instead of introducing nested scrolling or changing its geometry.
    document.querySelectorAll('.book-content div[style]').forEach(region => {
        if (region.classList.contains('basic-numeric-shell')) return;
        if (region.style.overflow === 'auto') register(region, region.querySelector(diagramSelector) ? 'diagram' : 'content');
    });
    document.querySelectorAll('.book-content .scroll-region').forEach(region => {
        if (regions.some(item => item.region === region)) return;
        const existingHint = region.previousElementSibling?.classList.contains('scroll-hint') ? region.previousElementSibling : null;
        if (existingHint) regions.push({ region, hint: existingHint, kind: region.classList.contains('table-scroll') ? 'table' : 'content' });
        else register(region, region.classList.contains('table-scroll') ? 'table' : 'content');
    });
    document.querySelectorAll('.book-content table').forEach(table => {
        if (table.closest('.scroll-region, datum, zoo, mini-zoo, lifetime-example, threading-section')) return;
        const headers = [...table.querySelectorAll('thead th')].map(cell => cell.textContent.trim());
        const firstRowCount = table.querySelector('tbody tr')?.children.length || headers.length;
        wrap(table, 'table');
        const category = location.pathname.split('/').filter(Boolean)[0];
        const tone = category === 'language-constructs' ? 'language' : category === 'standard-library' ? 'std' : category === 'tooling' ? 'tooling' : 'neutral';
        const region = table.closest('.scroll-region');
        region.classList.add('reference-table-frame');
        table.classList.add('reference-table', `reference-table--${tone}`);
        const tableHeaders = [...table.querySelectorAll('thead th')];
        tableHeaders.forEach((header, index) => {
            header.scope ||= 'col';
            header.id ||= `rs-runtime-table-${regions.length}-col-${index}`;
        });
        table.querySelectorAll('tbody tr').forEach(row => {
            [...row.children].forEach((cell, index) => {
                if (tableHeaders[index]) cell.setAttribute('headers', tableHeaders[index].id);
            });
        });
        if (firstRowCount === 2) {
            region.classList.add('table--two-column');
            table.querySelectorAll('tbody tr').forEach(row => {
                [...row.children].forEach((cell, index) => cell.dataset.label = headers[index] || (index ? 'Details' : 'Item'));
            });
        }
    });
    document.querySelectorAll(diagramSelector).forEach(diagram => {
        if (diagram.closest('.basic-type-gallery, .datum-gallery, .mini-zoo-gallery') || diagram.classList.contains('datum-card')) return;
        if (!diagram.parentElement.closest(`${diagramSelector}, .scroll-region`)) {
            wrap(diagram, 'diagram');
        }
    });

    const createLifetimeLegend = () => {
        const legend = document.createElement('div');
        legend.className = 'lifetime-diagram-key visual-key';
        legend.setAttribute('role', 'note');
        legend.setAttribute('aria-label', 'How to read the memory diagrams');
        legend.innerHTML = `
            <strong>Diagram key</strong>
            <span><i class="lifetime-key__sample lifetime-key__sample--memory" aria-hidden="true"></i>Memory bytes</span>
            <span><i class="lifetime-key__sample lifetime-key__sample--value" aria-hidden="true"></i>Values</span>
            <span><i class="lifetime-key__sample lifetime-key__sample--binding" aria-hidden="true">a</i>Bindings</span>
            <span><i class="lifetime-key__sample lifetime-key__sample--past" aria-hidden="true"></i>Earlier state</span>`;
        return legend;
    };
    document.querySelectorAll('tabs.lifetimes > tab > panel > div').forEach(panel => {
        if (panel.querySelector('lifetime-example')) panel.prepend(createLifetimeLegend());
    });
    const standaloneLifetimeDiagram = document.querySelector('.book-content lifetime-example:not(tabs.lifetimes lifetime-example)');
    if (standaloneLifetimeDiagram) {
        const region = standaloneLifetimeDiagram.closest('.scroll-region') || standaloneLifetimeDiagram;
        const hint = region.previousElementSibling?.classList.contains('scroll-hint') ? region.previousElementSibling : region;
        hint.before(createLifetimeLegend());
    }

    let explanationNumber = 0;
    document.querySelectorAll('lifetime-section').forEach(section => {
        const explanation = [...section.children].find(child => child.tagName === 'EXPLANATION');
        const diagram = section.querySelector('lifetime-example');
        const caption = diagram?.querySelector('subtext');
        if (!explanation || !diagram || !caption) return;

        explanationNumber++;
        const title = caption.textContent.trim() || `Diagram ${explanationNumber}`;
        const explanationId = explanation.id || `lifetime-explanation-${explanationNumber}`;
        const buttonId = `lifetime-toggle-${explanationNumber}`;
        explanation.id = explanationId;
        explanation.setAttribute('role', 'region');
        explanation.setAttribute('aria-labelledby', buttonId);
        section.classList.add('has-explanation-toggle', 'visual-card');
        caption.hidden = true;

        const button = document.createElement('button');
        button.type = 'button';
        button.id = buttonId;
        button.className = 'lifetime-toggle';
        button.setAttribute('aria-controls', explanationId);
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', `Show explanation for ${title}`);

        const titleNode = document.createElement('span');
        titleNode.className = 'lifetime-toggle__title';
        titleNode.textContent = title;
        const actionNode = document.createElement('span');
        actionNode.className = 'lifetime-toggle__action';
        actionNode.textContent = 'Show explanation';
        const iconNode = document.createElement('span');
        iconNode.className = 'lifetime-toggle__icon';
        iconNode.setAttribute('aria-hidden', 'true');
        iconNode.textContent = '▾';
        button.append(titleNode, actionNode, iconNode);

        section.prepend(button);
        button.addEventListener('click', () => {
            const expanded = !explanation.classList.contains('is-expanded');
            explanation.classList.toggle('is-expanded', expanded);
            button.classList.toggle('is-expanded', expanded);
            button.setAttribute('aria-expanded', String(expanded));
            button.setAttribute('aria-label', `${expanded ? 'Hide' : 'Show'} explanation for ${title}`);
            actionNode.textContent = expanded ? 'Hide explanation' : 'Show explanation';
        });
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
                region.setAttribute('tabindex', '0');
                region.setAttribute('role', 'region');
                region.setAttribute('aria-label', `${kind[0].toUpperCase()}${kind.slice(1)}`);
                region.removeAttribute('aria-describedby');
            }
        });
    };
    const observer = new ResizeObserver(refresh);
    regions.forEach(({ region }) => observer.observe(region));
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    refresh();

    const tocLinks = [...document.querySelectorAll('.local-toc a[href^="#"]')];
    const headings = tocLinks.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
    if (headings.length && 'IntersectionObserver' in window) {
        const byId = new Map(tocLinks.map(link => [decodeURIComponent(link.hash.slice(1)), link]));
        const setCurrent = id => tocLinks.forEach(link => {
            if (link === byId.get(id)) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible[0]) setCurrent(visible[0].target.id);
        }, { rootMargin: `-${toolbar?.offsetHeight || 72}px 0px -70%`, threshold: 0 });
        headings.forEach(heading => observer.observe(heading));
        setCurrent(headings[0].id);
    }
})();
