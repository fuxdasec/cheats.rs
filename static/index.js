"use strict"

const API_ENDPOINT = "https://api.cheats.rs";

let codes_rust = document.querySelectorAll("code:not(.ignore-auto)");
let subtitle_index = 0;
let all_tabs_expanded = false; // Set `true` by script if asked to expand tabs
let request_admin_count = 0;

const SKIP_FIRST_N_SUBTITLES = 2; // Skip first 2 entries

const subtitles = [
    new Intl.DateTimeFormat(window.rsI18n.lang, { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
    document.documentElement.dataset.buildRevision || "cheats.rs",
    window.rsI18n.t("Same low price, 20% more content."),
    window.rsI18n.t("Recommended by 9 out of 10 dentists."),
    window.rsI18n.t("World's best cheat sheet according to its authors."),
    window.rsI18n.t("This site was tested on animals and got 4.5 stars."),
    window.rsI18n.t("Like Rust in a nutshell, for people with allergies."),
    window.rsI18n.t("All the things you ever wanted to know. And more."),
    window.rsI18n.t("A cargo-cult documentary."),
    window.rsI18n.t("Will the last person switch on night mode?"),
    window.rsI18n.t("A collaboration between Zoo Berlin and Olympia Typewriters."),
    window.rsI18n.t("Contains 2lbs of Rust per 1lbs of cheat sheet."),
    window.rsI18n.t("Prints best on Dunder Mifflin cream letter stock."),
    window.rsI18n.t("QA'ed with weekly 4h quality spot checks from Creed B."),
    window.rsI18n.t("May contain R-rated content."),
    window.rsI18n.t("Turned out the Señor Developer job wasn't much of a pay bump."),
    window.rsI18n.t("Testing Bekenstein's limit one entry a time."),
    window.rsI18n.t("Seven new dirty words: Undefined, runtime, inheritance, globals, unwrap, allocation, RIIR. JK on the last one."),
    window.rsI18n.t("After Rust, learning German will be so much easier."),
    window.rsI18n.t("Night mode is dark and full of errors."),
    window.rsI18n.t("^Z^Z^Z^Z^X^quit:help! &mldr; how do I exit this thing?"),
    window.rsI18n.t("If it smells like rust and tastes like rust, it's probably not Rust."),
    window.rsI18n.t("The R in ASMR stands for Rust."),
    window.rsI18n.t("Chuck Norris doesn't fear concurrency. Concurrency fears Chuck Norris."),
    window.rsI18n.t("Teaching endianness since 1820."),
    window.rsI18n.t("Snugly fits the Bayeux tapestry."),
    window.rsI18n.t("If a crab and a language love each other very much &mldr;"),
    window.rsI18n.t("I, for one, welcome our new AI overlords."),
    window.rsI18n.t("As seen on interdimensional cable."),
    window.rsI18n.t("I'm sure there's an X-File on the never type."),
    window.rsI18n.t("${jndi:ldap://rustup.rs}"),
    window.rsI18n.t("A fractal guide to amorphous complexity."),
    window.rsI18n.t("Roses had rust before it was cool."),
    window.rsI18n.t("Blazingly fa&mldr; 🤚😣"),
    window.rsI18n.t("The sheet that really ties the room together."),
    window.rsI18n.t("Rust be like: 'Computer says no &mldr;'"),
    window.rsI18n.t("Did you know, the Eiffel Tower is slowly rewritten in rust?"),
    window.rsI18n.t("Last time I wrote C feels like a lifetime ago &mldr;"),
    window.rsI18n.t("Can we borrow a minute of your time?"),
    window.rsI18n.t("Even for the Internet it's &mldr; pretty shocking."),
    window.rsI18n.t("According to Einstein, humans use only 10% of their programming language."),
    window.rsI18n.t("Fun fact, Rust appeared July 7, 2010, giving it the zodiac of the Crab ♋︎."),
    window.rsI18n.t("Rumor has it there are languages with no concept of time."),
    window.rsI18n.t("Tired of C++? Call (505) 142-4205 and request new dust filters for your Hoover Max Pressure Pro Model 60."),
    window.rsI18n.t("Got crabs? Visit std.rs!"),
    window.rsI18n.t("World's worst cheat sheet, with the exception of all others."),
    window.rsI18n.t("In a world of Rust, The Matrix would have been really short and depressing."),
    window.rsI18n.t("Florida man transmutes lifetime, crashes app."),
    window.rsI18n.t("It's pronounced Cheat She<span style='font-size:95%'>e</span><span style='font-size:90%'>e</span><span style='font-size:85%'>e</span><span style='font-size:80%'>e</span><span style='font-size:75%'>e</span><span style='font-size:70%'>t</span><span style='font-size:70%'>.</span>"),
    window.rsI18n.t("Arrival plot twist: the Heptapods needed help with lifetimes."),
    window.rsI18n.t("The language with more drama than your prom."),
    window.rsI18n.t("Also known as the Rust™️<sup>©️®️,not officially affiliated</sup> Language Cheat Sheet"),
    window.rsI18n.t("This is not the greatest cheat sheet in the world, no. This is just a tribute."),
    window.rsI18n.t("To improve CI times this site will ship as a precompiled binary next week."),
    window.rsI18n.t("Aquaaaa<sup>riiiiiii<sup style='font-size:85%;'>uuuuuuuuuuus</sup></sup>"),
    window.rsI18n.t("Rust is fast, somewhere between a snake and a mongoose."),
    window.rsI18n.t("\"In the jungle, the mighty jungle, the lion sleeps tonight\" &mldr; Chorus: \"Async-await, async-await &mldr;\""),
    window.rsI18n.t("Not great. Not terrible."),
    window.rsI18n.t("Standing on the shoulders of hobbits."),
    window.rsI18n.t("Everytime you type <span class='token keyword'>unsafe</span> the compiler secretly hums the James Bond theme."),
    window.rsI18n.t("Fn traits &mldr; man, I tell ya'"),
    window.rsI18n.t("You get what you pay for."),
    window.rsI18n.t("Look, nobody ever defined a size limit for cheat sheets."),
    window.rsI18n.t("You could say my C++ skills have gotten a bit &mldr; rusty."),
    window.rsI18n.t("You can't spell <i>trust</i> without <i>rust</i> &mldr; <strike>also frustra&mldr;</strike>"),
];


// Labels for which we don't want feedback, mainly because the button placement
// would interfere with other buttons.
const feedback_blacklist = ["", window.rsI18n.t("behind-the-scenes"), "data-types", window.rsI18n.t("numeric-types-ref"), window.rsI18n.t("textual-types-ref"), window.rsI18n.t("standard-library"), "traits", "tooling", "coding-guides", "misc"];


/// Enables or disables the playground.
function show_playground(state) {
    let area_static = document.getElementById("hellostatic");
    let area_play = document.getElementById("helloplay");
    let area_ctrl = document.getElementById("helloctrl");
    let area_info = document.getElementById("helloinfo");

    if (state) {
        area_static.style.display = "none";
        area_info.style.display = "block";
        area_play.innerHTML = "<iframe src='https://play.rust-lang.org/' style='width:100%; height:500px;'></iframe>";
        area_ctrl.innerHTML = `<a href="javascript:show_playground(false);">⏹️ ${window.rsI18n.t("Stop Editor")}</a>`;
    } else {
        area_static.style.display = "block";
        area_info.style.display = "none";
        area_play.innerHTML = "";
        area_ctrl.innerHTML = `<a href="javascript:show_playground(true);">▶️ ${window.rsI18n.t("Edit & Run")}</a>`;
    }
}

// Called on page load, get the user's preference on night mode, either from storage or system settings.
function get_browser_night_mode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "night";
    } else {
        return "day";
    }
}

