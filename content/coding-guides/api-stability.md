+++
title = "API Stability"
description = "Rust API compatibility and SemVer risks involving types, traits, generics, and public interfaces."
weight = 43
template = "topic.html"

[extra]
seo_title = "API Stability"
anchor = "api-stability"
previous = "/coding-guides/adversarial-code/"
previous_title = "Adversarial Code"
next = "/misc/links-services/"
next_title = "Links & Services"
print = true
+++
When updating an API, these changes can break client code.{{ rfc(page="1105-api-evolution.html") }} Major changes (🔴) are **definitely breaking**, while minor changes (🟡) **might be breaking**:

<div class="color-header api-stability">


{{ tablesep() }}

| Crates |
|---------|
| 🔴 Making a crate that previously compiled for _stable_ require _nightly_. |
| 🔴 Removing Cargo features. |
| 🟡 Altering existing Cargo features. |

{{ tablesep() }}


| Modules |
|---------|
| 🔴 Renaming / moving / removing any public items. |
| 🟡 Adding new public items, as this might break code that does `use your_crate::*`. |

{{ tablesep() }}

| Structs |
|---------|
| 🔴 Adding private field when all current fields public. |
| 🔴 Adding public field when no private field exists. |
| 🟡 Adding or removing private fields when at least one already exists (before and after the change). |
| 🟡 Going from a tuple struct with all private fields (with at least one field) to a normal struct, or vice versa. |

{{ tablesep() }}

| Enums |
|---------|
| 🔴 Adding new variants; can be mitigated with early `#[non_exhaustive]` {{ ref(page="attributes/type_system.html#the-non_exhaustive-attribute") }} |
| 🔴 Adding new fields to a variant. |


{{ tablesep() }}

| Traits |
|---------|
| 🔴 Adding a non-defaulted item, breaks all existing `impl T for S {}`. |
| 🔴 Any non-trivial change to item signatures, will affect either consumers or implementors. |
| 🔴 Implementing any "fundamental" trait, as _not_ implementing a fundamental trait already was a promise. |
| 🟡 Adding a defaulted item; might cause dispatch ambiguity with other existing trait. |
| 🟡 Adding a defaulted type parameter. |
| 🟡 Implementing any non-fundamental trait; might also cause dispatch ambiguity. |

{{ tablesep() }}

| Inherent Implementations |
|---------|
| 🟡 Adding any inherent items; might cause clients to prefer that over trait fn and produce compile error. |

{{ tablesep() }}

| Signatures in Type Definitions |
|---------|
| 🔴 Tightening bounds (e.g., `<T>` to `<T: Clone>`). |
| 🟡 Loosening bounds. |
| 🟡 Adding defaulted type parameters. |
| 🟡 Generalizing to generics. |

| Signatures in Functions |
|---------|
| 🔴 Adding / removing arguments. |
| 🟡 Introducing a new type parameter. |
| 🟡 Generalizing to generics. |


{{ tablesep() }}

| Behavioral Changes |
|---------|
| 🔴 / 🟡 _Changing semantics might not cause compiler errors, but might make clients do wrong thing._ |


</div>


{{ tablesep() }}


<!-- ## Authoring Quality Crates

> **Note** <sup>💬</sup> &mdash; This chapter is mildly **subjective**. That said, it tries to be observational with respect to successful Rust crates (i.e., crates with most downloads should check most of these boxes).


<div class="color-header quality_crate">

### Code Patterns

| What | Why |
|--------| ---- |
| ☐ Write idiomatic code, follow API guides. |  |
| ☐ Regularly use `clippy`, `fmt` |   |
| ☐ Err on the side of `#[deny]`, not `#[allow]` | asdasd |


### Infrastructure

| What | Why |
|--------| ---- |
| ☐ Minimize dependencies. | asds |
| ☐ Add optional deps. to essential `trait` crates |  asds |
| ☐ Have unit & integration tests |  asds |
| ☐ Have benchmarks |  asds |


### Site

| What | Why |
|--------| ---- |
| ☐ Feature **prominent** API example, screenshot … | asds |
| ☐ Have permissive license for libs. | asds |

</div>

<footnotes>


</footnotes> -->


<!-- Don't render this section for printing, won't be helpful -->
