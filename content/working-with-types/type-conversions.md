+++
title = "Type Conversions"
description = "Rust type relations and conversions through casts, coercions, From, Into, TryFrom, and related traits."
weight = 36
template = "topic.html"

[extra]
seo_title = "Type Conversions"
anchor = "type-conversions"
previous = "/working-with-types/foreign-types-and-traits/"
previous_title = "Foreign Types and Traits"
next = "/coding-guides/idiomatic-rust/"
next_title = "Idiomatic Rust"
print = true
+++
How to get `B` when you have `A`?

<div class="color-header variance">

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-1" name="tab-variance" checked>
<label for="tab-variance-1"><b>Intro</b></label>
<panel><div>

```
fn f(x: A) -> B {
    // How can you obtain B from A?
}
```

| Method | Explanation |
|--------| -----------|
| **Identity** | Trivial case, `B` **is exactly** `A`. |
| **Computation** | Create and manipulate instance of `B` by **writing code** transforming data. |
| **Casts** | **On-demand** conversion between types where caution is advised. |
| **Coercions** | **Automatic** conversion within _'weakening ruleset'_.<sup>1</sup> |
| **Subtyping** | **Automatic** conversion within _'same-layout-different-lifetimes ruleset'_.<sup>1</sup> |

{{ tablesep() }}

<footnotes>

<sup>1</sup> While both convert `A` to `B`, **coercions** generally link to an _unrelated_ `B` (a type "one could reasonably expect to have different methods"),
while **subtyping** links to a `B` differing only in lifetimes.

</footnotes>

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-2" name="tab-variance">
<label for="tab-variance-2"><b>Computation (Traits)</b></label>
<panel><div>

```
fn f(x: A) -> B {
    x.into()
}
```

_Bread and butter_ way to get `B` from `A`. Some traits provide canonical, user-computable type relations:

| Trait | Example | Trait implies … |
|--------| -----------|-----------|
| `impl From<A> for B {}` | `a.into()` | _Obvious_, always-valid relation. |
| `impl TryFrom<A> for B {}` | `a.try_into()?` | _Obvious_, sometimes-valid relation. |
| `impl Deref for A {}` | `*a` | `A` is smart pointer carrying `B`; also enables coercions.  |
| `impl AsRef<B> for A {}` | `a.as_ref()` | `A` can be _viewed_ as `B`. |
| `impl AsMut<B> for A {}` | `a.as_mut()` | `A` can be mutably viewed as `B`. |
| `impl Borrow<B> for A {}` | `a.borrow()` | `A` has borrowed _analog_ `B` (behaving same under `Eq`, …). |
| `impl ToOwned for A { … }` | `a.to_owned()` | `A` has owned analog `B`. |


<!--
<footnotes>

<sup>1</sup> Pretty much any function, like `is_signed(x)`, puts values of two types in a _specific_ relationship, especially if their _meaning_ is highly _overloaded_ (e.g., `true` in the `is_signed` relation is proxy for a different concept than `true` in an `is_odd` one). In contrast, the traits above (and type conversions in general) are mainly about unambiguous conversions across any possible meaning.

</footnotes>
 -->

</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-3" name="tab-variance">
<label for="tab-variance-3"><b>Casts</b></label>
<panel><div>

```
fn f(x: A) -> B {
    x as B
}
```

Convert types **with keyword `as`** if conversion _relatively obvious_ but **might cause issues**. {{ nom(page="casts.html") }}


|  A | B | Example | Explanation |
|----|----| ----| -----------|
| `Pointer` | `Pointer` | `device_ptr as *const u8` | If `*A`, `*B` are `Sized`. |
| `Pointer` | `Integer` | `device_ptr as usize` |  |
| `Integer` | `Pointer` | `my_usize as *const Device` |  |
| `Number` | `Number` | `my_u8 as u16` | Often surprising behavior. {{ above(target="/memory-layout/basic-types/#boolean-and-numeric-types") }} |
| `enum` w/o fields | `Integer` | `E::A as u8` |  |
| `bool` | `Integer` | `true as u8` |  |
| `char` | `Integer` | `'A' as u8` |  |
| `&[T; N]` | `*const T` | `my_ref as *const u8` |  |
| `fn(…)` | `Pointer` | `f as *const u8` | If `Pointer` is `Sized`.  |
| `fn(…)` | `Integer` | `f as usize` |  |

{{ tablesep() }}

<footnote>

Where `Pointer`, `Integer`, `Number` are just used for brevity and actually mean:
- `Pointer` any `*const T` or `*mut T`;
- `Integer` any countable `u8` … `i128`;
- `Number` any `Integer`, `f32`, `f64`.

</footnote>

> **Opinion** {{ opinionated() }} &mdash; Casts, esp. `Number - Number`, can easily go wrong.
> If you are concerned with correctness, consider more explicit methods instead.

</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-4" name="tab-variance">
<label for="tab-variance-4"><b>Coercions</b></label>
<panel><div>

```
fn f(x: A) -> B {
    x
}
```

Automatically **weaken** type `A` to `B`; types can be _substantially_<sup>1</sup> different. {{ nom(page="coercions.html") }}


|  A | B |  Explanation |
|----|----| -----------|
| `&mut T` | `&T` | **Pointer weakening**. |
| `&mut T` | `*mut T` | - |
| `&T` | `*const T` | - |
| `*mut T` | `*const T` | - |
| `&T` | `&U` | **Deref**, if `impl Deref<Target=U> for T`. |
| `T` | `U` | **Unsizing**, if `impl CoerceUnsized<U> for T`.<sup>2</sup> {{ experimental() }} |
| `T` | `V` | **Transitivity**, if `T` coerces to `U` and `U` to `V`. |
| <code>&vert;x&vert; x + x</code> | `fn(u8) -> u8` | **Non-capturing closure**, to equivalent `fn` pointer. |