// Update the body's class that affects on either day or night mode, based on the given mode.
function set_body_night_mode(night_mode) {
    let body = document.getElementsByTagName("body")[0];
    document.documentElement.setAttribute("data-theme", night_mode === "night" ? "dark" : "light");
    document.getElementById("toggle_night_mode")?.setAttribute("aria-pressed", String(night_mode === "night"));
    if (night_mode === "night") {
        body.classList.add("night-mode");
        body.classList.remove("day-mode");
    } else {
        body.classList.remove("night-mode");
        body.classList.add("day-mode");
    }
}

// Called by toggle button, enable or disable night mode and persist setting in localStorage.
function toggle_night_mode() {
    let night_mode = document.body.classList.contains("night-mode") ? "night" : "day";

    if (night_mode === "night") {
        night_mode = "day";
    } else {
        night_mode = "night";
    }

    storage_set("night-mode", night_mode);
    storage_set("rsds-theme", night_mode === "night" ? "dark" : "light");
    set_body_night_mode(night_mode);
}

// Called by toggle button, enable or disable ligatures persist setting in localStorage.
function toggle_ligatures() {
    let body = document.getElementsByTagName("body")[0];
    let set = undefined;

    if (!codes_rust || codes_rust.length == 0) return;

    if (codes_rust[0].style.fontVariantLigatures === "common-ligatures") {
        set = "none";
        storage_set("ligatures", "no-ligatures");
    } else {
        set = "common-ligatures";
        storage_set("ligatures", "ligatures");
    }

    document.getElementById("toggle_ligatures")?.setAttribute("aria-pressed", String(set === "common-ligatures"));
    codes_rust.forEach((code) => {
        code.style.fontVariantLigatures = set;
    });
}

