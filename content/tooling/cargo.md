+++
title = "Cargo"
description = "Frequently used Cargo commands for creating, building, testing, documenting, and publishing Rust projects."
weight = 31
template = "topic.html"

[extra]
seo_title = "Cargo"
anchor = "cargo"
previous = "/tooling/project-anatomy/"
previous_title = "Project Anatomy"
next = "/tooling/cross-compilation/"
next_title = "Cross Compilation"
print = true
+++
Commands and tools that are good to know.


<div class="color-header tooling">

| Command | Description |
|--------| ---- |
| `cargo init` | Create a new project for the latest edition. |
| <code>cargo <span class="cargo-prefix">b</span>uild</code> | Build the project in debug mode (<code>--<span class="cargo-prefix">r</span>elease</code> for all optimization). |
| <code>cargo <span class="cargo-prefix">c</span>heck</code> | Check if project would compile (much faster). |
| <code>cargo <span class="cargo-prefix">t</span>est</code> | Run tests for the project. |
| <code>cargo <span class="cargo-prefix">d</span>oc --no-deps --open</code> | Locally generate documentation for your code. |
| <code>cargo <span class="cargo-prefix">r</span>un</code> | Run your project, if a binary is produced (main.rs). |
| {{ tab() }} `cargo run --bin b` | Run binary `b`. Unifies feat. with other dependents (can be confusing). |
| {{ tab() }} <code>cargo run --<span class="cargo-prefix">p</span>ackage w</code> | Run main of sub-worksp. `w`. Treats features more sanely. |
| <code>cargo … --timings</code> | Show what crates caused your build to take so long. {{ hot() }} |
| `cargo tree` | Show dependency graph, all crates used by project, transitively. |
| {{ tab() }} `cargo tree -i foo` | Inverse dependency lookup, explain why `foo` is used. |
| `cargo info foo` | Show crate metadata for `foo` (by default for version used by this project). |
| <code>cargo +{nightly, stable} …</code>  | Use given toolchain for command, e.g., for 'nightly only' tools. |
| <code>cargo +1.85.0 …</code>  | Also accepts a specific version directly. |
| `cargo +nightly …` | Some nightly-only commands (substitute `…` with command below) |
| {{ tab() }} `rustc -- -Zunpretty=expanded` |  Show expanded macros. {{ experimental() }} |
| `rustup doc` | Open offline Rust documentation (incl. the books), good on a plane! |

</div>

<footnotes>

Here <code>cargo <span class="cargo-prefix">b</span>uild</code> means you can either type `cargo build` or just `cargo b`; and <code>--<span class="cargo-prefix">r</span>elease</code> means it can be replaced with `-r`.

</footnotes>


{{ tablesep() }}


These are optional `rustup` components.
Install them with `rustup component add [tool]`.


<div class="color-header tooling">

| Tool | Description |
|--------| ---- |
| `cargo clippy` | Additional ([lints](https://rust-lang.github.io/rust-clippy/master/)) catching common API misuses and unidiomatic code. {{ link(url = "https://github.com/rust-lang/rust-clippy") }} |
| `cargo fmt` | Automatic code formatter (`rustup component add rustfmt`). {{ link(url = "https://github.com/rust-lang/rustfmt") }} |

</div>

{{ tablesep() }}

A large number of additional cargo plugins [**can be found here**](https://crates.io/categories/development-tools::cargo-plugins?sort=downloads).


{{ tablesep() }}
