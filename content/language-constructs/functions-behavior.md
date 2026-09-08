+++
title = "Functions & Behavior"
description = "Rust functions, closures, async blocks, const functions, unsafe code, and related behavior syntax."
weight = 4
template = "topic.html"

[extra]
seo_title = "Functions & Behavior"
anchor = "functions-behavior"
previous = "/language-constructs/references-pointers/"
previous_title = "References & Pointers"
next = "/language-constructs/control-flow/"
next_title = "Control Flow"
print = true
+++
Define units of code and their abstractions.

<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `trait T {}`  | Define a **trait**; {{ book(page="ch10-02-traits.html") }} {{ ex(page="trait.html") }} {{ ref(page="items/traits.html") }} common behavior types can adhere to. |
| `trait T : R {}` | `T` is subtrait of **supertrait** {{ book(page="ch19-03-advanced-traits.html#using-supertraits-to-require-one-traits-functionality-within-another-trait") }} {{ ex(page="trait/supertraits.html") }} {{ ref(page="items/traits.html#supertraits") }} `R`. Any `S` must `impl R` before it can `impl T`. |
| `impl S {}`  | **Implementation** {{ ref(page="items/implementations.html") }} of functionality for a type `S`, e.g., methods. |
| `impl T for S {}`  | Implement trait `T` for type `S`; specifies _how exactly_ `S` acts like `T`. |
| `impl !T for S {}` | Disable an automatically derived **auto trait**. {{ nom(page="send-and-sync.html") }} {{ ref(page="special-types-and-traits.html#auto-traits") }} {{ experimental() }} {{ esoteric() }} |
| `fn f() {}`  | Definition of a **function**; {{ book(page="ch03-03-how-functions-work.html") }}  {{ ex(page="fn.html") }} {{ ref(page="items/functions.html") }} or associated function if inside `impl`. |
| {{ tab() }} `fn f() -> S {}`  | Same, returning a value of type S. |
| {{ tab() }} `fn f(&self) {}`  | Define a **method**, {{ book(page="ch05-03-method-syntax.html") }}  {{ ex(page="fn/methods.html") }}  {{ ref(page="items/associated-items.html#methods") }}  e.g., within an `impl S {}`. |
| `struct S` &#8203;`(T);` | More arcanely, _also_{{ above(target="/language-constructs/data-structures/#data-structures") }} defines `fn S(x: T) -> S` **constructor fn**.  {{ rfc(page="1506-adt-kinds.html#tuple-structs") }} {{ esoteric() }} |
| `const fn f() {}`  | Constant `fn` usable at compile time, e.g., `const X: u32 = f(Y)`. {{ ref(page="const_eval.html#const-functions") }} {{ edition(ed="'18") }}|
| {{ tab() }} `const { x }`  | Used within a function, ensures `{ x }` evaluated during compilation. {{ ref(page="expressions/block-expr.html#const-blocks") }} |
| `async fn f() {}`  | **Async**  {{ ref(page="items/functions.html#async-functions") }} {{ edition(ed="'18") }} function transform, {{ below(target="/coding-guides/async-await-101/#async-await-101") }} makes `f` return an `impl` **`Future`**. {{ std(page="std/future/trait.Future.html") }} |
| {{ tab() }} `async fn f() -> S {}`  | Same, but make `f` return an `impl Future<Output=S>`. |
| {{ tab() }} `async { x }`  | Used within a function, make `{ x }` an `impl Future<Output=X>`. {{ ref(page="expressions/block-expr.html#async-blocks") }} |
| {{ tab() }} `async move { x }`  | Moves captured variables into future, _c_. move closure.  {{ ref(page="expressions/block-expr.html#capture-modes") }} {{ below(target="/language-constructs/functions-behavior/#functions-behavior") }}  |
| `fn() -> S`  | **Function references**, <sup>1</sup> {{ book(page="ch19-05-advanced-functions-and-closures.html#function-pointers") }} {{ std(page="std/primitive.fn.html") }} {{ ref(page="types.html#function-pointer-types") }} memory holding address of a callable. |
| `Fn() -> S`  | **Callable trait** {{ book(page="ch19-05-advanced-functions-and-closures.html#returning-closures") }} {{ std(page="std/ops/trait.Fn.html") }} (also `FnMut`, `FnOnce`), impl. by closures, fn's &hellip; |
| `AsyncFn() -> S`  | **Callable async trait** {{ std(page="std/ops/trait.AsyncFn.html") }} (also `AsyncFnMut`, `AsyncFnOnce`), impl. by async _c._  |
| <code>&vert;&vert; {} </code> | A **closure** {{ book(page="ch13-01-closures.html") }} {{ ex(page="fn/closures.html") }} {{ ref(page="expressions/closure-expr.html")}} that borrows its **captures**, {{ below(target="/memory-layout/closures/#closures-data") }} {{ ref(page="types/closure.html#capture-modes") }}  (e.g., a local variable). |
| {{ tab() }} <code>&vert;x&vert; {}</code> | Closure accepting one argument named `x`, body is block expression. |
| {{ tab() }} <code>&vert;x&vert; x + x</code> | Same, without block expression; may only consist of single expression.  |
| {{ tab() }} <code>move &vert;x&vert; x + y </code> | **Move closure** {{ ref(page="types/closure.html#capture-modes")}} taking ownership; i.e., `y` transferred into closure.  |
| {{ tab() }} <code>async &vert;x&vert; x + x</code> | **Async closure**. {{ ref(page="expressions/closure-expr.html#async-closures")}}  Converts its result into an `impl Future<Output=X>`. |
| {{ tab() }} <code>async move &vert;x&vert; x + y</code> | **Async move closure**.  Combination of the above. |
| {{ tab() }} <code>return &vert;&vert; true </code> | Closures sometimes look like logical ORs (here: return a closure). |
| `unsafe` | If you enjoy debugging segfaults; **unsafe code**. {{ below(target="/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined") }} {{ book(page="ch19-01-unsafe-rust.html#unsafe-superpowers") }} {{ ex(page="unsafe.html#unsafe-operations") }} {{ nom(page="meet-safe-and-unsafe.html") }} {{ ref(page="unsafe-blocks.html#unsafe-blocks") }} |
| {{ tab() }} `unsafe fn f() {}` | Means "_calling can cause UB, {{ below(target="/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined") }} **YOU must check** requirements_". |
| {{ tab() }} `unsafe trait T {}` | Means "_careless impl. of `T` can cause UB_; **implementor must check**".  |
| {{ tab() }} `unsafe { f(); }` | Guarantees to compiler "_**I have checked** requirements, trust me_".  |
| {{ tab() }} `unsafe impl T for S {}` | Guarantees _`S` is well-behaved w.r.t `T`_; people may use `T` on `S` safely.  |
| {{ tab() }} `unsafe extern "abi" {}` | Starting with Rust 2024 `extern "abi" {}` blocks {{ below(target="/language-constructs/organizing-code/#organizing-code")}} must be `unsafe`.  |
| {{ tab() }} {{ tab() }} `pub safe fn f();`  | Inside an `unsafe extern "abi" {}`, mark `f` is actually safe to call. {{ rfc(page="3484-unsafe-extern-blocks.html") }} |

</fixed-2-column>

<footnotes>

<sup>1</sup> Most documentation calls them function **pointers**, but function **references** might be more appropriate{{ link(url="https://users.rust-lang.org/t/why-are-function-pointers-special-no-null/87990/16") }} as they can't be `null` and must point to valid target.

</footnotes>
