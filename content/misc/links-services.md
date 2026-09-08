+++
title = "Links & Services"
description = "Selected Rust books, documentation, reference tables, online services, and development resources."
weight = 44
template = "topic.html"

[extra]
seo_title = "Links & Services"
anchor = "links-services"
previous = "/coding-guides/api-stability/"
previous_title = "API Stability"
next = "/misc/printing-pdf/"
next_title = "Printing & PDF"
print = false
+++
<div class="color-header lavender">

<!-- Official Rust online "books" about Rust itself or major components (e.g., WebAssembly, Embedded, …).
     This is not a random link section. Resources below should be have official community
     involvement, be maintained, have +1k Github stars, and be 'substantial'. Given our own
     audience we generally favor compact resources targetting experienced programmers. -->

Specialty books, also see [Little Book of Rust Books](https://lborb.github.io/book/title-page.html).

| Topic&nbsp;️📚  | Description |
|--------| -----------|
| [API Guidelines](https://rust-lang.github.io/api-guidelines/) | How to write idiomatic and re-usable Rust. |
| [Asynchronous Programming](https://rust-lang.github.io/async-book/)  {{ experimental() }} | Explains `async` code, `Futures`, … |
| [Cargo](https://doc.rust-lang.org/cargo/) | How to use `cargo` and write `Cargo.toml`. |
| [CLIs](https://rust-lang-nursery.github.io/cli-wg/) | Information about creating CLI tools. |
| [Cookbook](https://rust-lang-nursery.github.io/rust-cookbook/) | Collection of simple examples that demonstrate good practices. |
| [Design Patterns](https://rust-unofficial.github.io/patterns//) | Idioms, Patterns, Anti-Patterns. |
| [Edition Guide](https://doc.rust-lang.org/nightly/edition-guide/) | Working with Rust 2015, Rust 2018, and beyond.  |
| [Embedded](https://docs.rust-embedded.org/book/intro/index.html) | Working with embedded and `#![no_std]` devices. |
| [Functional Jargon](https://github.com/JasonShin/functional-programming-jargon.rs) {{ esoteric() }} | A collection of functional programming jargon explained in Rust.  |
| [Guide to Rustc Development](https://rustc-dev-guide.rust-lang.org/index.html) {{ esoteric() }} | Explains how the compiler works internally. |
| [Little Book of Rust Macros](https://veykril.github.io/tlborm/introduction.html) | Community's collective knowledge of Rust macros. |
| [Performance](https://nnethercote.github.io/perf-book/) | Techniques to improve the speed and memory usage. |
| [Pragmatic Rust Guidelines](https://microsoft.github.io/rust-guidelines/) | Pragmatic design guidelines for idiomatic Rust that scales. |
| [RFCs](https://rust-lang.github.io/rfcs/) {{ esoteric() }} | Look up accepted RFCs and how they change the language. |
| [Rustdoc](https://doc.rust-lang.org/stable/rustdoc/) | Tips how to customize `cargo doc` and `rustdoc`. |
| [Unsafe Code Guidelines](https://rust-lang.github.io/unsafe-code-guidelines/) {{ experimental() }} | Concise information about writing `unsafe` code. |
| [Unstable](https://doc.rust-lang.org/unstable-book/index.html)  {{ esoteric() }} | Information about unstable items, e.g, `#![feature(…)]`.  |

</div>


{{ tablesep() }}



Comprehensive lookup tables for common components.

<div class="color-header lavender">

<!-- Table-like sites, often auto-generated. -->
| Table&nbsp;📋| Description |
|--------| -----------|
| [Rust Forge](https://forge.rust-lang.org/) | Lists release train and links for people working on the compiler. |
| {{ tab() }} [Supported Platforms](https://doc.rust-lang.org/rustc/platform-support.html) | All supported platforms and their Tier. |
| {{ tab() }} [Component History](https://rust-lang.github.io/rustup-components-history/) {{ experimental() }} | Check **nightly** status of various Rust tools for a platform. |
| [Clippy Lints](https://rust-lang.github.io/rust-clippy/master/) | All the [**clippy**](https://github.com/rust-lang/rust-clippy) lints you might be interested in. |
| [Rustfmt Config](https://rust-lang.github.io/rustfmt/) | All [**rustfmt**](https://github.com/rust-lang/rustfmt) options you can use in `.rustfmt.toml`. |
</div>

{{ tablesep() }}


Online services which provide information or tooling.

<div class="color-header lavender">

<!-- Other online web services related to Rust. As a heuristic, things here should
    be essential (or at least address a major concern as "best of class") and be
    a self-contained, user-facing web site. -->

| Service&nbsp;⚙️ | Description |
|--------| -----------|
| [Rust Playground](https://play.rust-lang.org/) | Try and share snippets of Rust code. |
| [crates.io](https://crates.io/) | All 3<sup>rd</sup> party libraries for Rust. |
| [lib.rs](https://lib.rs/) | Unofficial overview of quality Rust libraries and applications. |
| [blessed.rs](https://blessed.rs/) <a class="tooltip" title="Opinionated."><sup>💬</sup></a> | An unofficial guide to the Rust ecosystem, even more opinionated. |
| [std.rs](https://std.rs/) | Shortcut to `std` documentation. |
| [stdrs.dev](https://stdrs.dev/)  {{ esoteric() }} | Shortcut to `std` documentation including compiler-internal modules. |
| [docs.rs](https://docs.rs/) | Documentation for 3<sup>rd</sup> party libraries, automatically generated from source. |
| [releases.rs](https://releases.rs/) | Release notes for previous and upcoming versions. |

</div>

{{ tablesep() }}
