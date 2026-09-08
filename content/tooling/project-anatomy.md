+++
title = "Project Anatomy"
description = "Common Rust and Cargo project files, folders, configuration, tests, examples, and build outputs."
weight = 30
template = "topic.html"

[extra]
seo_title = "Project Anatomy"
anchor = "project-anatomy"
previous = "/standard-library/string-output/"
previous_title = "String Output"
next = "/tooling/cargo/"
next_title = "Cargo"
print = true
+++
Basic project layout, and common files and folders, as used by `cargo`. {{ below(target="/tooling/cargo/#cargo") }}

<div class="color-header red">

| Entry | Code |
|--------| ---- |
| 📁 `.cargo/` | **Project-local cargo configuration**, may contain **`config.toml`**. {{ link( url="https://doc.rust-lang.org/cargo/reference/config.html") }} {{ esoteric() }} |
| 📁 `benches/` | Benchmarks for your crate, run via **`cargo bench`**, requires nightly by default. <sup>*</sup> {{ experimental() }} |
| 📁 `examples/` | Examples how to use your crate, they see your crate like external user would.  |
| {{ tab() }} {{ tab() }} `my_example.rs` | Individual examples are run like **`cargo run --example my_example`**. |
| 📁 `src/` | Actual source code for your project. |
| {{ tab() }} {{ tab() }} `main.rs` | Default entry point for applications, this is what **`cargo run`** uses. |
| {{ tab() }} {{ tab() }} `lib.rs` | Default entry point for libraries. This is where lookup for `my_crate::f()` starts. |
| 📁 `src/bin/` | Place for additional binaries, even in library projects. |
| {{ tab() }} {{ tab() }} `extra.rs` | Additional binary, run with `cargo run --bin extra`. |
| 📁 `tests/` | Integration tests go here, invoked via **`cargo test`**. Unit tests often stay in `src/` file. |
| `.rustfmt.toml` | In case you want to [**customize**](https://rust-lang.github.io/rustfmt/) how **`cargo fmt`** works. |
| `.clippy.toml` | Special configuration for certain [**clippy lints**](https://rust-lang.github.io/rust-clippy/master/index.html), utilized via **`cargo clippy`**  {{ esoteric() }} |
| `build.rs` |  **Pre-build script**, {{ link(url="https://doc.rust-lang.org/cargo/reference/build-scripts.html") }} useful when compiling C / FFI, … |
| <code class="ignore-auto language-bash">Cargo.toml</code> | Main **project manifest**, {{ link(url="https://doc.rust-lang.org/cargo/reference/manifest.html") }} Defines dependencies, artifacts … |
| <code class="ignore-auto language-bash">Cargo.lock</code> | For reproducible builds. Add to git for apps, consider not for libs. {{ opinionated() }} {{ link(url="https://blog.rust-lang.org/2023/08/29/committing-lockfiles.html" )}} {{ link(url="https://web.archive.org/web/20240108203227/https://old.reddit.com/r/rust/comments/164qfjm/change_in_guidance_on_committing_lockfiles_rust/jya8ouf/" )}} |
| `rust-toolchain.toml` |  Define **toolchain override**{{ link(url="https://rust-lang.github.io/rustup/overrides.html" )}} (channel, components, targets) for this project. |
</div>

<footnotes>

<sup>*</sup> On stable consider [Criterion](https://github.com/bheisler/criterion.rs).

</footnotes>


{{ tablesep() }}


**Minimal examples** for various entry points might look like:

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-1" name="tab-group-anatomy" checked>
<label for="tab-anatomy-1"><b>Applications</b></label>
<panel><div>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// src/main.rs (default application entry point)

fn main() {
    println!("Hello, world!");
}
```

</div></div></div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-2" name="tab-group-anatomy" >
<label for="tab-anatomy-2"><b>Libraries</b></label>
<panel><div>

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// src/lib.rs (default library entry point)

pub fn f() {}      // Is a public item in root, so it's accessible from the outside.

mod m {
    pub fn g() {}  // No public path (`m` not public) from root, so `g`
}                  // is not accessible from the outside of the crate.
```
</div></div></div></panel></tab>





<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-3" name="tab-group-anatomy" >
<label for="tab-anatomy-3"><b>Unit Tests</b></label>
<panel><div>

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// src/my_module.rs (any file of your project)

fn f() -> u32 { 0 }

#[cfg(test)]
mod test {
    use super::f;           // Need to import items from parent module. Has
                            // access to non-public members.
    #[test]
    fn ff() {
        assert_eq!(f(), 0);
    }
}
```
</div></div></div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-4" name="tab-group-anatomy" >
<label for="tab-anatomy-4"><b>Integration Tests</b></label>
<panel><div>

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// tests/sample.rs (sample integration test)

#[test]
fn my_sample() {
    assert_eq!(my_crate::f(), 123); // Integration tests (and benchmarks) 'depend' to the crate like
}                                   // a 3rd party would. Hence, they only see public items.
```
</div></div></div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-5" name="tab-group-anatomy" >
<label for="tab-anatomy-5"><b>Benchmarks</b>{{ experimental() }}</label>
<panel><div>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// benches/sample.rs (sample benchmark)

#![feature(test)]   // #[bench] is still experimental

extern crate test;  // Even in '18 this is needed for … reasons.
                    // Normally you don't need this in '18 code.

use test::{black_box, Bencher};

#[bench]
fn my_algo(b: &mut Bencher) {
    b.iter(|| black_box(my_crate::f())); // `black_box` prevents `f` from being optimized away.
}
```
</div></div></div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-6" name="tab-group-anatomy" >
<label for="tab-anatomy-6"><b>Build Scripts</b></label>
<panel><div>

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// build.rs (sample pre-build script)

fn main() {
    // You need to rely on env. vars for target; `#[cfg(…)]` are for host.
    let target_os = env::var("CARGO_CFG_TARGET_OS");
}
```

<sup>*</sup>[See here for list](https://doc.rust-lang.org/cargo/reference/environment-variables.html#environment-variables-cargo-sets-for-build-scripts) of environment variables set.

</div></div></div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-25" name="tab-group-anatomy" >
<label for="tab-anatomy-25"><b>Proc Macros</b>{{ esoteric() }}</label>
<panel><div>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// src/lib.rs (default entry point for proc macros)

extern crate proc_macro;  // Apparently needed to be imported like this.

use proc_macro::TokenStream;

#[proc_macro_attribute]   // Crates can now use `#[my_attribute]`
pub fn my_attribute(_attr: TokenStream, item: TokenStream) -> TokenStream {
    item
}
```


```
// Cargo.toml

[package]
name = "my_crate"
version = "0.1.0"

[lib]
proc-macro = true
```


</div></div></div></panel></tab>


</tabs>



{{ tablesep() }}


Module trees and imports:

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-module-import-1" name="tab-group-module-import" checked>
<label for="tab-module-import-1"><b>Module Trees</b></label>
<panel><div>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

**Modules** {{ book(page="ch07-02-defining-modules-to-control-scope-and-privacy.html") }} {{ ex(page="mod.html#modules") }} {{ ref(page="items/modules.html#modules") }} and **source files** work as follows:

- **Module tree** needs to be explicitly defined, is **not** implicitly built from **file system tree**. {{ link(url="http://www.sheshbabu.com/posts/rust-module-system/") }}
- **Module tree root** equals library, app, &hellip; entry point (e.g., `lib.rs`).

Actual **module definitions** work as follows:
- A **`mod m {}`** defines module in-file, while **`mod m;`** will read `m.rs` or `m/mod.rs`.
- Path of `.rs` based on **nesting**, e.g., `mod a { mod b { mod c; }}}` is either `a/b/c.rs` or `a/b/c/mod.rs`.
- Files not pathed from module tree root via some `mod m;` won't be touched by compiler! {{ bad() }}

<!-- - **Visibility** of items (e.g., functions, fields) between modules governed by: "Is there visible path to item?"
    - Visibility like `pub fn f() {}` does not mean "`f` is public", but "`f` at most public if all parents public`. -->


</div></div></div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-module-import-2" name="tab-group-module-import">
<label for="tab-module-import-2"><b>Namespaces</b>{{ esoteric() }}</label>
<panel><div>


Rust has three kinds of **namespaces**:

<table>
    <thead>
        <tr>
            <th>Namespace <i>Types</i></th>
            <th>Namespace <i>Functions</i></th>
            <th>Namespace <i>Macros</i></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>mod X {}</code></td>
            <td><code>fn X() {}</code></td>
            <td><code>macro_rules! X { … }</code></td>
        </tr>
        <tr>
            <td><code>X</code> (crate)</td>
            <td><code>const X: u8 = 1;</code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td><code>trait X {}</code></td>
            <td><code>static X: u8 = 1;</code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td><code>enum X {}</code></td>
            <td><code></code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td><code>union X {}</code></td>
            <td><code></code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td><code>struct X {}</code></td>
            <td><code></code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center; padding-right: 50px;"> <span style="opacity: 50%">←</span> <code>struct X;</code><sup>1</sup> <span style="opacity: 50%">→</span> </td>
            <td></td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center; padding-right: 50px;"> <span style="opacity: 50%">←</span> <code>struct X();</code><sup>2</sup> <span style="opacity: 50%">→</span> </td>
            <td></td>
        </tr>
    </tbody>
</table>

<footnotes>

<sup>1</sup> Counts in <i>Types</i> and in <i>Functions</i>, defines type `X` _and_ constant `X`. <br>
<sup>2</sup> Counts in <i>Types</i> and in <i>Functions</i>, defines type `X` _and_ function `X`.

</footnotes>

- In any given scope, for example within a module, only one item per namespace can exist, e.g.,
    - `enum X {}` and `fn X() {}` can coexist
    - `struct X;` and `const X` cannot coexist
- With a `use my_mod::X;` all items called `X` will be imported.

> Due to naming conventions (e.g., `fn` and `mod` are lowercase by convention) and _common sense_ (most developers just don't name all things `X`) you won't have to worry about these _kinds_ in most cases. They can, however, be a factor when designing macros.


</div></panel></tab>


</tabs>


{{ tablesep() }}
