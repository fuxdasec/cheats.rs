+++
title = "Generics & Constraints"
description = "Rust generics, trait bounds, where clauses, associated types, and generic constraints."
weight = 10
template = "topic.html"

[extra]
seo_title = "Generics & Constraints"
anchor = "generics-constraints"
previous = "/language-constructs/pattern-matching/"
previous_title = "Pattern Matching"
next = "/language-constructs/higher-ranked-items/"
next_title = "Higher-Ranked Items"
print = true
+++
Generics combine with type constructors, traits and functions to give your users more flexibility.

<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `struct S<T> …`  | A **generic** {{ book(page="ch10-01-syntax.html") }} {{ ex(page="generics.html") }} type with a type parameter (`T` is placeholder here). |
| `S<T> where T: R`  | **Trait bound**, {{ book(page="ch10-02-traits.html#using-trait-bounds-to-conditionally-implement-methods") }} {{ ex(page="generics/bounds.html") }} {{ ref(page="trait-bounds.html#trait-and-lifetime-bounds" ) }} limits allowed `T`, guarantees `T` has trait `R`. |
| {{ tab() }} `where T: R, P: S`  | **Independent trait bounds**, here one for `T` and one for (not shown) `P`.|
| {{ tab() }} `where T: R, S`  | Compile error, {{ bad() }} you probably want compound bound `R + S` below. |
| {{ tab() }} `where T: R + S`  | **Compound trait bound**, {{ book(page="ch10-02-traits.html#specifying-multiple-trait-bounds-with-the--syntax") }} {{ ex(page="generics/multi_bounds.html") }} `T` must fulfill `R` and `S`. |
| {{ tab() }} `where T: R + 'a`  | Same, but w. lifetime. `T` must fulfill `R`, if `T` has _lt._, must outlive `'a`. |
| {{ tab() }} `where T: ?Sized` | Opt out of a pre-defined trait bound, here `Sized`. {{ todo() }} |
| {{ tab() }} `where T: 'a` | Type **lifetime bound**; {{ ex(page="scope/lifetime/lifetime_bounds.html") }} if T has references, they must outlive `'a`.  |
| {{ tab() }} `where T: 'static` | Same; does _not_ mean value `t` _will_ {{ bad() }} live `'static`, only that it could. |
| {{ tab() }} `where 'b: 'a` | Lifetime `'b` must live at least as long as (i.e., _outlive_) `'a` bound. |
| {{ tab() }} `where u8: R<T>`  | Can also make conditional statements involving _other_ types. {{ esoteric() }} |
| `S<T: R>`  | Short hand bound, almost same as above, shorter to write. |
| `S<const N: usize>` | **Generic const bound**; {{ ref(page="items/generics.html#const-generics") }} user of type `S` can provide constant value `N`. |
| {{ tab() }} `S<10>` | Where used, const bounds can be provided as primitive values. |
| {{ tab() }} `S<{5+5}>` | Expressions must be put in curly brackets. |
| `S<T = R>` | **Default parameters**; {{ book(page="ch19-03-advanced-traits.html#default-generic-type-parameters-and-operator-overloading") }} makes `S` a bit easier to use, but keeps flexible. |
| {{ tab() }} `S<const N: u8 = 0>` | Default parameter for constants; e.g., in `f(x: S) {}` param `N` is `0`. |
| {{ tab() }} `S<T = u8>` | Default parameter for types, e.g., in `f(x: S) {}` param `T` is `u8`. |
| `S<'_>` | Inferred **anonymous lt.**; asks compiler to _'figure it out'_ if obvious.  |
| `S<_>` | Inferred **anonymous type**, e.g., as `let x: Vec<_> = iter.collect()`  |
| `S::<T>` | **Turbofish** {{ std(page="std/iter/trait.Iterator.html#method.collect")}} call site type disambiguation, e.g., `f::<u32>()`. |
| {{ tab() }} `E::<T>::A` | Generic enums can receive their type parameters on their type `E` &hellip; |
| {{ tab() }} `E::A::<T>` | &hellip; or at the variant (`A` here); allows `Ok::<R, E>(r)` and similar. |
| `trait T<X> {}`  | A trait generic over `X`. Can have multiple `impl T for S` (one per `X`). |
| `trait T { type X; }`  | Defines **associated type** {{ book(page="ch19-03-advanced-traits.html#specifying-placeholder-types-in-trait-definitions-with-associated-types") }} {{ ref(page="items/associated-items.html#associated-types") }} {{ rfc(page="0195-associated-items.html") }} `X`. Only one `impl T for S` possible. |
| `trait T { type X<G>; }`  | Defines **generic associated type** (GAT), {{ rfc(page="1598-generic_associated_types.html") }} `X` can be generic `Vec<>`. |
| `trait T { type X<'a>; }`  | Defines a GAT generic over a lifetime. |
| {{ tab() }} `type X = R;`  | Set associated type within `impl T for S { type X = R; }`. |
| {{ tab() }} `type X<G> = R<G>;`  | Same for GAT, e.g., `impl T for S { type X<G> = Vec<G>; }`. |
| `impl<T> S<T> {}`  | Impl. `fn`'s for any `T` in `S<T>` **_generically_**, {{ ref(page="items/implementations.html#generic-implementations") }} here `T` ty. parameter. |
| `impl S<T> {}`  | Impl. `fn`'s for exactly `S<T>` **_inherently_**, {{ ref(page="items/implementations.html#inherent-implementations") }} here `T` specific type, e.g., `u8`.  |
| `fn f() -> impl T`  | **Existential types** (aka [_RPIT_](https://santiagopastorino.com/2022/10/20/what-rpits-rpitits-and-afits-and-their-relationship/)), {{ book(page="ch10-02-traits.html#returning-types-that-implement-traits") }} returns an unknown-to-caller `S` that `impl T`. |
| {{ tab() }} `-> impl T + 'a`  | Signals the hidden type lives at least as long as `'a`. {{ rfc(page="3498-lifetime-capture-rules-2024.html#capturing-lifetimes") }}  |
| {{ tab() }} `-> impl T + use<'a>`  | Signals instead the hidden type captured lifetime `'a`, **use bound**. {{ link(url="https://blog.rust-lang.org/2024/09/05/impl-trait-capture-rules.html") }} {{ todo() }}|
| {{ tab() }} `-> impl T + use<'a, R>`  | Also signals the hidden type may have captured lifetimes from `R`. |
| {{ tab() }} `-> S<impl T>`  | The `impl T` part can also be used inside type arguments. |
| `fn f(x: &impl T)`  | Trait bound via "**impl traits**", {{ book(page="ch10-02-traits.html#trait-bound-syntax") }} similar to `fn f<S: T>(x: &S)` below. |
| `fn f(x: &dyn T)`  | Invoke `f` via **dynamic dispatch**, {{ book(page="ch17-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types") }} {{ ref(page="types.html#trait-objects") }} `f` will not be instantiated for `x`. |
| `fn f<X: T>(x: X)`  | Fn. generic over `X`, `f` will be instantiated ('[monomorphized](https://en.wikipedia.org/wiki/Monomorphization)') per `X`. |
| `fn f() where Self: R;`  | In `trait T {}`, make `f` accessible only on types known to also `impl R`.  |
| {{ tab() }} `fn f() where Self: Sized;`  | Using `Sized` can opt `f` out of trait object vtable, enabling `dyn T`. |
| {{ tab() }} `fn f() where Self: R {}`  | Other `R` useful w. dflt. fn. (non dflt. would need be impl'ed anyway). |
</fixed-2-column>
