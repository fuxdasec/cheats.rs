+++
title = "Data Structures"
description = "Rust data structure declarations and bindings, including structs, enums, unions, constants, and variables."
weight = 2
template = "topic.html"

[extra]
seo_title = "Data Structures"
anchor = "data-structures"
previous = "/language-constructs/hello-rust/"
previous_title = "Hello, Rust!"
next = "/language-constructs/references-pointers/"
next_title = "References & Pointers"
print = true
+++
Data types and memory locations defined via keywords.

<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `struct S {}` | Define a **struct** {{ book(page="ch05-00-structs.html") }} {{ ex(page="custom_types/structs.html") }} {{ std(page="std/keyword.struct.html") }} {{ ref(page="expressions/struct-expr.html") }} with named fields. |
| {{ tab() }} `struct S { x: T }` | Define struct with named field `x` of type `T`. |
| {{ tab() }} `struct S` &#8203;`(T);` | Define "tupled" struct with numbered field `.0` of type `T`. |
| {{ tab() }} `struct S;` | Define **zero sized** {{ nom(page="exotic-sizes.html#zero-sized-types-zsts")}} unit struct. Occupies no space, optimized away. |
| `enum E {}` | Define an **enum**, {{ book(page="ch06-01-defining-an-enum.html") }} {{ ex(page="custom_types/enum.html#enums") }} {{ ref(page="items/enumerations.html") }} _c_. [algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type), [tagged unions](https://en.wikipedia.org/wiki/Tagged_union). |
| {{ tab() }}  `enum E { A, B`&#8203;`(), C {} }` | Define variants of enum; can be unit- `A`, tuple- `B` &#8203;`()` and struct-like `C{}`. |
| {{ tab() }}  `enum E { A = 1 }` | Enum with explicit **discriminant values**, {{ ref(page="items/enumerations.html#custom-discriminant-values-for-fieldless-enumerations") }} e.g., for FFI. |
| {{ tab() }}  `enum E {}` | Enum w/o variants is **uninhabited**, {{ ref(page="glossary.html#uninhabited") }} can't be created, _c._ 'never' {{ below(target="/language-constructs/miscellaneous/#miscellaneous") }} {{ esoteric() }} |
| `union U {}` | Unsafe C-like **union**  {{ ref(page="items/unions.html") }} for FFI compatibility. {{ esoteric() }} |
| `static X: T = T();`  | **Global variable** {{ book(page="ch19-01-unsafe-rust.html#accessing-or-modifying-a-mutable-static-variable") }} {{ ex(page="custom_types/constants.html#constants") }} {{ ref(page="items/static-items.html#static-items") }}  with `'static` lifetime, single {{ bad() }}{{ note( note="1") }} memory location. |
| `const X: T = T();`  | Defines **constant**, {{ book(page="ch03-01-variables-and-mutability.html#constants") }} {{ ex(page="custom_types/constants.html") }} {{ ref(page="items/constant-items.html") }} copied into a temporary when used. |
| `let x: T;`  | Allocate `T` bytes on stack{{ note( note="2") }} bound as `x`. Assignable once, not mutable.  |
| `let mut x: T;`  | Like `let`, but allow for **mutability** {{ book(page="ch03-01-variables-and-mutability.html") }} {{ ex(page="variable_bindings/mut.html") }} and mutable borrow.{{ note( note="3") }} |
| {{ tab() }} `x = y;` | Moves `y` to `x`, inval. `y` if `T` is not **`Copy`**, {{ std(page="std/marker/trait.Copy.html") }} and copying `y` otherwise. |

</fixed-2-column>

<footnotes>

<sup>1</sup> In _libraries_ you might secretly end up with multiple instances of `X`, depending on how your crate is imported. {{ link(url="https://doc.rust-lang.org/cargo/reference/resolver.html#version-incompatibility-hazards") }} <br>
<sup>2</sup> **Bound variables** {{ book(page="ch03-01-variables-and-mutability.html") }} {{ ex(page="variable_bindings.html") }} {{ ref(page="variables.html") }} live on stack for synchronous code. In `async {}` they become part of async's state machine, may reside on heap.<br>
<sup>3</sup> Technically _mutable_ and _immutable_ are misnomer. Immutable binding or shared reference may still contain Cell {{ std(page="std/cell/index.html") }}, giving _interior mutability_.

</footnotes>


{{ tablesep() }}

Creating and accessing data structures; and some more _sigilic_ types.

<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `S { x: y }` | Create `struct S {}` or `use`'ed `enum E::S {}` with field `x` set to `y`. |
| `S { x }` | Same, but use local variable `x` for field `x`. |
| `S { ..s }` | Fill remaining fields from `s`, esp. useful with `Default::default()`. {{ std(page="std/default/trait.Default.html") }} |
| `S { 0: x }` | Like `S` &#8203;`(x)` below, but set field `.0` with struct syntax.  |
| `S`&#8203; `(x)` | Create `struct S` &#8203;`(T)` or `use`'ed `enum E::S`&#8203; `()` with field `.0` set to `x`. |
| `S` | If `S` is unit `struct S;` or `use`'ed `enum E::S` create value of `S`. |
| `E::C { x: y }` | Create enum variant `C`. Other methods above also work. |
| `()` | Empty tuple, both literal and type, aka **unit**. {{ std(page="std/primitive.unit.html") }} |
| `(x)` | Parenthesized expression. |
| `(x,)` | Single-element **tuple** expression. {{ ex(page="primitives/tuples.html") }} {{ std(page="std/primitive.tuple.html") }} {{ ref(page="expressions/tuple-expr.html") }} |
| `(S,)` | Single-element tuple type. |
| `[S]` | Array type of unspec. length, i.e., **slice**. {{ ex(page="primitives/array.html") }} {{ std(page="std/primitive.slice.html") }} {{ ref(page="types/slice.html") }} Can't live on stack. {{ note( note="*") }} |
| `[S; n]` | **Array type** {{ ex(page="primitives/array.html") }}  {{ std(page="std/primitive.array.html") }} {{ ref(page="types/array.html") }}  of fixed length `n` holding elements of type `S`. |
| `[x; n]` | **Array instance**  {{ ref(page="expressions/array-expr.html") }} (expression) with `n` copies of `x`. |
| `[x, y]` | Array instance with given elements `x` and `y`. |
| `x[0]` | Collection indexing, here w. `usize`. Impl. via [**Index**](https://doc.rust-lang.org/std/ops/trait.Index.html), [**IndexMut**](https://doc.rust-lang.org/std/ops/trait.IndexMut.html). |
| {{ tab() }} `x[..]` | Same, via range (here _full range_), also `x[a..b]`, `x[a..=b]`, … _c_. below.  |
| `a..b` | **Right-exclusive range** {{ std(page="std/ops/struct.Range.html") }} {{ ref(page="expressions/range-expr.html") }} creation, e.g., `1..3` means `1, 2`.  |
| `..b` | Right-exclusive **range to** {{ std(page="std/ops/struct.RangeTo.html") }} without starting point.  |
| `..=b` | **Inclusive range to** {{ std(page="std/ops/struct.RangeToInclusive.html") }} without starting point.  |
| `a..=b` | **Inclusive range**, {{ std(page="std/ops/struct.RangeInclusive.html") }} `1..=3` means `1, 2, 3`. |
| `a..` | **Range from** {{ std(page="std/ops/struct.RangeFrom.html") }} without ending point.  |
| `..` | **Full range**, {{ std(page="std/ops/struct.RangeFull.html") }} usually means _the whole collection_.   |
| `s.x` | Named **field access**, {{ ref(page="expressions/field-expr.html") }} might try to [Deref](https://doc.rust-lang.org/std/ops/trait.Deref.html) if `x` not part of type `S`. |
| `s.0` | Numbered field access, used for tuple types `S` &#8203;`(T)`. |

</fixed-2-column>

<footnotes>

<sup>*</sup> For now,{{ rfc( page ="1909-unsized-rvalues.html") }} pending completion of [tracking issue](https://github.com/rust-lang/rust/issues/48055).

</footnotes>
