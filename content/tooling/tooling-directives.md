+++
title = "Tooling Directives"
description = "Rust attributes and directives for linting, conditional compilation, linking, testing, documentation, and optimization."
weight = 33
template = "topic.html"

[extra]
seo_title = "Tooling Directives"
anchor = "tooling-directives"
previous = "/tooling/cross-compilation/"
previous_title = "Cross Compilation"
next = "/working-with-types/types-traits-generics/"
next_title = "Types, Traits, Generics"
print = true
+++
Special tokens embedded in source code used by tooling or preprocessing.

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-1" name="tab-group-preprocessing" checked>
<label for="tab-preprocessing-1"><b>Macro Fragments</b></label>
<panel><div class="color-header undefined-color-3">

<fixed-2-column class="color-header special_example">

<!-- Tool: **Preprocessor (Automatic)** -->


<!-- ```
macro_rules! my_macro {
    ($x:ty) => { ... }
}
``` -->

Inside a **declarative** {{ book(page="ch19-06-macros.html#declarative-macros-with-macro_rules-for-general-metaprogramming") }} **macro by example** {{book(page="ch19-06-macros.html")}} {{ex(page="macros.html#macro_rules")}} {{ref(page="macros-by-example.html")}} `macro_rules!` implementation these **fragment specifiers** {{ ref(page="macros-by-example.html#metavariables") }} work:

