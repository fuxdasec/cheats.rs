+++
title = "Miscellaneous"
description = "Additional Rust syntax and common operators that do not fit the other language construct groups."
weight = 14
template = "topic.html"

[extra]
seo_title = "Miscellaneous"
anchor = "miscellaneous"
previous = "/language-constructs/documentation/"
previous_title = "Documentation"
next = "/behind-the-scenes/abstract-machine/"
next_title = "The Abstract Machine"
print = true
+++
These sigils did not fit any other category but are good to know nonetheless.

<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `!` | Always empty **never type**. {{ book(page="ch19-04-advanced-types.html#the-never-type-that-never-returns") }} {{ ex(page="fn/diverging.html#diverging-functions") }} {{ std(page="std/primitive.never.html") }} {{ ref(page="types.html#never-type") }} |
| {{ tab() }} `fn f() -> ! {}` | Function that never ret.; compat. with any _ty._ e.g., `let x: u8 = f();` |
| {{ tab() }} `fn f() -> Result<(), !> {}` | Function that must return `Result` but signals it can never `Err`. {{ experimental() }} |
| {{ tab() }} `fn f(x: !) {}` | Function that exists, but can never be called. Not very useful. {{ esoteric() }} {{ experimental() }} |
| `_` | Unnamed **wildcard** {{ ref(page="patterns.html#wildcard-pattern")}} variable binding, e.g., <code>&vert;x, _&vert; {}</code>.|
| {{ tab() }} `let _ = x;`  | Unnamed assign. is no-op, does **not** {{ bad() }} move out `x` or preserve scope! |
| {{ tab() }} `_ = x;`  | You can assign _anything_ to `_` without `let`, i.e.,  `_ = ignore_rval();` {{ hot() }} |
| `_x` | Variable binding that won't emit _unused variable_ warnings. |
| `1_234_567` | Numeric separator for visual clarity. |
| `1_u8` | Type specifier for **numeric literals** {{ ex(page="types/literals.html#literals") }} {{ ref(page="tokens.html#number-literals") }}  (also `i8`, `u16`, &hellip;). |
| `0xBEEF`, `0o777`, `0b1001`  | Hexadecimal (`0x`), octal (`0o`) and binary (`0b`) integer literals. |
| `12.3e4`, `1E-8`  | **Scientific notation** for floating-point literals. {{ref(page="tokens.html#floating-point-literals")}} |
| `r#foo` | A **raw identifier** {{ book(page="appendix-01-keywords.html#raw-identifiers") }} {{ ex(page="compatibility/raw_identifiers.html#raw-identifiers") }} for edition compatibility. {{ esoteric() }} |
| `'r#a` | A **raw lifetime label** {{ todo() }} for edition compatibility. {{ esoteric() }} |
| `x;` | **Statement** {{ ref(page="statements.html")}} terminator, _c_. **expressions** {{ ex(page="expression.html") }} {{ ref(page="expressions.html")}} |

</fixed-2-column>




## Common Operators

Rust supports most operators you would expect (`+`, `*`, `%`, `=`, `==`, &hellip;), including **overloading**. {{ std(page="std/ops/index.html")}} Since they behave no differently in Rust we do not list them here.
