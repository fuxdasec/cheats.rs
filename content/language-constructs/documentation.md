+++
title = "Documentation"
description = "Rust documentation comments, intra-doc links, examples, and rustdoc syntax."
weight = 13
template = "topic.html"

[extra]
seo_title = "Documentation"
anchor = "documentation"
previous = "/language-constructs/strings-chars/"
previous_title = "Strings & Chars"
next = "/language-constructs/miscellaneous/"
next_title = "Miscellaneous"
print = true
+++
Debuggers hate him. Avoid bugs with this one weird trick.


<fixed-2-column>

| Example | Explanation |
|--------|-------------|
| `///` | Outer line **doc comment**,<sup>1</sup> {{ book(page="ch14-02-publishing-to-crates-io.html#making-useful-documentation-comments") }} {{ ex(page="meta/doc.html#documentation") }} {{ ref(page="comments.html#doc-comments")}} use these on ty., traits, fn's, &hellip; |
| `//!` | Inner line doc comment, mostly used at top of file. |
| `//` | Line comment, use these to document code flow or _internals_. |
| `/* … */` | Block comment. <sup>2</sup> {{ deprecated() }} |
| `/** … */` | Outer block doc comment. <sup>2</sup> {{ deprecated() }} |
| `/*! … */` | Inner block doc comment. <sup>2</sup> {{ deprecated() }} |

</fixed-2-column>

<footnotes>

<sup>1</sup> [Tooling Directives](/tooling/tooling-directives/#tooling-directives) outline what you can do inside doc comments. <br>
<sup>2</sup> Generally discouraged due to bad UX. If possible use equivalent line comment instead with IDE support.

</footnotes>
