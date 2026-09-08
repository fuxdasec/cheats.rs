+++
title = "Macros & Attributes"
description = "Rust macro invocation, macro definitions, attributes, derives, and conditional compilation syntax."
weight = 8
template = "topic.html"

[extra]
seo_title = "Macros & Attributes"
anchor = "macros-attributes"
previous = "/language-constructs/type-aliases-and-casts/"
previous_title = "Type Aliases and Casts"
next = "/language-constructs/pattern-matching/"
next_title = "Pattern Matching"
print = true
+++
Code generation constructs expanded before the actual compilation happens.

<fixed-2-column>

| Example |  Explanation |
|---------|---------|
| `m!()` |  **Macro** {{ book(page="ch19-06-macros.html") }} {{std(page="std/index.html#macros")}} {{ ref(page="macros.html") }} invocation, also `m!{}`, `m![]` (depending on macro). |
| `#[attr]`  | Outer **attribute**, {{ex(page="attribute.html")}} {{ref(page="attributes.html")}} annotating the following item. |
| `#![attr]` | Inner attribute, annotating the _upper_, surrounding item. |

</fixed-2-column>

{{ tablesep() }}

<fixed-2-column class="color-header special_example">

| Inside Macros <sup>1</sup> |  Explanation |
|---------|---------|
| `$x:ty`  | Macro capture, the `:ty` **fragment specifier** {{ ref(page="macros-by-example.html#metavariables") }} <sup>,2</sup> declares what `$x` may be. |
| `$x` |  Macro substitution, e.g., use the captured `$x:ty` from above. |
| `$(x),*` | Macro **repetition** {{ ref(page="macros-by-example.html#repetitions") }} _zero or more times_.|
| {{ tab() }} `$(x),+` | Same, but _one or more times_. |
| {{ tab() }} `$(x)?` | Same, but _zero or one time_ (separator doesn't apply). |
| {{ tab() }} `$(x)<<+` | In fact separators other than `,` are also accepted. Here: `<<`. |

</fixed-2-column>

<footnotes>

<sup>1</sup> Applies to **'macros by example'**. {{ ref(page="macros-by-example.html") }} <br>
<sup>2</sup> See [**Tooling Directives**](/tooling/tooling-directives/#tooling-directives) below for all fragment specifiers.

</footnotes>
