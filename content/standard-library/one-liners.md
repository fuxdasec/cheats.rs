+++
title = "One-Liners"
description = "Useful Rust standard library snippets for common operations that are easy to forget."
weight = 23
template = "topic.html"

[extra]
seo_title = "One-Liners"
anchor = "one-liners"
previous = "/memory-layout/standard-library-types/"
previous_title = "Standard Library Types"
next = "/standard-library/thread-safety/"
next_title = "Thread Safety"
print = true
+++
Snippets that are common, but still easy to forget. See **Rust Cookbook** {{ link(url="https://rust-lang-nursery.github.io/rust-cookbook/") }} for more.


<!--
PRs for this section are very welcome. Idea is:
- Should be `std` only for now, no 3rd party libs (maybe exception for `rand`?)
- "Most people" should have encountered the problem
- Is not just a trival method on an 'obvious' struct (e.g., Sort a slice by `x.sort()` is probably too obvious.)
-->

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">


<tabs>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-2" name="tab-api-sized" checked>
<label for="tab-api-2"><b>Strings</b></label>
<panel><div class="color-header one-liners cheats">

| Intent | Snippet |
|---------|-------------|
| Concatenate strings (any `Display`{{ below(target="/standard-library/string-output/#string-output") }} that is).  {{ std(page="std/fmt/index.html") }} <sup>1</sup>  {{ edition(ed="'21") }} | `format!("{x}{y}")` |
| Append string (any `Display` to any `Write`).  {{ edition(ed="'21") }} {{ std(page="std/fmt/index.html#write") }} | `write!(x, "{y}")` |
| Split by separator pattern. {{ std(page="std/str/pattern/trait.Pattern.html") }} {{ link(url="https://stackoverflow.com/a/38138985") }} | `s.split(pattern)` |
| {{ tab() }} … with `&str` | `s.split("abc")` |
| {{ tab() }} … with `char` | `s.split('/')` |
| {{ tab() }} … with closure | `s.split(char::is_numeric)`|
| Split by whitespace.  {{ std(page="std/primitive.str.html#method.split_whitespace") }} | `s.split_whitespace()` |
| Split by newlines.  {{ std(page="std/primitive.str.html#method.lines") }}  | `s.lines()` |
| Split by regular expression. {{ link(url="https://docs.rs/regex/latest/regex/struct.Regex.html#method.split") }} <sup>2</sup> | ` Regex::new(r"\s")?.split("one two three")` |

<footnotes>

<sup>1</sup> Allocates; if `x` or `y` are not going to be used afterwards consider using `write!` or `std::ops::Add`.<br>
<sup>2</sup> Requires [regex](https://crates.io/crates/regex) crate.

</footnotes>


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-1" name="tab-api-sized">
<label for="tab-api-1"><b>I/O</b></label>
<panel><div class="color-header one-liners cheats">

| Intent | Snippet |
|---------|-------------|
| Create a new file {{ std(page="std/fs/struct.File.html#method.open") }} | `File::create(PATH)?`  |
| {{ tab() }}  Same, via OpenOptions | `OpenOptions::new().create(true).write(true).truncate(true).open(PATH)?` |
| Read file as `String` {{ std(page="std/fs/fn.read_to_string.html") }} | `read_to_string(path)?` |

<!-- <footnotes>

<sup>*</sup> We're a bit short on space here, <code>t</code> means true.

</footnotes> -->

</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-4" name="tab-api-sized">
<label for="tab-api-4"><b>Macros</b></label>
<panel><div class="color-header one-liners cheats">

| Intent | Snippet |
|---------|-------------|
| Macro w. variable arguments | `macro_rules! var_args { ($($args:expr),*) => {{ }} }` |
| {{ tab() }} Using `args`, e.g., calling `f` multiple times. | {{ tab() }} ` $( f($args); )*` |

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-5" name="tab-api-sized">
<label for="tab-api-5"><b>Transforms {{ hot() }}</b></label>
<panel><div class="color-header one-liners cheats">

| Starting Type | Resource |
|---------|-------------|
| `Option<T> -> …` | See the [Type-Based Cheat Sheet](https://upsuper.github.io/rust-cheatsheet/) |
| `Result<T, R> -> …` | See the [Type-Based Cheat Sheet](https://upsuper.github.io/rust-cheatsheet/) |
| `Iterator<Item=T> -> …` | See the [Type-Based Cheat Sheet](https://upsuper.github.io/rust-cheatsheet/) |
| `&[T] -> …` | See the [Type-Based Cheat Sheet](https://upsuper.github.io/rust-cheatsheet/) |
| `Future<T> -> …` | See the [Futures Cheat Sheet](https://rufflewind.com/img/rust-futures-cheatsheet.html) |

<!-- <footnotes>

<sup>*</sup> We're a bit short on space here, <code>t</code> means true.

</footnotes> -->

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-3" name="tab-api-sized">
<label for="tab-api-3"><b>Esoterics</b>{{ esoteric() }}</label>
<panel><div class="color-header one-liners cheats">

| Intent | Snippet |
|---------|-------------|
| Cleaner closure captures | <code>wants_closure({ let c = outer.clone(); move &vert;&vert; use_clone(c) })</code> |
| Fix inference in '`try`' closures | <code>iter.try_for_each(&vert;x&vert; { Ok::<(), Error>(()) })?;</code> |
| Iterate _and_ edit `&mut [T]` if `T` Copy. | `Cell::from_mut(mut_slice).as_slice_of_cells()` |
| Get subslice with length. | `&original_slice[offset..][..length]` |
| Canary so trait `T` is **dyn compatible**. {{ ref(page="items/traits.html#dyn-compatibility")}} | `const _: Option<&dyn T> = None;` |
| _Semver trick_ to unify types. {{ link(url="https://github.com/dtolnay/semver-trick") }} | `my_crate = "next.version"` in `Cargo.toml` + re-export types. |
| Use macro inside own crate. {{ link(url="https://users.rust-lang.org/t/use-macro-inside-proc-macro-crate/61095/4") }} | `macro_rules! internal_macro {}` with `pub(crate) use internal_macro;` |


</div></panel></tab>


</tabs>


</div></div>
