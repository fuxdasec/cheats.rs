+++
title = "Strings & Chars"
description = "Rust string, byte string, character, escape, and raw string literal syntax."
weight = 12
template = "topic.html"

[extra]
seo_title = "Strings & Chars"
anchor = "strings-chars"
previous = "/language-constructs/higher-ranked-items/"
previous_title = "Higher-Ranked Items"
next = "/language-constructs/documentation/"
next_title = "Documentation"
print = true
+++
Rust has several ways to create textual values.


<fixed-2-column>

| Example | Explanation |
|--------|-------------|
| `"..."` | **String literal**, {{ ref(page="tokens.html#string-literals")}}<sup>, 1</sup> a UTF-8 `&'static str`, {{ std(page="std/primitive.str.html") }} supporting these escapes:  |
| {{ tab() }} `"\n\r\t\0\\"` | **Common escapes** {{ ref(page="tokens.html#ascii-escapes") }}, e.g., `"\n"` becomes _new line_. |
| {{ tab() }} `"\x36"` | **ASCII _e._** {{ ref(page="tokens.html#ascii-escapes") }} up to `7f`, e.g., `"\x36"` would become `6`. |
| {{ tab() }} `"\u{7fff}"` | **Unicode _e._** {{ ref(page="tokens.html#unicode-escapes") }} up to 6 digits, e.g., `"\u{7fff}"` becomes `翿`. |
| `r"..."` | **Raw string literal**. {{ ref(page="tokens.html#raw-string-literals")}}<sup>, 1</sup>UTF-8, but won't interpret any escape above. |
| `r#"..."#` | Raw string literal, UTF-8, but can also contain `"`. Number of `#` can vary.|
| `c"..."` | **C string literal**, {{ ref(page="tokens.html#c-string-literals")}} a NUL-terminated `&'static CStr`, {{ std(page="std/ffi/struct.CStr.html") }} for FFI. {{ edition(ed="1.77+")}}  |
| `cr"..."`, `cr#"..."#` | Raw C string literal, combination analog to above.|
| `b"..."` | **Byte string literal**; {{ ref(page="tokens.html#byte-and-byte-string-literals")}}<sup>, 1</sup> constructs ASCII-only `&'static [u8; N]`. |
| `br"..."`, `br#"..."#` | Raw byte string literal, combination analog to above.|
| `b'x'` | ASCII **byte literal**, {{ ref(page="tokens.html#byte-literals")}} a single `u8` byte.  |
| `'🦀'` | **Character literal**, {{ ref(page="tokens.html#character-and-string-literals")}} fixed 4 byte unicode '**char**'. {{ std(page="std/primitive.char.html") }} |

<footnotes>

<sup>1</sup> Supports multiple lines out of the box. Just keep in mind `Debug`{{ below(target="/standard-library/string-output/#string-output") }} (e.g., `dbg!(x)` and `println!("{x:?}")`) might render them as `\n`, while `Display`{{ below(target="/standard-library/string-output/#string-output") }} (e.g., `println!("{x}")`) renders them _proper_.

</footnotes>


</fixed-2-column>
