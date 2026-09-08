

# ![Logo](/static/logo.png) Rust Language Cheat Sheet

[![Read Online](/gfx/button_read-online2.png)](https://cheats.rs)
[![PDF](/gfx/button_cached-pdf2.png)](https://cheats.rs/dl/rust_cheat_sheet_a4.pdf)

**A Rust reference for people who like high information density.**

Use cases, in order of priority:
* **identification & lookup guide** for constructs encountered in code,
* **discover** parts of the language you might not know,
* **learn about Rust** if you have prior programming experience.


# Building

Built with [Zola](https://www.getzola.org/), the static site generator written in Rust. See [`.zolaversion`](.zolaversion) for the exact version the official site was deployed with. To develop locally download the indicated version, then run:

```
zola serve
```


## Checking the generated site

Validate the audited content hashes before building, then validate the route tree, SEO metadata, sitemap, internal links, and legacy fragments after `zola build` and `npm run posthtml`:

```
npm run check:content
npm run check:site
```

Regenerate the 1200×630 social preview after intentionally changing its design with `npm run social-card`.

With dependencies installed (`npm install` and `npx playwright install chromium firefox`), serve `public` over HTTP and run:

```
npm run check:reading -- http://127.0.0.1:1111
```

The browser checks visit every published URL at mobile, tablet, and desktop widths in Chromium and Firefox. They also cover the Sections menu, tabs, reading settings, previous/next navigation, legacy URL migration, and print styles. Test requests to the feedback API and playground use local fixtures.

To reproduce the final CI package after a fresh `zola build`, package and serve `public.clean`, run the browser checks against that server, and finish with:

```
npm run pdf
npm run check:site -- public.clean --final
```

The PDF command generates the A4 and Letter downloads and removes the private `/_print/` source before the final artifact check.

# Contributing

Contributions are welcome and you can PR bug fixes directly. If you somehow ended up here but prefer not to use Github write to [webmaster@cheats.rs](mailto:webmaster@cheats.rs), or use the on-site buttons.

Constructive feedback would be most actionable, but if you just want to vent your frustration that's fine too :)


# Credits

Big shout-out to [all the contributors](https://github.com/ralfbiedert/cheats.rs/graphs/contributors) and people filing [issues](https://github.com/ralfbiedert/cheats.rs/issues) and [pull requests](https://github.com/ralfbiedert/cheats.rs/pulls) for being awesome!


Also:

* The Bronshtein and Semendyayev _Handbook of Mathematics_, the mother of all cheat sheets
* [The Book](https://doc.rust-lang.org/stable/book/) (some tables)
* [Idiomatic Rust Libraries](https://killercup.github.io/rustfest-idiomatic-libs/#/) (idiomatic Rust)
* [Ferris](https://rustacean.net/) (Rust mascot by Karen Rustad Tölva)
* [Rust container cheat sheet](https://docs.google.com/presentation/d/1q-c7UAyrUlM-eZyTo1pd8SZ0qwA_wYxmPZVOQkoDmH4/edit#slide=id.p) (for data layout; Raph Levien)
* That one IEEE 754-2008 Powerpoint deck I can't find anymore ...
* [String Conversions](https://docs.google.com/spreadsheets/d/19vSPL6z2d50JlyzwxariaYD6EU2QQUQqIDOGbiGQC7Y/pubhtml?gid=0&single=true)
* steffahn from users.rust-lang.org (for outstanding explanations)
* eddyb for feedback and explanations


# FAQ

Answers to frequently asked questions can [be found here](content/faq.md).


# Legal & License

Please [see here](content/legal.md) for details.
