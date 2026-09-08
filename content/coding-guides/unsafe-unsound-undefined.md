+++
title = "Unsafe, Unsound, Undefined"
description = "The differences between unsafe Rust, unsound APIs, undefined behavior, and safe abstractions."
weight = 41
template = "topic.html"

[extra]
seo_title = "Unsafe, Unsound, Undefined"
anchor = "unsafe-unsound-undefined"
previous = "/coding-guides/closures-in-apis/"
previous_title = "Closures in APIs"
next = "/coding-guides/adversarial-code/"
next_title = "Adversarial Code"
print = true
+++
Unsafe leads to unsound. Unsound leads to undefined. Undefined leads to the dark side of the force.



<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-unsafe-0" name="tab-unsafe" checked>
<label for="tab-unsafe-0"><b>Safe Code</b></label>
<panel><div>


**Safe Code**

- _Safe_ has narrow meaning in Rust, vaguely 'the _intrinsic_ prevention of undefined behavior (UB)'.
- Intrinsic means the language won't allow you to use _itself_ to cause UB.
- Making an airplane crash or deleting your database is not UB, therefore 'safe' from Rust's perspective.
- Writing to `/proc/[pid]/mem` to self-modify your code is also 'safe', resulting UB not caused _intrinsincally_.

<!-- In other words, _safe_ only means the language will produce binary code that, when reasonably invoked, executes in a manner consistent with what was written in source code. -->

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```rust
let y = x + x;  // Safe Rust only guarantees the execution of this code is consistent with
print(y);       // 'specification' (long story …). It does not guarantee that y is 2x
                // (X::add might be implemented badly) nor that y is printed (Y::fmt may panic).
```
</div></div>


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-unsafe-1" name="tab-unsafe">
<label for="tab-unsafe-1"><b>Unsafe Code</b></label>
<panel><div>


**Unsafe Code**

- Code marked `unsafe` has special permissions, e.g., to deref raw pointers, or invoke other `unsafe` functions.
- Along come special **promises the author _must_ uphold to the compiler**, and the compiler _will_ trust you.
- By itself `unsafe` code is not bad, but dangerous, and needed for FFI or exotic data structures.

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```rust
// `x` must always point to race-free, valid, aligned, initialized u8 memory.
unsafe fn unsafe_f(x: *mut u8) {
    my_native_lib(x);
}
```
</div></div></div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-unsafe-2" name="tab-unsafe" >
<label for="tab-unsafe-2"><b>Undefined Behavior</b></label>
<panel><div>


**Undefined Behavior (UB)**
- As mentioned, `unsafe` code implies [special promises](https://doc.rust-lang.org/stable/reference/behavior-considered-undefined.html) to the compiler (it wouldn't need be `unsafe` otherwise).
- Failure to uphold any promise makes compiler produce fallacious code, execution of which leads to UB.
- After triggering undefined behavior _anything_ can happen. Insidiously, the effects may be 1) subtle, 2) manifest far away from the site of violation or 3) be visible only under certain conditions.
- A seemingly _working_ program (incl. any number of unit tests) is no proof UB code might not fail on a whim.
- Code with UB is objectively dangerous, invalid and should never exist.

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">


```rust
if maybe_true() {
    let r: &u8 = unsafe { &*ptr::null() };   // Once this runs, ENTIRE app is undefined. Even if
} else {                                     // line seemingly didn't do anything, app might now run
    println!("the spanish inquisition");     // both paths, corrupt database, or anything else.
}
```
</div></div></div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-unsafe-3" name="tab-unsafe" >
<label for="tab-unsafe-3"><b>Unsound Code</b></label>
<panel><div>


**Unsound Code**
- Any _safe_ Rust that could (even only theoretically) produce UB for any user input is always **unsound**.
- As is `unsafe` code that may invoke UB on its own accord by violating above-mentioned promises.
- Unsound code is a stability and security risk, and violates basic assumption many Rust users have.

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```rust
fn unsound_ref<T>(x: &T) -> &u128 {      // Signature looks safe to users. Happens to be
    unsafe { mem::transmute(x) }         // ok if invoked with an &u128, UB for practically
}                                        // everything else.
```

</div></div></div></panel></tab>

</tabs>

{{ tablesep() }}

>
> **Responsible use of Unsafe** {{ opinionated() }}
>
> - Do not use `unsafe` unless you absolutely have to.
> - Follow the [Nomicon](https://doc.rust-lang.org/nightly/nomicon/), [Unsafe Guidelines](https://rust-lang.github.io/unsafe-code-guidelines/), **always** follow **all** safety rules, and **never** invoke [UB](https://doc.rust-lang.org/stable/reference/behavior-considered-undefined.html).
> - Minimize the use of `unsafe` and encapsulate it in small, sound modules that are easy to review.
> - Never create unsound abstractions; if you can't encapsulate `unsafe` properly, don't do it.
> - Each `unsafe` unit should be accompanied by plain-text reasoning outlining its safety.


{{ tablesep() }}