{{ tablesep() }}

<footnote>

<sup>1</sup> _Substantially_ meaning one can regularly expect a coercion result `B` to be _an entirely different type_ (i.e., have entirely different methods) than the original type `A`.

<sup>2</sup> Does not quite work in example above as unsized can't be on stack; imagine `f(x: &A) -> &B` instead. Unsizing works by default for:
- `[T; n]` to `[T]`
- `T` to `dyn Trait` if `impl Trait for T {}`.
- `Foo<…, T, …>` to `Foo<…, U, …>` under arcane {{ link(url="https://doc.rust-lang.org/nomicon/coercions.html") }} circumstances.

</footnote>


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-5" name="tab-variance">
<label for="tab-variance-5"><b>Subtyping</b>{{ esoteric() }}</label>
<panel><div>

```
fn f(x: A) -> B {
    x
}
```

Automatically converts `A` to `B` for types **only differing in lifetimes** {{ nom(page="subtyping.html") }} - subtyping **examples**:


| A<sup>(subtype)</sup>  | B<sup>(supertype)</sup> | Explanation |
|--------| -----------| -----------|
| `&'static u8` | `&'a u8` | Valid, <i>forever-</i>pointer is also <i>transient-</i>pointer. |
| `&'a u8` | `&'static u8` | {{ bad() }} Invalid, transient should not be forever. |
| `&'a &'b u8` | `&'a &'b u8` | Valid, same thing. **But now things get interesting. Read on.** |
| `&'a &'static u8` | `&'a &'b u8` | Valid, `&'static u8` is also `&'b u8`; **covariant** inside `&`.  |
| `&'a mut &'static u8` | `&'a mut &'b u8` | {{ bad() }} Invalid and surprising; **invariant** inside `&mut`. |
| `Box<&'static u8>` | `Box<&'a u8>` | Valid, `Box` with forever is also box with transient; covariant. |
| `Box<&'a u8>` | `Box<&'static u8>` | {{ bad() }} Invalid, `Box` with transient may not be with forever. |
| `Box<&'a mut u8>` | `Box<&'a u8>` | {{ bad() }} <sup>⚡</sup> Invalid, see table below, `&mut u8` never _was a_ `&u8`. |
| `Cell<&'static u8>` | `Cell<&'a u8>` | {{ bad() }} Invalid, `Cell` are **never** something else; invariant. |
| `fn(&'static u8)` | `fn(&'a u8)` | {{ bad() }} If `fn` needs forever it may choke on transients; **contravar.**|
| `fn(&'a u8)` | `fn(&'static u8)` |  But sth. that eats transients **can be**(!) sth. that eats forevers. |
| `for<'r> fn(&'r u8)` | `fn(&'a u8)` | Higher-ranked type `for<'r> fn(&'r u8)` is also `fn(&'a u8).` |


{{ tablesep() }}

In contrast, these are **not**{{ bad() }} examples of subtyping:

|  A | B |  Explanation |
|----|----| -----------|
| `u16` | `u8` | {{ bad() }} **Obviously invalid**; `u16` should never automatically be `u8`. |
| `u8` | `u16` | {{ bad() }} Invalid **by design**; types w. different data still never subtype even if they _could_. |
| `&'a mut u8` | `&'a u8` | {{ bad() }} Trojan horse, not subtyping; but coercion (still works, just not subtyping). |

{{ tablesep() }}

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-8" name="tab-variance">
<label for="tab-variance-8"><b>Variance</b>{{ esoteric() }}</label>
<panel><div>

```
fn f(x: A) -> B {
    x
}
```

Automatically converts `A` to `B` for types **only differing in lifetimes** {{ nom(page="subtyping.html") }} -  subtyping **variance rules**:

- A longer lifetime `'a` that outlives a shorter `'b` is a subtype of `'b`.
- Implies `'static` is subtype of all other lifetimes `'a`.
- Whether types with parameters (e.g., `&'a T`) are subtypes of each other the following variance table is used:

| Construct<sup>1</sup> | `'a` | `T` | `U` |
|--------| -----------| -------| -------|
| `&'a T` | covariant | covariant |  |
| `&'a mut T` | covariant | invariant |  |
| `Box<T>` |  | covariant |  |
| `Cell<T>` |  | invariant |  |
| `fn(T) -> U` |  | **contra**variant | covariant |
| `*const T` |  | covariant |  |
| `*mut T` |  | invariant |  |

<footnotes>

**Covariant** means if `A` is subtype of `B`, then `T[A]` is subtype of `T[B]`. <br>
**Contravariant** means if `A` is subtype of `B`, then **`T[B]`** is subtype of `T[A]`. <br>
**Invariant** means even if `A` is subtype of `B`, neither `T[A]` nor `T[B]` will be subtype of the other.<br>
<!-- <br> -->

<sup>1</sup> Compounds like `struct S<T> {}` obtain variance through their used fields, usually becoming invariant if multiple variances are mixed.<br>

</footnotes>

> 💡 **In other words**, 'regular' types are never subtypes of each other (e.g., `u8` is not subtype of `u16`),
> and a `Box<u32>` would never be sub- or supertype of anything.
> However, generally a `Box<A>`, _can_ be subtype of `Box<B>` (via covariance) if `A` is a subtype
> of `B`, which can only happen if `A` and `B` are 'sort of the same type that only differed in lifetimes', e.g., `A` being `&'static u32` and `B` being `&'a u32`.

</div></panel></tab>

</tabs>

</div>


{{ tablesep() }}