| Within Macros |  Explanation |
|---------|---------|
| `$x:ty`  | Macro capture (here a `$x` is the capture and `ty` means `x` must be type). |
| {{ tab() }} `$x:block`   | A block `{}` of statements or expressions, e.g., `{ let x = 5; }` |
| {{ tab() }} `$x:expr`    | An expression, e.g., `x`, `1 + 1`, `String::new()` or `vec![]` |
| {{ tab() }} `$x:expr_2021` | An expression that matches the behavior of Rust '21 {{ rfc(page="3531-macro-fragment-policy.html") }} |
| {{ tab() }} `$x:ident`   | An identifier, for example in `let x = 0;` the identifier is `x`. |
| {{ tab() }} `$x:item`    | An item, like a function, struct, module, etc. |
| {{ tab() }} `$x:lifetime` | A lifetime (e.g., `'a`, `'static`, etc.). |
| {{ tab() }} `$x:literal` | A literal (e.g., `3`, `"foo"`, `b"bar"`, etc.). |
| {{ tab() }} `$x:meta`    | A meta item; the things that go inside `#[…]` and `#![…]` attributes. |
| {{ tab() }} `$x:pat`     | A pattern, e.g., `Some(x)`, `(17, 'a')` or <code>x&vert;x</code>. |
| {{ tab() }} `$x:pat_param`| Subset of patterns without top-level &vert;, e.g., `Some(x)` or `x`. |
| {{ tab() }} `$x:path`    | A path (e.g., `foo`, `::std::mem::replace`, `transmute::<_, int>`). |
| {{ tab() }} `$x:stmt`    | A statement, e.g., `let x = 1 + 1;`, `String::new();` or `vec![];` |
| {{ tab() }} `$x:tt`      | A single token tree, [see here](https://stackoverflow.com/a/40303308) for more details. |
| {{ tab() }} `$x:ty`      | A type, e.g., `String`, `usize` or `Vec<u8>`. |
| {{ tab() }} `$x:vis`    | A visibility modifier;  `pub`, `pub(crate)`, etc. |
| `$crate` | Special hygiene variable, crate where macros is defined. {{ todo() }} |

</fixed-2-column>

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-2" name="tab-group-preprocessing">
<label for="tab-preprocessing-2"><b>Documentation</b></label>
<panel><div class="color-header undefined-color-2">

<fixed-2-column  class="color-header special_example">

<!-- ```
/// Accepts an [`S`].
///
/// ```rust
///     f(s);
/// ```
``` -->

Inside a **doc comment** {{ book(page="ch14-02-publishing-to-crates-io.html#making-useful-documentation-comments") }} {{ ex(page="meta/doc.html#documentation") }} {{ ref(page="comments.html#doc-comments")}} these work:

| Within Doc Comments | Explanation |
|--------|-------------|
| ` ```…``` ` | Include a [**doc test**](https://doc.rust-lang.org/rustdoc/documentation-tests.html) (doc code running on `cargo test`). |
| ` ```X,Y …``` ` | Same, and include optional configurations; with `X`, `Y` being … |
| {{ tab() }} <code style="color: gray;">rust</code> | Make it explicit test is written in Rust; implied by Rust tooling. |
| {{ tab() }} <code style="color: gray; opacity: 0.3;">-</code> | Compile test. Run test. Fail if panic. **Default behavior**. |
| {{ tab() }} <code style="color: gray;">should_panic</code> | Compile test. Run test. Execution should panic. If not, fail test. |
| {{ tab() }} <code style="color: gray;">no_run</code> | Compile test. Fail test if code can't be compiled, Don't run test. |
| {{ tab() }} <code style="color: gray;">compile_fail</code> | Compile test but fail test if code _can_ be compiled. |
| {{ tab() }} <code style="color: gray;">ignore</code> | Do not compile. Do not run. Prefer option above instead. |
| {{ tab() }} <code style="color: gray;">edition2018</code> | Execute code as Rust '18; default is '15. |
| `#` | Hide line from documentation (` ```   # use x::hidden; ``` `). |
| <code>[&#96;S&#96;]</code> | Create a link to struct, enum, trait, function, &hellip; `S`. |
| <code>[&#96;S&#96;]&#40;crate::S&#41;</code> | Paths can also be used, in the form of markdown links. |


</fixed-2-column>


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-7" name="tab-group-preprocessing">
<label for="tab-preprocessing-7"><b><code>#![globals]</code></b></label>
<panel><div class="color-header undefined-color-3">

<!-- ```
// Attributes usually found in toplevel project file.
#![no_std]
#![feature(xxx)]
``` -->
<fixed-3-column  class="color-header special_example">

Attributes affecting the whole crate or app:

| Opt-Out's   | On | Explanation |
|--------|---| ----------|
| `#![no_std]` | `C` | Don't (automatically) import **`std`**{{ std(page="std/") }} ; use **`core`**{{ std(page="core/") }} instead. {{ ref(page="names/preludes.html#the-no_std-attribute") }} |
| `#![no_implicit_prelude]` | `CM` | Don't add **`prelude`**{{ std(page="std/prelude/index.html") }}, need to manually import `None`, `Vec`, … {{ ref(page="names/preludes.html#the-no_implicit_prelude-attribute") }} |
| `#![no_main]` |  `C` | Don't emit `main()` in apps if you do that yourself. {{ ref(page="crates-and-source-files.html#the-no_main-attribute") }}|

<!-- | `#![no_builtins]` | `C` | Does ... something ... probably important. {{ todo() }} {{ ref(page="attributes/codegen.html#the-no_builtins-attribute") }}| -->

{{ tablesep() }}

| Opt-In's   | On | Explanation |
|--------|---| ----------|
| `#![feature(a, b, c)]` | `C` | Rely on f. that may not get stabilized, _c._ [**Unstable Book**](https://doc.rust-lang.org/unstable-book/the-unstable-book.html). {{ experimental() }} |

{{ tablesep() }}

| Builds | On | Explanation |
|--------|---| ----------|
| `#![crate_name = "x"]` | `C`  | Specify current crate name, e.g., when not using `cargo`. {{ todo() }} {{ ref(page="crates-and-source-files.html#the-crate_name-attribute") }} {{ esoteric() }} |
| `#![crate_type = "bin"]` | `C`  | Specify current crate type (`bin`, `lib`, `dylib`, `cdylib`, …). {{ ref(page="linkage.html") }} {{ esoteric() }} |
| `#![recursion_limit = "123"]` | `C` | Set _compile-time_ recursion limit for deref, macros, … {{ ref(page="attributes/limits.html#the-recursion_limit-attribute") }} {{ esoteric() }} |
| `#![type_length_limit = "456"]` | `C` | Limits maximum number of type substitutions. {{ ref(page="attributes/limits.html#the-type_length_limit-attribute") }} {{ esoteric() }} |
| `#![windows_subsystem = "x"]` | `C` | On Windows, make a `console` or `windows` app. {{ ref(page="runtime.html#the-windows_subsystem-attribute") }} {{ esoteric() }} |


{{ tablesep() }}

| Handlers | On | Explanation |
|--------|---|----------|
| `#[alloc_error_handler]` | `F` | Make some `fn(Layout) -> !` the **allocation fail. handler**. {{ link(url="https://github.com/rust-lang/rust/issues/51540") }} {{ experimental() }} |
| `#[global_allocator]` | `S` | Make static item impl. `GlobalAlloc` {{ std(page="alloc/alloc/trait.GlobalAlloc.html") }} **global allocator**. {{ ref(page="runtime.html#the-global_allocator-attribute") }}|
| `#[panic_handler]` | `F` | Make some `fn(&PanicInfo) -> !` app's **panic handler**. {{ ref(page="runtime.html#the-panic_handler-attribute") }} |


</fixed-3-column>


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-4" name="tab-group-preprocessing">
<label for="tab-preprocessing-4"><b><code>#[code]</code></b></label>
<panel><div class="color-header undefined-color-3">

Attributes primarily governing emitted code:

<fixed-3-column  class="color-header special_example">

| Developer UX | On | Explanation |
|-------|---|-------------|
| `#[non_exhaustive]` | `T` | Future-proof `struct` or `enum`; hint it may grow in future. {{ ref(page="attributes/type_system.html#the-non_exhaustive-attribute") }}|
| `#[path = "x.rs"]` | `M` | Get module from non-standard file. {{ ref(page="items/modules.html#the-path-attribute") }}|
| `#[diagnostic::on_unimplemented]` | `X` | Give better error messages when trait not implemented. {{ rfc(page="3368-diagnostic-attribute-namespace.html") }}|

{{ tablesep() }}

| Codegen | On | Explanation |
|-------|---|-------------|
| `#[cold]` | `F` | Hint that function probably isn't going to be called. {{ ref(page="attributes/codegen.html#the-cold-attribute") }}|
| `#[inline]` | `F` | Nicely suggest compiler should inline function at call sites. {{ ref(page="attributes/codegen.html#the-inline-attribute") }}|
| `#[inline(always)]` | `F` | Emphatically threaten compiler to inline call, or else. {{ ref(page="attributes/codegen.html#the-inline-attribute") }}|
| `#[inline(never)]` | `F` | Instruct compiler to feel sad if it still inlines the function. {{ ref(page="attributes/codegen.html#the-inline-attribute") }} |
| `#[repr(X)]`<sup>1</sup>  | `T`  | Use another representation instead of the default **`rust`** {{ ref(page="type-layout.html#the-default-representation") }} one: |
| `#[target_feature(enable="x")]` | `F` | Enable CPU feature (e.g., `avx2`) for code of `unsafe fn`. {{ ref(page="attributes/codegen.html#the-target_feature-attribute") }}|
| `#[track_caller]` | `F` | Allows `fn` to find **`caller`**{{ std(page="core/panic/struct.Location.html#method.caller") }} for better panic messages. {{ ref(page="attributes/codegen.html#the-track_caller-attribute") }}|
| {{ tab() }} `#[repr(C)]` | `T`  | Use a C-compatible (f. FFI), predictable (f. `transmute`) layout. {{ ref(page="type-layout.html#the-c-representation") }}|
| {{ tab() }} `#[repr(C, u8)]` | `enum`  | Give `enum` discriminant the specified type. {{ ref(page="type-layout.html#the-c-representation") }}|
| {{ tab() }} `#[repr(transparent)]` | `T`  | Give single-element type same layout as contained field. {{ ref(page="type-layout.html#the-transparent-representation") }}|
| {{ tab() }} `#[repr(packed(1))]` | `T`  | Lower align. of struct and contained fields, mildly UB prone. {{ ref(page="type-layout.html#the-alignment-modifiers") }}|
| {{ tab() }} `#[repr(align(8))]` | `T`  | Raise alignment of struct to given value, e.g., for SIMD types. {{ ref(page="type-layout.html#the-alignment-modifiers") }}|

<!-- {{ tablesep() }}

| Representation | On | Explanation |
|-------|---|-------------|
| `-` | `T`  | In absence of `#[repr]` the **`rust` representation** is used {{ ref(page="type-layout.html#the-default-representation") }} |
| `#[repr(C)]` | `T`  | Use a predictable, C-compatible representation. {{ ref(page="type-layout.html#the-c-representation") }}|
| `#[repr(C, u8)]` | `enum`  | Give `enum` discriminant the specified type. {{ ref(page="type-layout.html#the-c-representation") }}|
| `#[repr(transparent)]` | `T`  | Give single-element type same layout as contained field. {{ ref(page="type-layout.html#the-transparent-representation") }}|
| `#[repr(packed(1))]` | `T`  | Lower alignment of struct and contained fields, mildly UB prone. {{ ref(page="type-layout.html#the-alignment-modifiers") }}|
| `#[repr(align(8))]` | `T`  | Raise alignment of struct to given value, e.g., for SIMD types. {{ ref(page="type-layout.html#the-alignment-modifiers") }}| -->

<footnotes>

<sup>1</sup> Some representation modifiers can be combined, e.g., `#[repr(C, packed(1))]`.

</footnotes>

{{ tablesep() }}

| Linking | On | Explanation |
|-------|---|-------------|
| `#[unsafe(no_mangle)]` | `*` | Use item name directly as symbol name, instead of mangling.  {{ ref(page="abi.html#the-no_mangle-attribute") }}|
| `#[unsafe(export_name = "foo")]` | `FS` | Export a `fn` or `static` under a different name. {{ ref(page="abi.html#the-export_name-attribute") }}|
| `#[unsafe(link_section = ".x")]` | `FS`  | Section name of object file where item should be placed. {{ ref(page="abi.html#the-link_section-attribute") }}|
| `#[link(name="x", kind="y")]` | `X`  | Native lib to link against when looking up symbol. {{ ref(page="items/external-blocks.html#the-link-attribute") }}|
| `#[link_name = "foo"]` | `F`  | Name of symbol to search for resolving `extern fn`. {{ ref(page="items/external-blocks.html#the-link_name-attribute") }}|
| `#[no_link]` | `X` | Don't link `extern crate` when only wanting macros. {{ ref(page="items/extern-crates.html#the-no_link-attribute") }}|
| `#[used]` | `S`  | Don't optimize away `static` variable despite it looking unused. {{ ref(page="abi.html#the-used-attribute") }}|



</fixed-3-column>

</div></panel></tab>




<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-3" name="tab-group-preprocessing">
<label for="tab-preprocessing-3"><b><code>#[quality]</code></b></label>
<panel><div class="color-header undefined-color-3">

Attributes used by Rust tools to improve code quality:

<fixed-3-column  class="color-header special_example">

| Code Patterns | On | Explanation |
|-------|---|-------------|
| `#[allow(X)]` | `*` | Instruct `rustc` / `clippy` to ign. class `X` of possible issues. {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[expect(X)]` <sup>1</sup> | `*` | Warn if a lint doesn't trigger. {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[warn(X)]` <sup>1</sup> | `*` |  … emit a warning, mixes well with `clippy` lints. {{ hot() }} {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[deny(X)]` <sup>1</sup> | `*` |  … fail compilation. {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[forbid(X)]` <sup>1</sup> | `*` | … fail compilation and prevent subsequent `allow` overrides. {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[deprecated = "msg"]` | `*` | Let your users know you made a design mistake. {{ ref(page="diagnostics.html#the-deprecated-attribute") }}|
| `#[must_use = "msg"]` | `FTX` |  Makes compiler check return value is _processed_ by caller. {{ hot() }} {{ ref(page="attributes/diagnostics.html#the-must_use-attribute") }}|

<footnotes>

<sup>1</sup> {{ opinionated() }} There is some debate which one is the _best_ to ensure high quality crates. Actively maintained multi-dev crates probably benefit from more aggressive `deny` or `forbid` lints; less-regularly updated ones probably more from conservative use of `warn` (as future compiler or `clippy` updates may suddenly break otherwise working code with minor issues).

</footnotes>

{{ tablesep() }}

</fixed-3-column>

<fixed-3-column  class="color-header special_example">

| Tests | On | Explanation |
|-------|---|-------------|
| `#[test]` | `F` | Marks the function as a test, run with `cargo test`. {{ hot() }} {{ ref(page="attributes/testing.html#the-test-attribute") }}|
| `#[ignore = "msg"]` | `F` | Compiles but does not execute some `#[test]` for now. {{ ref(page="attributes/testing.html#the-ignore-attribute") }}|
| `#[should_panic]` | `F` | Test must `panic!()` to actually succeed. {{ ref(page="attributes/testing.html#the-ignore-attribute") }}|
| `#[bench]` | `F` | Mark function in `bench/` as benchmark for `cargo bench`. {{ experimental() }} {{ ref(page="") }}|

{{ tablesep() }}


| Formatting | On | Explanation |
|-------|---|-------------|
| `#[rustfmt::skip]` |  `*` | Prevent `cargo fmt` from cleaning up item. {{ link(url="https://github.com/rust-lang/rustfmt") }}|
| `#![rustfmt::skip::macros(x)]` |  `CM` | … from cleaning up macro `x`. {{ link(url="https://github.com/rust-lang/rustfmt") }}|
| `#![rustfmt::skip::attributes(x)]` |  `CM` | … from cleaning up attribute `x`. {{ link(url="https://github.com/rust-lang/rustfmt") }}|

</fixed-3-column>

{{ tablesep() }}

<fixed-3-column class="color-header special_example extra-wide">


| Documentation | On | Explanation |
|-------|---|-------------|
| `#[doc = "Explanation"]` | `*` | Same as adding a `///` doc comment. {{ link(url="https://doc.rust-lang.org/rustdoc/the-doc-attribute.html") }} |
| `#[doc(alias = "other")]` | `*` | Provide other name for search in docs. {{ link(url="https://github.com/rust-lang/rust/issues/50146") }} |
| `#[doc(hidden)]` | `*` | Prevent item from showing up in docs. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#hidden") }} |
| `#![doc(html_favicon_url = "")]` | `C` | Sets the `favicon` for the docs. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_favicon_url") }}|
| `#![doc(html_logo_url  = "")]` | `C` | The logo used in the docs. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_logo_url") }}|
| `#![doc(html_playground_url  = "")]` | `C` | Generates `Run` buttons and uses given service. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_playground_url") }}|
| `#![doc(html_root_url  = "")]` | `C` | Base URL for links to external crates. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_root_url") }}|
| `#![doc(html_no_source)]` | `C` | Prevents source from being included in docs. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_no_source") }}|

<!-- | `#![doc(issue_tracker_base_url  = "")]` | `C` | Mostly for `std::`, where issue numbers link. {{ link(url="https://doc.rust-lang.org/rustdoc/the-doc-attribute.html#issue_tracker_base_url") }}| -->

</fixed-3-column>




</div></panel></tab>




<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-8" name="tab-group-preprocessing">
<label for="tab-preprocessing-8"><b><code>#[macros]</code></b></label>
<panel><div class="color-header undefined-color-3">

<fixed-3-column  class="color-header special_example">

Attributes related to the creation and use of macros:

| Macros By Example | On | Explanation |
|-------|---|-------------|
| `#[macro_export]` |  `!` | Export `macro_rules!` as `pub` on crate level {{ ref(page="macros-by-example.html#path-based-scope") }}|
| `#[macro_use]` | `MX` | Let macros persist past mod.; or import from `extern crate`. {{ ref(page="macros-by-example.html#the-macro_use-attribute") }}|

{{ tablesep() }}

| Proc Macros | On | Explanation |
|-------|---|-------------|
| `#[proc_macro]` | `F`  | Mark `fn` as **function-like** procedural _m._ callable as `m!()`. {{ ref(page="procedural-macros.html#function-like-procedural-macros") }}|
| `#[proc_macro_derive(Foo)]` | `F`  | Mark `fn` as **derive macro** which can `#[derive(Foo)]`. {{ ref(page="procedural-macros.html#derive-macros") }}|
| `#[proc_macro_attribute]` | `F`  | Mark `fn` as **attribute macro** for new `#[x]`. {{ ref(page="procedural-macros.html#attribute-macros") }}|

{{ tablesep() }}

| Derives | On | Explanation |
|-------|---|-------------|
| `#[derive(X)]` | `T` | Let some proc macro provide a goodish `impl` of `trait X`. {{ hot() }} {{ ref(page="") }}|

<!-- | `#[derive(Eq)]` |  | xxx{{ ref(page="") }}|
| `#[derive(PartialEq)]` | |  xxx|
| `#[derive(Ord)]` | |  xxx|
| `#[derive(PartialOrd)]` | |  xxx|
| `#[derive(Clone)]` | |  xxx|
| `#[derive(Copy)]` | |  xxx|
| `#[derive(Hash)]` | |  xxx|
| `#[derive(Default)]` | |  xxx|
| `#[derive(Debug)]` | |  xxx| -->


</fixed-3-column>


</div></panel></tab>






<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-5" name="tab-group-preprocessing">
<label for="tab-preprocessing-5"><b><code>#[cfg]</code></b></label>
<panel><div class="color-header undefined-color-3">

Attributes governing conditional compilation:

<fixed-3-column class="color-header special_example extra-wide">

| Config Attributes | On | Explanation |
|-------|---|-------------|
| `#[cfg(X)]` | `*` | Include item if configuration `X` holds. {{ ref(page="conditional-compilation.html#the-cfg-attribute") }}|
| `#[cfg(all(X, Y, Z))]` | `*` | Include item if all options hold. {{ ref(page="conditional-compilation.html#conditional-compilation") }}|
| `#[cfg(any(X, Y, Z))]` | `*` | Include item if at least one option holds. {{ ref(page="conditional-compilation.html#conditional-compilation") }}|
| `#[cfg(not(X))]` | `*` | Include item if `X` does not hold. {{ ref(page="conditional-compilation.html#conditional-compilation") }}|
| `#[cfg_attr(X, foo = "msg")]` | `*` | Apply `#[foo = "msg"]` if configuration `X` holds. {{ ref(page="conditional-compilation.html#the-cfg_attr-attribute") }}|

{{ tablesep() }}

> ⚠️ Note, options can generally be set multiple times, i.e., the same key can show up with multiple values. One can expect `#[cfg(target_feature = "avx")]` **and** `#[cfg(target_feature = "avx2")]` to be true at the same time.

{{ tablesep() }}

| Known Options | On | Explanation |
|-------|---|-------------|
| `#[cfg(debug_assertions)]` | `*` | Whether `debug_assert!()` & co. would panic. {{ ref(page="conditional-compilation.html#debug_assertions") }}|
| `#[cfg(feature = "foo")]` | `*` | When your crate was compiled with _f._ `foo`. {{ hot() }} {{ ref(page="conditional-compilation.html#conditional-compilation") }}|
| `#[cfg(target_arch = "x86_64")]` | `*` | The CPU architecture crate is compiled for. {{ ref(page="conditional-compilation.html#target_arch") }}|
| `#[cfg(target_env = "msvc")]` | `*` | How DLLs and functions are interf. with on OS. {{ ref(page="conditional-compilation.html#target_env") }}|
| `#[cfg(target_endian = "little")]` | `*` | Main reason your new zero-cost prot. fails. {{ ref(page="conditional-compilation.html#target_endian") }}|
| `#[cfg(target_family = "unix")]` | `*` | Family operating system belongs to. {{ ref(page="conditional-compilation.html#target_family") }}|
| `#[cfg(target_feature = "avx")]` | `*` | Whether a particular class of instructions is avail. {{ ref(page="conditional-compilation.html#target_feature") }}|
| `#[cfg(target_os = "macos")]` | `*` | Operating system your code will run on. {{ ref(page="conditional-compilation.html#target_os") }}|
| `#[cfg(target_pointer_width = "64")]` | `*` | How many bits ptrs, `usize` and words have. {{ ref(page="conditional-compilation.html#target_pointer_width") }}|
| `#[cfg(target_vendor = "apple")]` | `*` |  Manufacturer of target. {{ ref(page="conditional-compilation.html#target_vendor") }}|
| `#[cfg(panic = "unwind")]` | `*` | Whether `unwind` or `abort` will happen on panic. {{ todo() }}|
| `#[cfg(proc_macro)]` | `*` | Whether crate compiled as proc macro. {{ ref(page="conditional-compilation.html#proc_macro") }}|
| `#[cfg(test)]` | `*` | Whether compiled with `cargo test`. {{ hot() }} {{ ref(page="conditional-compilation.html#test") }}|

</fixed-3-column>



</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-6" name="tab-group-preprocessing">
<label for="tab-preprocessing-6"><b><code>build.rs</code></b></label>
<panel><div class="color-header undefined-color-3">

Environment variables and outputs related to the pre-build script. Consider **build-rs**{{ link(url="https://docs.rs/build-rs/0.1.2/build/") }} instead.

<fixed-2-column class="color-header special_example extra-wide">

| Input Environment | Explanation {{ link(url="https://doc.rust-lang.org/cargo/reference/environment-variables.html") }} |
|-------|-------------|
| `CARGO_FEATURE_X` |  Environment variable set for each feature `x` activated.  |
| {{ tab() }} `CARGO_FEATURE_SOMETHING` |  If feature `something` were enabled. |
| {{ tab() }} `CARGO_FEATURE_SOME_FEATURE` | If _f._ `some-feature` were enabled; dash `-` converted to `_`. |
| `CARGO_CFG_X` | Exposes cfg's; joins mult. opts. by `,` and converts `-` to `_`.|
| {{ tab() }} `CARGO_CFG_TARGET_OS=macos` |  If `target_os` were set to `macos`. |
| {{ tab() }} `CARGO_CFG_TARGET_FEATURE=avx,avx2` |  If `target_feature` were set to `avx` and `avx2`. |
| `OUT_DIR` |  Where output should be placed. |
| `TARGET` |  Target triple being compiled for. |
| `HOST` |  Host triple (running this build script). |
| `PROFILE` |  Can be `debug` or `release`. |

<footnotes>

Available in `build.rs` via `env::var()?`. List not exhaustive.

</footnotes>

</fixed-2-column>

<fixed-2-column class="color-header special_example extra-wide">

{{ tablesep() }}

| Output String | Explanation {{ link(url="https://doc.rust-lang.org/cargo/reference/build-scripts.html") }} |
|-------|-------------|
| `cargo::rerun-if-changed=PATH` | (Only) run this `build.rs` again if `PATH` changed. |
| `cargo::rerun-if-env-changed=VAR` | (Only) run this `build.rs` again if environment `VAR` changed. |
| `cargo::rustc-cfg=KEY[="VALUE"]` | Emit given `cfg` option to be used for later compilation. |
| `cargo::rustc-cdylib-link-arg=FLAG ` | When building a `cdylib`, pass linker flag. |
| `cargo::rustc-env=VAR=VALUE ` | Emit var accessible via `env!()` in crate during compilation. |
| `cargo::rustc-flags=FLAGS` | Add special flags to compiler. {{ todo() }} |
| `cargo::rustc-link-lib=[KIND=]NAME` | Link native library as if via `-l` option. |
| `cargo::rustc-link-search=[KIND=]PATH` | Search path for native library as if via `-L` option. |
| `cargo::warning=MESSAGE` | Emit compiler warning. |

<footnotes>

Emitted from `build.rs` via `println!()`. List not exhaustive.

</footnotes>

</fixed-2-column>

</div></panel></tab>


</tabs>


<footnotes>

For the _On_ column in attributes: <br>
`C` means on crate level (usually given as `#![my_attr]` in the top level file). <br>
`M` means on modules. <br>
`F` means on functions. <br>
`S` means on static. <br>
`T` means on types. <br>
`X` means something special. <br>
`!` means on macros. <br>
`*` means on almost any item. <br>

</footnotes>