// Opens or closes the blue box on top of the page.
function toggle_legend() {
    let short = document.querySelectorAll("symbol-legend.short")[0];
    if (!short) return;
    let long = document.querySelectorAll("symbol-legend.long")[0];
    let href = document.querySelector(".legend-toggle");

    if (short.style.display == "" || short.style.display == "block") {
        short.style.display = "none";
        long.style.display = "block";
        href.textContent = window.rsI18n.t("Hide symbol legend");
        href.setAttribute("aria-expanded", "true");
    } else {
        short.style.display = "block";
        long.style.display = "none";
        href.textContent = window.rsI18n.t("Show symbol legend");
        href.setAttribute("aria-expanded", "false");
    }
}


// Called by toggle button, enable or disable night mode and persist setting in localStorage.
function toggle_xray() {
    // Make visualization toggleable
    document.body.classList.toggle('xray-visible');

    // Cleanup existing xray visualizations if they exist so we can safely re-create them again
    document.querySelectorAll('.xray').forEach(el => el.remove());

    // Get all entries of our TOC (i.e., the list items containing a clickable link to the rest of the sheet)
    let toc_entries = document.querySelectorAll("toc li");

    fetch(`${API_ENDPOINT}/report/aggregates`)
        .then(response => response.json())
        .then(data => {
            // Now for each toc_entry, get statistics and render
            toc_entries.forEach(element => {
                // Get actual target of that href
                let link_href = element.childNodes[0].getAttribute("href");
                let section = link_href.split("#")[1];

                let stats = data[section];
                let width = (stats.positive + stats.negative) / 10;
                let percentage = 100 * stats.positive / (stats.positive + stats.negative);

                let stat_block = document.createElement("span");
                stat_block.className = "xray"
                stat_block.innerHTML = `
                    <sup>
                        <div style='background-color: red; width: ${width}px; height: 8px; display: inline-block; overflow: hidden; vertical-align: middle;'>
                            <div style='background-color: green; height: 100%; width: ${percentage}%;'></div>
                        </div>
                        <span style="color: green;">${stats.positive}</span> / <span style="color: red;">${stats.negative}</span> / ${stats.feedbacks}
                    </sup>
                `;
                element.append(stat_block)
            });
        })
        .catch(error => console.error('Error:', error));
}

// Show "admin" controls
function request_admin() {
    if (++request_admin_count == 5) {
        document.querySelectorAll('.admin').forEach(el => el.style.display = 'initial');
    }
}


// Called by toggle button, setting in localStorage.
function expand_all() {
    //
    // Expand all the tabs
    //
    let tabs = document.querySelectorAll("tab");
    for (let tab of tabs) {
        tab.style.display = "block";
    }

    let panels = document.querySelectorAll("tab > panel");
    for (let panel of panels) {
        panel.style.display = "initial";
    }

    let labels = document.querySelectorAll("tab > label");
    for (let label of labels) {
        label.style.display = "inline-block";
        // label.style.width = "100%";
        label.style.cursor = "initial";
        label.style.marginTop = "10px";
    }

    let inputs = document.querySelectorAll("tab > input");
    for (let input of inputs) {
        input.checked = false;
    }

    //
    // Expand all lifetime sections
    //
    let lifetime_explanations = document.querySelectorAll("lifetime-section > explanation");
    for (let le of lifetime_explanations) {
        le.style.display = "inherit";
    }

    //
    // Expand all types sections
    //
    let types_explanations = document.querySelectorAll("generics-section > description");
    for (let te of types_explanations) {
        te.style.display = "inherit";
    }
}


// Sets something to local storage.
function storage_set(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* Storage can be disabled. */ }
}

// Retrieves something from local storage.
function storage_get(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
}


