+++
title = "References & Pointers"
description = "Rust reference, pointer, borrowing, mutability, and dereferencing syntax at a glance."
weight = 3
template = "topic.html"

[extra]
seo_title = "Rust References and Pointers Syntax"
anchor = "references-pointers"
previous = "/language-constructs/data-structures/"
previous_title = "Data Structures"
next = "/language-constructs/functions-behavior/"
next_title = "Functions & Behavior"
print = true
+++
Granting access to un-owned memory. Also see section on Generics & Constraints.


<fixed-2-column>

<!-- | {{ tab() }} `&pin mut T` | Ergonomic wrapper for `Pin<&mut T>`. {{ std(page="std/pin/") }} {{ experimental() }} Prevents _selfref._ `t` from moving. |
| {{ tab() }} `&pin const T` | Ergonomic wrapper for `Pin<&T>`. {{ experimental() }} | -->


| Example | Explanation |
|---------|-------------|
| `&S` | Shared **reference** {{ book(page="ch04-02-references-and-borrowing.html") }} {{ std(page="std/primitive.reference.html") }} {{ nom(page="references.html")}} {{ ref(page="types.html#pointer-types")}} (type; space for holding _any_ `&s`). |
| {{ tab() }} `&[S]` | Special slice reference that contains (`addr`, `count`). |
| {{ tab() }} `&str` | Special string slice reference that contains (`addr`, `byte_len`). |
| {{ tab() }} `&mut S` | Exclusive reference to allow mutability (also `&mut [S]`, `&mut dyn S`, &hellip;). |
| {{ tab() }} `&dyn T` | Special **trait object** {{ book(page="ch17-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types") }} {{ ref(page="types/trait-object.html")}} ref. as (`addr`, `vtable`); `T` must be **dyn compat.** {{ ref(page="items/traits.html#dyn-compatibility")}} |
| `&s` | Shared **borrow** {{ book(page="ch04-02-references-and-borrowing.html") }} {{ ex(page="scope/borrow.html") }} {{ std(page="std/borrow/trait.Borrow.html") }} (e.g., addr., len, vtable, &hellip; of _this_ `s`, like `0x1234`). |
| {{ tab() }} `&mut s` | Exclusive borrow that allows **mutability**. {{ ex(page="scope/borrow/mut.html") }} |
| `*const S` | Immutable **raw pointer type** {{ book(page="ch19-01-unsafe-rust.html#dereferencing-a-raw-pointer") }} {{ std(page="std/primitive.pointer.html") }} {{ ref(page="types.html#raw-pointers-const-and-mut") }} w/o memory safety. |
| {{ tab() }} `*mut S` | Mutable raw pointer type w/o memory safety. |
| {{ tab() }} `&raw const s` | Create raw pointer w/o going through ref.; _c_. `ptr:addr_of!()` {{ std(page="std/ptr/macro.addr_of.html") }} {{ esoteric() }}  |
| {{ tab() }} `&raw mut s` | Same, but mutable. {{ experimental() }} Needed for unaligned, packed fields. {{ esoteric() }} |
| `ref s` | **Bind by reference**, {{ ex(page="scope/borrow/ref.html") }} makes binding reference type. {{ deprecated() }}|
| {{ tab() }} `let ref r = s;` | Equivalent to `let r = &s`. |
| {{ tab() }} `let S { ref mut x } = s;` | Mut. ref binding (`let x = &mut s.x`), shorthand destructuring {{ below( target = "/language-constructs/pattern-matching/#pattern-matching") }} version. |
| `*r` | **Dereference** {{ book(page="ch15-02-deref.html") }} {{ std(page="std/ops/trait.Deref.html") }} {{ nom(page="vec-deref.html") }} a reference `r` to access what it points to. |
| {{ tab() }} `*r = s;` | If `r` is a mutable reference, move or copy `s` to target memory. |
| {{ tab() }} `s = *r;` | Make `s` a copy of whatever `r` references, if that is `Copy`. |
| {{ tab() }} `s = *r;` | Won't work {{ bad() }} if `*r` is not `Copy`, as that would move and leave empty. |
| {{ tab() }} `s = *my_box;` | Special case{{ link(url="https://web.archive.org/web/20230130111147/https://old.reddit.com/r/rust/comments/b4so6i/what_is_exactly/ej8xwg8/") }} for **`Box`**{{ std(page="std/boxed/index.html") }} that can move out b'ed content not `Copy`. |
| `'a`  | A **lifetime parameter**, {{ book(page="ch10-00-generics.html") }} {{ ex(page="scope/lifetime.html")}} {{ nom(page="lifetimes.html") }} {{ ref(page="items/generics.html#type-and-lifetime-parameters")}} duration of a flow in static analysis. |
| {{ tab() }}  `&'a S`  | Only accepts address of some `s`; address existing `'a` or longer. |
| {{ tab() }}  `&'a mut S`  | Same, but allow address content to be changed. |
| {{ tab() }}  `struct S<'a> {}`  | Signals this `S` will contain address with lt. `'a`. Creator of `S` decides `'a`. |
| {{ tab() }} `trait T<'a> {}` | Signals any `S`, which `impl T for S`, might contain address. |
| {{ tab() }}  `fn f<'a>(t: &'a T)`  | Signals this function handles some address. Caller decides `'a`. |
| `'static`  | Special lifetime lasting the entire program execution. |

</fixed-2-column>
