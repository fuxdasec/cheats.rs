+++
title = "Idiomatic Rust"
description = "A concise checklist of idiomatic Rust patterns for programmers coming from other languages."
weight = 37
template = "topic.html"

[extra]
seo_title = "Idiomatic Rust"
anchor = "idiomatic-rust"
previous = "/working-with-types/type-conversions/"
previous_title = "Type Conversions"
next = "/coding-guides/performance-tips/"
next_title = "Performance Tips"
print = true
+++
If you are used to Java or C, consider these.

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px; ">
<div class="color-header number">


| Idiom | Code |
|--------| ---- |
| **Think in Expressions** | `y = if x { a } else { b };` |
|  | `y = loop { break 5 };`  |
|  | `fn f() -> u32 { 0 }`  |
| **Think in Iterators** | `(1..10).map(f).collect()` |
|  | <code>names.iter().filter(&vert;x&vert; x.starts_with("A"))</code> |
| **Test Absence with `?`** | `y = try_something()?;` |
|  | `get_option()?.run()?` |
| **Use Strong Types** | `enum E { Invalid, Valid { … } }` over `ERROR_INVALID = -1` |
|  | `enum E { Visible, Hidden }` over `visible: bool` |
|  | `struct Charge(f32)` over `f32` |
| **Illegal State: Impossible** | `my_lock.write().unwrap().guaranteed_at_compile_time_to_be_locked = 10;` <sup>1</sup>|
|  | <code>thread::scope(&vert;s&vert; { /* Threads can't exist longer than scope() */ });</code> |
| **Avoid _Global_ State** | Being depended on in multiple versions can secretly duplicate statics. {{ bad() }} {{ link(url="https://doc.rust-lang.org/cargo/reference/resolver.html#version-incompatibility-hazards") }} |
| **Provide Builders** | `Car::builder().name("Model T").hp(20).build();` |
| **Make it Const** | Where possible mark fns. `const`; where feasible run code inside `const {}`. |
| **Don't Panic** | Panics are _not_ exceptions, they suggest immediate process abortion! |
|  | Only panic on programming error; use `Option<T>`{{ std(page="std/option/enum.Option.html") }} or `Result<T,E>`{{ std(page="std/result/enum.Result.html") }} otherwise. |
|  | If clearly user requested, e.g., calling `obtain()` vs. `try_obtain()`, panic ok too. |
|  | Inside `const { NonZero::new(1).unwrap() }` p. becomes compile error, ok too. |
| **Generics in Moderation** | A simple `<T: Bound>` (e.g., `AsRef<Path>`) can make your APIs nicer to use.  |
| | Complex bounds make it impossible to follow. If in doubt don't be creative with _g_.  |
| **Split Implementations** | Generics like `Point<T>` can have separate `impl` per `T` for some specialization. |
|   | `impl<T> Point<T> { /* Add common methods here */ }` |
|   | `impl Point<f32> { /* Add methods only relevant for Point<f32> */ }` |
| **Unsafe** | Avoid `unsafe {}`,{{ below(target="/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined") }} often safer, faster solution without it. |
| **Implement Traits** | `#[derive(Debug, Copy, …)]` and custom `impl` where needed. |
| **Tooling** | Run [**clippy**](https://github.com/rust-lang/rust-clippy) regularly to significantly improve your code quality. {{ hot() }} |
|  | Format your code with [**rustfmt**](https://github.com/rust-lang/rustfmt) for consistency. {{ hot() }} |
|  | Add **unit tests** {{ book(page="ch11-01-writing-tests.html") }} (`#[test]`) to ensure your code works. |
|  | Add **doc tests** {{ book(page="ch14-02-publishing-to-crates-io.html") }} (` ``` my_api::f() ``` `) to ensure docs match code. |
| **Documentation** | Annotate your APIs with doc comments that can show up on [**docs.rs**](https://docs.rs). |
|  | Don't forget to include a **summary sentence** and the **Examples** heading. |
|  | If applicable: **Panics**, **Errors**, **Safety**, **Abort** and **Undefined Behavior**. |


</div>
</div>
</div>

<footnotes>

<sup>1</sup> In most cases you should prefer `?` over `.unwrap()`. In the case of locks however the returned [**`PoisonError`**](https://doc.rust-lang.org/stable/std/sync/struct.PoisonError.html) signifies a panic in another thread, so unwrapping it (thus propagating the panic) is often the better idea.


</footnotes>

{{ tablesep() }}

> 🔥 We **highly** recommend you also follow the
> [**API Guidelines**](https://rust-lang.github.io/api-guidelines/) and the
> [**Pragmatic Rust Guidelines**](https://microsoft.github.io/rust-guidelines/)  🔥


{{ tablesep() }}
