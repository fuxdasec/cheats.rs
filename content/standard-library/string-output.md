+++
title = "String Output"
description = "Rust formatting, printing, Debug, Display, format arguments, and string output APIs."
weight = 29
template = "topic.html"

[extra]
seo_title = "String Output"
anchor = "string-output"
previous = "/standard-library/string-conversions/"
previous_title = "String Conversions"
next = "/tooling/project-anatomy/"
next_title = "Project Anatomy"
print = true
+++
How to convert types into a `String`, or output them.

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-strop-1" name="tab-group-strop" checked>
<label for="tab-strop-1"><b>APIs</b></label>
<panel><div class="color-header undefined-color-3">

Rust has, among others, these APIs to convert types to stringified output, collectively called _format_ macros:

| Macro | Output | Notes |
| --- | --- | --- |
|`format!(fmt)` | `String` | Bread-and-butter "to `String`" converter. |
|`print!(fmt)`| Console | Writes to standard output. |
|`println!(fmt)`| Console | Writes to standard output. |
| `eprint!(fmt)`| Console | Writes to standard error. |
|`eprintln!(fmt)`| Console | Writes to standard error. |
|`write!(dst, fmt)` | Buffer | Don't forget to also `use std::io::Write;` |
|`writeln!(dst, fmt)` | Buffer | Don't forget to also `use std::io::Write;` |

{{ tablesep() }}

| Method | Notes |
| --- | --- |
|`x.to_string()` {{ std(page="std/string/trait.ToString.html") }} | Produces `String`, implemented for any `Display` type. |

{{ tablesep() }}

Here `fmt` is string literal such as `"hello {}"`, that specifies output (compare "Formatting" tab) and additional parameters.


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-strop-2" name="tab-group-strop">
<label for="tab-strop-2"><b>Printable Types</b></label>
<panel><div class="color-header undefined-color-3">

In `format!` and friends, types convert via trait `Display` `"{}"` {{ std(page="std/fmt/trait.Display.html") }} or `Debug` `"{:?}"` {{ std(page="std/fmt/trait.Debug.html") }} , non exhaustive list:

| Type | Implements |  |
| --- | --- | --- |
|`String`| `Debug, Display` | |
|`CString`| `Debug` | |
|`OsString`| `Debug` | |
|`PathBuf`| `Debug` |  |
|`Vec<u8>` | `Debug` | |
|`&str`|`Debug, Display` | |
|`&CStr`|`Debug` | |
|`&OsStr`| `Debug` | |
|`&Path`| `Debug` | |
|`&[u8]` |`Debug` | |
|`bool` |`Debug, Display` | |
|`char` |`Debug, Display` | |
|`u8` &hellip; `i128` |`Debug, Display` | |
|`f32`, `f64` |`Debug, Display` | |
|`!` |`Debug, Display` | |
|`()` |`Debug` | |

{{ tablesep() }}

In short, pretty much everything is `Debug`; more _special_ types might need special handling or conversion {{ above(target="/standard-library/string-conversions/#string-conversions" ) }} to `Display`.

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-strop-3" name="tab-group-strop">
<label for="tab-strop-3"><b>Formatting</b></label>
<panel><div>

Each argument designator in format macro is either empty `{}`, `{argument}`, or follows a basic [**syntax**](https://doc.rust-lang.org/std/fmt/index.html#syntax):


```
{ [argument] ':' [[fill] align] [sign] ['#'] [width [$]] ['.' precision [$]] [type] }
```

<div class="color-header undefined-color-3">

| Element |  Meaning |
|---------| ---------|
| `argument` |  Number (`0`, `1`, …), variable {{ edition(ed="'21") }} or name,{{ edition(ed="'18") }} e.g., `print!("{x}")`. |
| `fill` | The character to fill empty spaces with (e.g., `0`), if `width` is specified. |
| `align` | Left (`<`), center (`^`), or right (`>`), if width is specified. |
| `sign` | Can be `+` for sign to always be printed. |
| `#` | [Alternate formatting](https://doc.rust-lang.org/std/fmt/index.html#sign0), e.g., prettify `Debug`{{ std(page="std/fmt/trait.Debug.html") }} formatter `?` or prefix hex with `0x`. |
| `width` | Minimum width (&geq; 0), padding with `fill` (default to space). If starts with `0`, zero-padded. |
| `precision` | Decimal digits (&geq; 0) for numerics, or max width for non-numerics. |
| `$` | Interpret `width` or `precision` as argument identifier instead to allow for dynamic formatting. |
| **`type`** | `Debug`{{ std(page="std/fmt/trait.Debug.html") }} (`?`) formatting, hex (`x`), binary (`b`), octal (`o`), pointer (`p`), exp (`e`) … [see more](https://doc.rust-lang.org/std/fmt/index.html#traits). |

</div>


{{ tablesep() }}


<div class="color-header undefined-color-3">

| Format Example | Explanation |
|---------|-------------|
| `{}` | Print the next argument using `Display`.{{ std(page="std/fmt/trait.Display.html") }} |
| `{x}` | Same, but use variable `x` from scope. {{ edition(ed="'21") }} |
| `{:?}` | Print the next argument using `Debug`.{{ std(page="std/fmt/trait.Debug.html") }} |
| `{2:#?}` | Pretty-print the 3<sup>rd</sup> argument with `Debug`{{ std(page="std/fmt/trait.Debug.html") }} formatting. |
| `{val:^2$}` | Center the `val` named argument, width specified by the 3<sup>rd</sup> argument. |
| `{:<10.3}` | Left align with width 10 and a precision of 3.|
| `{val:#x}` | Format `val` argument as hex, with a leading `0x` (alternate format for `x`). |

</div>

{{ tablesep() }}


<div class="color-header undefined-color-3">

| Full Example | Explanation |
|---------|-------------|
| `println!("{}", x)` | Print `x` using `Display`{{ std(page="std/fmt/trait.Display.html") }} on std. out and append new line. {{ edition(ed="'15") }} {{ deprecated() }} |
| `println!("{x}")` | Same, but use variable `x` from scope. {{ edition(ed="'21") }}  |
| `format!("{a:.3} {b:?}")` | Convert `a` with 3 digits, add space, `b` with `Debug` {{ std(page="std/fmt/trait.Debug.html") }}, return `String`.  {{ edition(ed="'21") }} |

</div>


</div></panel></tab>


</tabs>

{{ tablesep() }}

