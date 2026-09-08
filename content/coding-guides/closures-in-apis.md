+++
title = "Closures in APIs"
description = "How to accept, store, and return Rust closures with Fn, FnMut, FnOnce, and impl Trait."
weight = 40
template = "topic.html"

[extra]
seo_title = "Closures in APIs"
anchor = "closures-in-apis"
previous = "/coding-guides/async-await-101/"
previous_title = "Async-Await 101"
next = "/coding-guides/unsafe-unsound-undefined/"
next_title = "Unsafe, Unsound, Undefined"
print = true
+++
There is a subtrait relationship `Fn` : `FnMut` : `FnOnce`. That means a closure that
implements `Fn` {{ std(page="std/ops/trait.Fn.html") }} also implements `FnMut` and `FnOnce`. Likewise a closure
that implements `FnMut` {{ std(page="std/ops/trait.FnMut.html") }} also implements `FnOnce`. {{ std(page="std/ops/trait.FnOnce.html") }}

From a call site perspective that means:

<div class="color-header green">

| Signature | Function `g` can call &hellip; |  Function `g` accepts &hellip; |
|--------| -----------| -----------|
| `g<F: FnOnce()>(f: F)`  | &hellip; `f()` at most once. |  `Fn`, `FnMut`, `FnOnce`  |
| `g<F: FnMut()>(mut f: F)`  | &hellip; `f()` multiple times. | `Fn`, `FnMut` |
| `g<F: Fn()>(f: F)`  | &hellip; `f()` multiple times.  | `Fn` |

</div>

<footnotes>

Notice how **asking** for a `Fn` closure as a function is
most restrictive for the caller; but **having** a `Fn`
closure as a caller is most compatible with any function.

</footnotes>



{{ tablesep() }}

From the perspective of someone defining a closure:

<div class="color-header green">

| Closure | Implements<sup>*</sup> | Comment |
|--------| -----------| --- |
| <code> &vert;&vert; { moved_s; } </code> | `FnOnce` | Caller must give up ownership of `moved_s`. |
| <code> &vert;&vert; { &mut s; } </code> | `FnOnce`, `FnMut` | Allows `g()` to change caller's local state `s`. |
| <code> &vert;&vert; { &s; } </code> | `FnOnce`, `FnMut`, `Fn` | May not mutate state; but can share and reuse `s`. |

</div>

<div class="footnotes">

<sup>*</sup> Rust [prefers capturing](https://doc.rust-lang.org/stable/reference/expressions/closure-expr.html) by reference
(resulting in the most "compatible" `Fn` closures from a caller perspective), but can be
forced to capture its environment by copy or move via the
`move || {}` syntax.

</div>

{{ tablesep() }}

That gives the following advantages and disadvantages:

<div class="color-header green">

| Requiring | Advantage | Disadvantage |
|--------| -----------| -----------|
| `F: FnOnce`  | <span class="good">Easy to satisfy as caller.</span> | <span class="bad">Single use only, `g()` may call `f()` just once.</span> |
| `F: FnMut`  | <span class="good">Allows `g()` to change caller state.</span> | <span class="bad">Caller may not reuse captures during `g()`.</span> |
| `F: Fn`  | <span class="good">Many can exist at same time.</span> | <span class="bad">Hardest to produce for caller.</span> |

</div>


{{ tablesep() }}



<!-- ## Macro Hygiene -->
<!-- {{ tablesep() }} -->
