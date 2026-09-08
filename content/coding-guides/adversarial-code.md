+++
title = "Adversarial Code"
description = "Rust API design considerations for code that remains safe under unexpected but valid caller behavior."
weight = 42
template = "topic.html"

[extra]
seo_title = "Adversarial Code"
anchor = "adversarial-code"
previous = "/coding-guides/unsafe-unsound-undefined/"
previous_title = "Unsafe, Unsound, Undefined"
next = "/coding-guides/api-stability/"
next_title = "API Stability"
print = true
+++
_Adversarial_ code is _safe_ 3<sup>rd</sup> party code that compiles but does not follow API _expectations_, and might interfere with your own (safety) guarantees.


<div class="color-header redred">


| You author | User code may possibly … |
|---------|---------|
| `fn g<F: Fn()>(f: F) { … }` | Unexpectedly panic. |
| `struct S<X: T> { … }` | Implement `T` badly, e.g., misuse `Deref`, … |
| `macro_rules! m { … }` | Do all of the above; call site can have _weird_ scope. |

{{ tablesep() }}

| Risk Pattern | Description |
|---------|---------|
| `#[repr(packed)]` |  Packed alignment can make reference `&s.x` invalid. |
| `impl std::… for S {}`  | Any trait `impl`, esp. `std::ops` may be broken. In particular … |
| {{ tab() }} `impl Deref for S {}` | May randomly `Deref`, e.g., `s.x != s.x`, or panic.  |
| {{ tab() }} `impl PartialEq for S {}` | May violate equality rules; panic.  |
| {{ tab() }} `impl Eq for S {}`  | May cause `s != s`; panic; must not use `s` in `HashMap` & co. |
| {{ tab() }} `impl Hash for S {}`  | May violate hashing rules; panic; must not use `s` in `HashMap` & co. |
| {{ tab() }} `impl Ord for S {}`  | May violate ordering rules; panic; must not use `s` in `BTreeMap` & co. |
| {{ tab() }} `impl Index for S {}` | May randomly index, e.g., `s[x] != s[x]`; panic. |
| {{ tab() }} `impl Drop for S {}` | May run code or panic end of scope `{}`, during assignment `s = new_s`. |
| `panic!()` | User code can panic _any_ time, resulting in abort or unwind. |
| <code>catch_unwind(&vert;&vert; s.f(panicky))</code> |  Also, caller might force observation of broken state in `s`.  |
| `let … = f();` | Variable name can affect order of `Drop` execution. <sup>1</sup> {{ bad() }}  |

<footnotes>

<sup>1</sup> Notably, when you rename a variable from <code>_x</code> to <code>&lowbar;</code> you will also change Drop behavior since you change semantics. A variable named <code>_x</code> will have <code>Drop::drop()</code> executed at the end of its scope, a variable named <code>&lowbar;</code> can have it executed immediately on 'apparent' assignment ('apparent' because a binding named <code>&lowbar;</code> means **wildcard** {{ ref(page="patterns.html#wildcard-pattern") }} _discard this_, which will happen as soon as feasible, often right away)!

</footnotes>

{{ tablesep() }}

</div>


> **Implications**
>
> - Generic code **cannot be safe if safety depends on type cooperation** w.r.t. most (`std::`) traits.
> - If type cooperation is needed you must use `unsafe` traits (prob. implement your own).
> - You must consider random code execution at unexpected places (e.g., re-assignments, scope end).
> - You may still be observable after a worst-case panic.
>
> As a corollary, _safe_-but-deadly code (e.g., `airplane_speed<T>()`) should probably also follow these guides.


{{ tablesep() }}