// Called when the user clicks the subtitle (usually the date)
function advance_subtitle(to_index) {
    let subtitle = document.getElementById("subtitle");
    let subtitle_entry = "UNDEFINED";

    if (!!to_index) {
        // If called with specific index use that and stop thinking
        // about it.
        subtitle_entry = subtitles[to_index];
        subtitle_index = to_index;
    } else {
        // If not called with specific index (normal onclick behavior),
        // increase number.
        let next_possible_index = (subtitle_index + 1) % subtitles.length;

        // Is this now a follow-up entry?
        //
        // Yes: Show it.
        // No: Cycle back between the initial SKIP_FIRST_N_SUBTITLES.
        //
        // To figure out if follow-up entry, check if ("xxx", false) pair.

        subtitle_entry = subtitles[next_possible_index];

        if (subtitle_entry[1] === false) {
            // If that was a ("xxx", false) follow-up pair, get actual content and show.
            subtitle_index = next_possible_index;
            subtitle_entry = subtitle_entry[0];
        } else {
            // If was not a follow-up, rotate between first keys only.
            next_possible_index = next_possible_index % SKIP_FIRST_N_SUBTITLES;
            subtitle_index = next_possible_index;
            subtitle_entry = subtitles[next_possible_index];
        }
    }

    subtitle.innerHTML = subtitle_entry;
}

/// Shows a random quote
function random_quote() {
    let index = false;

    // Keep picking random numbers until we find some not a follow-up.
    while (index === false) {
        let rand = Math.random();

        index = SKIP_FIRST_N_SUBTITLES + Math.floor((subtitles.length - SKIP_FIRST_N_SUBTITLES) * rand);

        // If 2nd index was false we should ignore entry since it's follow up.
        if (subtitles[index][1] === false) {
            index = false;
        }
    }

    advance_subtitle(index);
}


// Performs the raw XHR call.
function json_post(op, json, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", API_ENDPOINT + op, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(json));
    xhr.onerror = (e) => { callback && callback("error") }
    xhr.onload = (e) => { callback && callback() }
}

// Submits text the user has written into the feedback form.
function feedback_send_detailed(feedback_id) {
    let feedback_node = document.getElementById(feedback_id);
    let element_id = feedback_node.getAttribute("element-id");

    let textarea = feedback_node.querySelectorAll(`textarea`)[0];
    let text = textarea.value;

    json_post("/feedback/detail", { text: text, section: element_id }, (e) => {
        let result = feedback_node.querySelectorAll(`result`)[0]
        if (!e) {
            textarea.value = null;
            result.innerHTML = window.rsI18n.t("Success");
            result.style.color = "green";
            result.style.left = "40px";
            result.style.opacity = "0.0";

            setTimeout(() => {
                result.innerHTML = "";
                result.style.color = "black";
                result.style.left = "0px";
                result.style.opacity = "1.0";
            }, 500)
        } else {
            result.innerHTML = window.rsI18n.t("Failed");
            result.style.color = "red";
        }
    });
}

// Prepares all forms visual effects for giving feedback
function feedback_send_mood(mood, feedback_id) {
    let feedback_node = document.getElementById(feedback_id);
    let element_id = feedback_node.getAttribute("element-id");

    let animation = feedback_node.querySelectorAll(`feedback-button.${mood} feedback-feedback`)[0];
    animation.style.visibility = "inherit";
    animation.style.top = "-3em";
    animation.style.opacity = "0.0";

    json_post("/feedback/mood", { mood: mood, section: element_id });

    setTimeout(() => {
        animation.style.visibility = "hidden";
        animation.style.top = "-0.5em";
        animation.style.opacity = "0.5";
    }, 300);
}

// Hide logic for feedback box needs various entities to call this.
function feedback_detail_visibility(feedback_id, visibility) {
    let feedback_node = document.getElementById(feedback_id);
    let form = feedback_node.querySelectorAll(`feedback-form`)[0];
    form.style.display = visibility;
}

// Handler to catch CTRL-ENTER
function feedback_quick_submit(feedback_id) {
    if (event.ctrlKey && event.keyCode == 13) {
        feedback_send_detailed(feedback_id);
    }
}

