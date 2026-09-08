+++
title = "Language Sugar"
description = "Rust language sugar, desugaring, dereferencing, coercions, and implicit conversions."
weight = 16
template = "topic.html"

[extra]
seo_title = "Language Sugar"
anchor = "language-sugar"
previous = "/behind-the-scenes/abstract-machine/"
previous_title = "The Abstract Machine"
next = "/behind-the-scenes/memory-lifetimes/"
next_title = "Memory & Lifetimes"
print = true
+++
If something works that "shouldn't work now that you think about it", it might be due to one of these.


<div class="color-header language-sugar">


| Name | Description |
|--------| -----------|
| **Coercions** {{ nom(page="coercions.html") }} | _Weakens_ types to match signature, e.g., `&mut T` to `&T`; _c_. _type conv._ {{ below(target="/working-with-types/type-conversions/#type-conversions") }}  |
| **Deref** {{ nom(page="vec-deref.html") }} {{ link(url="https://stackoverflow.com/questions/28519997/what-are-rusts-exact-auto-dereferencing-rules") }} | [Derefs](https://doc.rust-lang.org/std/ops/trait.Deref.html) `x: T` until `*x`, `**x`, &hellip; compatible with some target `S`. |
| **Prelude** {{ std(page="std/prelude/index.html") }} | Automatic import of basic items, e.g., `Option`, `drop()`, …
| **Reborrow** {{ link(url="https://quinedot.github.io/rust-learning/st-reborrow.html") }} | Since `x: &mut T` can't be copied; moves new `&mut *x` instead. |
| **Lifetime Elision** {{ book(page="ch10-03-lifetime-syntax.html#lifetime-elision") }} {{ nom(page="lifetime-elision.html#lifetime-elision") }} {{ ref(page="lifetime-elision.html#lifetime-elision") }} | Allows you to write `f(x: &T)`, instead of `f<'a>(x: &'a T)`, for brevity. |
| **Lifetime Extensions** {{ link(url="https://blog.m-ou.se/super-let/") }}  {{ ref(page="destructors.html#temporary-lifetime-extension") }} | In `let x = &tmp().f` and similar hold on to temporary past line. |
| **Method Resolution** {{ ref(page="expressions/method-call-expr.html") }} | Derefs or borrow `x` until `x.f()` works. |
| **Match Ergonomics** {{ rfc(page="2005-match-ergonomics.html") }} | Repeatedly deref. [scrutinee](https://doc.rust-lang.org/stable/reference/glossary.html#scrutinee) and adds `ref` and `ref mut` to bindings. |
| **Rvalue Static Promotion** {{ rfc(page="1414-rvalue_static_promotion.html") }}  {{ esoteric() }} | Makes refs. to constants `'static`, e.g., `&42`, `&None`, `&mut []`. |
| **Dual Definitions** {{ rfc(page="1506-adt-kinds.html#tuple-structs") }} {{ esoteric() }} | Defining one (e.g., `struct S(u8)`) implicitly def. another (e.g., `fn S`).  |
| **Drop Hidden Flow** {{ ref(page="destructors.html") }} {{ esoteric() }} | At end of blocks `{ ... }` or `_` assignment, may call `T::drop()`. {{ std(page="std/ops/trait.Drop.html") }} |
| **Drop Not Callable** {{ std(page="std/ops/trait.Drop.html") }} {{ esoteric() }} | Compiler forbids explicit `T::drop()` call, must use `mem::drop()`. {{ std(page="std/mem/fn.drop.html") }} |
| **Auto Traits** {{ ref(page="special-types-and-traits.html#auto-traits") }} | Always impl'ed for your types, closures, futures if possible. |


</div>

{{ tablesep() }}

> **Opinion** {{ opinionated() }} &mdash; These features make your life easier _using_ Rust, but stand in the way of _learning_ it. If you want to develop a _genuine understanding_, spend some extra time exploring them.
