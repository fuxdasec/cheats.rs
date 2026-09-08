+++
title = "Organizing Code"
description = "Rust modules, imports, visibility, crates, extern blocks, and code organization syntax."
weight = 6
template = "topic.html"

[extra]
seo_title = "Organizing Code"
anchor = "organizing-code"
previous = "/language-constructs/control-flow/"
previous_title = "Control Flow"
next = "/language-constructs/type-aliases-and-casts/"
next_title = "Type Aliases and Casts"
print = true
+++
Segment projects into smaller units and minimize dependencies.

<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `mod m {}`  | Define a **module**, {{ book(page="ch07-02-defining-modules-to-control-scope-and-privacy.html") }} {{ ex(page="mod.html#modules") }} {{ ref(page="items/modules.html#modules") }} get definition from inside `{}`. {{ below(target="/tooling/project-anatomy/#project-anatomy") }} |
| `mod m;`  | Define a module, get definition from `m.rs` or `m/mod.rs`. {{ below(target="/tooling/project-anatomy/#project-anatomy") }}|
| `a::b` | Namespace **path** {{ ex(page="mod/use.html") }} {{ ref(page="paths.html")}} to element `b` within `a` (`mod`, `enum`, &hellip;). |
| {{ tab() }} `::b` | Search `b` in **crate root** {{ edition(ed="'15") }} {{ ref(page="glossary.html#crate")}} or **ext. prelude**; {{ edition(ed="'18") }} {{ ref(page="names/preludes.html#extern-prelude")}} **global path**. {{ ref(page="paths.html#path-qualifiers")}} {{ deprecated() }}  |
| {{ tab() }} `crate::b` | Search `b` in crate root. {{ edition(ed="'18") }} |
| {{ tab() }} `self::b`  | Search `b` in current module. |
| {{ tab() }} `super::b`  | Search `b` in parent module. |
| `use a::b;`  | **Use** {{ ex(page="mod/use.html#the-use-declaration") }} {{ ref(page="items/use-declarations.html") }} `b` directly in this scope without requiring `a` anymore. |
| `use a::{b, c};` | Same, but bring `b` and `c` into scope. |
| `use a::b as x;`  | Bring `b` into scope but name `x`, like `use std::error::Error as E`. |
| `use a::b as _;`  | Bring `b` anon. into scope, useful for traits with conflicting names. |
| `use a::*;`  | Bring everything from `a` in, only recomm. if `a` is some **prelude**. {{ std(page="std/prelude/index.html#other-preludes")}}  {{ link(url="https://stackoverflow.com/questions/36384840/what-is-the-prelude" ) }} |
| `pub use a::b;`  | Bring `a::b` into scope and reexport from here. |
| `pub T`  | "Public if parent path is public" **visibility** {{ book(page="ch07-02-defining-modules-to-control-scope-and-privacy.html") }} {{ ref(page="visibility-and-privacy.html")}} for `T`.  |
| {{ tab() }} `pub(crate) T` | Visible at most<sup>1</sup> in current crate.  |
| {{ tab() }} `pub(super) T`  | Visible at most<sup>1</sup> in parent.  |
| {{ tab() }} `pub(self) T`  | Visible at most<sup>1</sup> in current module (default, same as no `pub`).  |
| {{ tab() }} `pub(in a::b) T`  | Visible at most<sup>1</sup> in ancestor `a::b`.  |
| `extern crate a;` | Declare dependency on external **crate**; {{ book(page="ch02-00-guessing-game-tutorial.html#using-a-crate-to-get-more-functionality") }} {{ ref(page="items/extern-crates.html#extern-crate-declarations") }} {{ deprecated() }} just `use a::b` in {{ edition(ed="'18") }}.  |
| `extern "C" {}`  | _Declare_ external dependencies and ABI (e.g., `"C"`) from **FFI**. {{ book(page="ch19-01-unsafe-rust.html#using-extern-functions-to-call-external-code") }} {{ ex(page="std_misc/ffi.html#foreign-function-interface") }} {{ nom(page="ffi.html#calling-foreign-functions") }} {{ ref(page="items/external-blocks.html#external-blocks") }} |
| `extern "C" fn f() {}`  | _Define_ function to be exported with ABI (e.g., `"C"`) to FFI. |

</fixed-2-column>

<footnotes>

<sup>1</sup> Items in child modules always have access to any item, regardless if `pub` or not.

</footnotes>