// Given a list of header tags, attach feedback buttons to that header.
function feedback_attach_buttons(list_of_header_tags) {
    for (let tagname of list_of_header_tags) {
        let elements = document.getElementsByTagName(tagname);

        for (let element of elements) {
            let element_id = element.id;
            let feedback_id = "feedback-" + element_id;
            let feedback = document.createElement("feedback");

            if (feedback_blacklist.includes(element_id)) continue;

            feedback.setAttribute("element-id", element_id);
            feedback.id = feedback_id;
            feedback.innerHTML = `
                <button-row>
                    <feedback-button class="good" onmouseover="feedback_detail_visibility('${feedback_id}', 'none')" onclick="javascript:feedback_send_mood('good', '${feedback_id}');"><feedback-feedback>💗</feedback-feedback><the-button>😊</the-button></feedback-button>
                    <feedback-button class="bad" onmouseover="feedback_detail_visibility('${feedback_id}', 'none')" onclick="javascript:feedback_send_mood('bad', '${feedback_id}');"><feedback-feedback>💩</feedback-feedback><the-button>😠</the-button></feedback-button>
                    <feedback-button onmouseover="feedback_detail_visibility('${feedback_id}', 'inherit')"><the-button>✏️</the-button></feedback-button>
                </button-row>
                <feedback-form>
                    <textarea maxlength="2048" onkeydown="javascript:feedback_quick_submit('${feedback_id}', this);" placeholder="${window.rsI18n.t('Tell us more!')}"></textarea>
                    <hint>${window.rsI18n.t("See")}<a href="/legal">${window.rsI18n.t("privacy policy")}</a>${window.rsI18n.t("; also")}<b>${window.rsI18n.t("CTRL-ENTER")}</b>${window.rsI18n.t("submits.")}</hint>
                    <controls>
                        <result></result>
                        <a href="javascript:feedback_send_detailed('${feedback_id}');">${window.rsI18n.t("Submit")}</a>
                    </controls>
                </feedback-form>
            `;
            feedback.onmouseleave = () => {
                setTimeout(() => {
                    // Ok, problem is there are a few pixels where user's mouse will trigger
                    // "onmouseleave" but he actually only moved mouse to into detail box.
                    // The trick now is, we query for that ID with `:hover` state, if that
                    // element exists we know the user successfully hovered and don't do
                    // anything.
                    let is_still_hovered = document.querySelectorAll(`#${feedback_id}:hover`);
                    if (is_still_hovered.length > 0) return;

                    // Otherwise we hide the box.
                    feedback_detail_visibility(feedback_id, "none");
                }, 150);

            }

            element.appendChild(feedback);
        }
    }
}

// Make sure all "generics-section" expand when clicked.
function generics_section_expand_on_click() {
    // reading.js upgrades these sections to accessible disclosure buttons.
    // Retain this only as a compatibility fallback if that enhancement did
    // not run; never attach a second click handler to an enhanced section.
    let generics_section = document.querySelectorAll("generics-section:not(.has-disclosure-toggle) > header");

    for (let e of generics_section) {
        e.onclick = (_) => {
            // Just expand the current one
            let description = e.parentElement.querySelector("description");

            if (!description.style.display || description.style.display == "none") {
                console.log(1)
                description.style.display = "inherit";
            } else {
                console.log(2)
                description.style.display = "none";
            }
        }
    }
}


// Use proper syntax since we don't want to write ````rust ...``` all the time.
codes_rust.forEach(code => {
    code.className = "language-rust";
});

// Run this after page had time to do first layout since these might take 1-2s, otherwise
// blocking page first render.
window.onload = () => {
    try {
        // Check if we have been asked to print
        const is_print_source = window.location.hash == "#_print" || window.window.rsI18n.route == "/_print/";
        if (is_print_source) {
            // In print mode, all we care for is to enable a few things
            toggle_ligatures();
            expand_all();

            // Have to set this to make CSS work for book
            set_body_night_mode("day");
        } else {
            // Executed on page load, this runs all toggles the user might have clicked
            // the last time based on localStorage.
            let ligatures = storage_get("ligatures");
            let saved_theme = storage_get("rsds-theme");
            let night_mode = saved_theme ? (saved_theme === "dark" ? "night" : "day") : (storage_get("night-mode") || get_browser_night_mode());

            // Don't attach feedback to h1, looks ugly and doesn't help.
            feedback_attach_buttons(["h2", "h3", "h4"]);

            if (document.getElementById("subtitle") && Math.random() < 0.15) { random_quote(); }
            // Screen ligature state is initialized by js/theme.js. The legacy
            // helper remains public for printable output and old inline links.

            set_body_night_mode(night_mode);

            // Make sure all interactive content works
            generics_section_expand_on_click();

            json_post("/page/loaded", { referrer: document.referrer });
        }
    } catch (e) {
        console.log(e);
    }
};
