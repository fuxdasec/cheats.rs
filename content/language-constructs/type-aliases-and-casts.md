+++
title = "Type Aliases and Casts"
description = "Rust type aliases, associated types, casts, coercions, and conversion syntax."
weight = 7
template = "topic.html"

[extra]
seo_title = "Type Aliases and Casts"
anchor = "type-aliases-and-casts"
previous = "/language-constructs/organizing-code/"
previous_title = "Organizing Code"
next = "/language-constructs/macros-attributes/"
next_title = "Macros & Attributes"
print = true
+++
Short-hand names of types, and methods to convert one type to another.

<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `type T = S;`  | Create a **type alias**, {{ book(page="ch19-04-advanced-types.html#creating-type-synonyms-with-type-aliases") }} {{ ref(page="items/type-aliases.html#type-aliases") }} i.e., another name for `S`. |
| `Self`  | Type alias for **implementing type**, {{ ref(page="types.html#self-types") }} e.g., `fn new() -> Self`. |
| `self`  | **Method subject** {{ book(page="ch05-03-method-syntax.html#method-syntax") }} {{ ref(page="items/associated-items.html#methods")}} in `fn f(self) {}`, e.g., akin to `fn f(self: Self) {}`. |
|  {{ tab() }}  `&self`  | Same, but refers to self as borrowed, would equal `f(self: &Self)`|
|  {{ tab() }}  `&mut self`  | Same, but mutably borrowed, would equal `f(self: &mut Self)` |
|  {{ tab() }}  `self: Box<Self>`  | [**Arbitrary self type**](https://github.com/withoutboats/rfcs/blob/arbitray-receivers/text/0000-century-of-the-self-type.md), add methods to smart ptrs (`my_box.f_of_self()`). |
| `<S as T>`  | **Disambiguate** {{ book(page="ch19-03-advanced-traits.html#fully-qualified-syntax-for-disambiguation-calling-methods-with-the-same-name") }} {{ ref(page="expressions/call-expr.html#disambiguating-function-calls") }} type `S` as trait `T`, e.g., `<S as T>::f()`. |
| `a::b as c`  | In `use` of symbol, import `S` as `R`, e.g., `use a::S as R`. |
| `x as u32`  | Primitive **cast**, {{ ex(page="types/cast.html#casting") }} {{ ref(page="expressions/operator-expr.html#type-cast-expressions") }} may truncate and be a bit surprising. <sup>1</sup> {{ nom(page="casts.html") }} |

</fixed-2-column>

<footnotes>

<sup>1</sup> See [**Type Conversions**](/working-with-types/type-conversions/#type-conversions) below for all the ways to convert between types.

</footnotes>
