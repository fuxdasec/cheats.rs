+++
title = "Higher-Ranked Items"
description = "Higher-ranked Rust types, trait bounds, function pointers, closures, and lifetime relationships."
weight = 11
template = "topic.html"

[extra]
seo_title = "Higher-Ranked Items"
anchor = "higher-ranked-items"
previous = "/language-constructs/generics-constraints/"
previous_title = "Generics & Constraints"
next = "/language-constructs/strings-chars/"
next_title = "Strings & Chars"
print = true
+++
_Actual_ types and traits, abstract over something, usually lifetimes.

<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `for<'a>` | Marker for **higher-ranked bounds.** {{ nom(page="hrtb.html")}} {{ ref(page="trait-bounds.html#higher-ranked-trait-bounds")}} {{ esoteric() }} |
| {{ tab() }} `trait T: for<'a> R<'a> {}` | Any `S` that `impl T` would also have to fulfill `R` for any lifetime. |
| `fn(&'a u8)` | Function pointer type holding fn callable with **specific** lifetime `'a`. |
| `for<'a> fn(&'a u8)` | **Higher-ranked type**<sup>1</sup> {{ link(url="https://github.com/rust-lang/rust/issues/56105") }} holding fn call. with **any** _lt._; subtype{{ below(target="/working-with-types/type-conversions/#type-conversions") }} of above. |
| {{ tab() }} `fn(&'_ u8)` | Same; automatically expanded to type `for<'a> fn(&'a u8)`. |
| {{ tab() }} `fn(&u8)` | Same; automatically expanded to type `for<'a> fn(&'a u8)`. |
| `dyn for<'a> Fn(&'a u8)` | Higher-ranked (trait-object) type, works like `fn` above. |
| {{ tab() }} `dyn Fn(&'_ u8)` | Same; automatically expanded to type `dyn for<'a> Fn(&'a u8)`. |
| {{ tab() }} `dyn Fn(&u8)` | Same; automatically expanded to type `dyn for<'a> Fn(&'a u8)`. |

<footnotes>

 <sup>1</sup> Yes, the `for<>` is part of the type, which is why you write `impl T for for<'a> fn(&'a u8)` below.

</footnotes>

</fixed-2-column>


<div class="color-header special_example">
{{ tablesep() }}

| Implementing Traits | Explanation |
|---------|-------------|
| `impl<'a> T for fn(&'a u8) {}` | For fn. pointer, where call accepts **specific** _lt._ `'a`, impl trait `T`.|
| `impl T for for<'a> fn(&'a u8) {}` | For fn. pointer, where call accepts **any** _lt._, impl trait `T`. |
| {{ tab() }} `impl T for fn(&u8) {}` | Same, short version. |

</div>
