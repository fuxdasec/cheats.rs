+++
title = "Thread Safety"
description = "Rust Send and Sync behavior for common values, references, pointers, and standard library types."
weight = 24
template = "topic.html"

[extra]
seo_title = "Thread Safety"
anchor = "thread-safety"
previous = "/standard-library/one-liners/"
previous_title = "One-Liners"
next = "/standard-library/atomics-cache/"
next_title = "Atomics & Cache"
print = true
+++
Assume you hold some variables in Thread 1, and want to either **move** them to Thread 2, or pass their **references** to Thread 3.
Whether this is allowed is governed by **`Send`**{{ std(page="std/marker/trait.Send.html") }} and **`Sync`**{{ std(page="std/marker/trait.Sync.html") }} respectively:

{{ tablesep() }}

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto; padding-top: 10px;">
<div style="min-width: 100%; width: 650px; ">
<div class="color-header number">


<threading-section>
    <thread-row>
        <thread-backdrop><hr></thread-backdrop>
        <values>
            <value class="both" style="left: 57px;"><thread-link>|<br>|<br>|</thread-link>&nbsp;Mutex&lt;u32&gt;</value>
            <value class="one" style="left: 97.5px;"><thread-link>|<br>|<br>|</thread-link>&nbsp;Cell&lt;u32&gt;</value>
            <value class="one" style="left: 137.5px;"><thread-link>|<br>|<br>|</thread-link>&nbsp;MutexGuard&lt;u32&gt;</value>
            <value class="none" style="left: 177.5px;"><thread-link>|<br>|<br>|</thread-link>&nbsp;Rc&lt;u32&gt;</value>
        </values>
        <subtext><blank-background>Thread 1</blank-background></subtext>
    </thread-row>
    <thread-row>
        <thread-backdrop><hr></thread-backdrop>
        <values>
            <value class="both" style="left: 77px;">&nbsp;Mutex&lt;u32&gt;</value>
            <value class="one" style="left: 117.5px;">&nbsp;Cell&lt;u32&gt;</value>
            <value class="disabled" style="left: 157.5px;">&nbsp;MutexGuard&lt;u32&gt;</value>
            <value class="disabled" style="left: 197.5px;">&nbsp;Rc&lt;u32&gt;</value>
        </values>
        <subtext><blank-background>Thread 2</blank-background></subtext>
    </thread-row>
    <thread-row>
        <thread-backdrop><hr></thread-backdrop>
        <values>
            <value class="both" style="left: 77px;"><b>&</b>Mutex&lt;u32&gt;</value>
            <value class="disabled" style="left: 117.5px;"><b>&</b>Cell&lt;u32&gt;</value>
            <value class="one" style="left: 157.5px;"><b>&</b>MutexGuard&lt;u32&gt;</value>
            <value class="disabled" style="left: 197.5px;"><b>&</b>Rc&lt;u32&gt;</value>
        </values>
        <subtext><blank-background>Thread 3</blank-background></subtext>
    </thread-row>
</threading-section>

</div>
</div>
</div>

{{ tablesep() }}

<div class="color-header sendsync">

| Example | Explanation |
| --- | --- |
| **`Mutex<u32>`** | Both `Send` and `Sync`. You can safely pass or lend it to another thread. |
| **`Cell<u32>`** | `Send`, not `Sync`. Movable, but its reference would allow concurrent non-atomic writes. |
| **`MutexGuard<u32>`** | `Sync`, but not `Send`. Lock tied to thread, but reference use could not allow data race. |
| **`Rc<u32>`** | Neither since it is easily clonable heap-proxy with non-atomic counters. |

</div>

{{ tablesep() }}

<!-- Shamelessly stolen from https://www.reddit.com/r/rust/comments/ctdkyr/understanding_sendsync/exk8grg/ -->
<table class="sendsync">
    <thead>
        <tr><th>Trait</th><th><code>Send</code></th><th><code>!Send</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>Sync</code></td><td><i>Most types</i> … <code>Arc&lt;T&gt;</code><sup>1,2</sup>, <code>Mutex&lt;T&gt;</code><sup>2</sup></td><td><code>MutexGuard&lt;T&gt;</code><sup>1</sup>, <code>RwLockReadGuard&lt;T&gt;</code><sup>1</sup></td></tr>
        <tr><td><code>!Sync</code></td><td><code>Cell&lt;T&gt;</code><sup>2</sup>, <code>RefCell&lt;T&gt;</code><sup>2</sup></td><td><code>Rc&lt;T&gt;</code>, <code>&dyn Trait</code>, <code>*const T</code><sup>3</sup></td></tr>
    </tbody>
</table>

<footnotes>

<sup>1</sup> If `T` is `Sync`. <br>
<sup>2</sup> If `T` is `Send`. <br>
<sup>3</sup> If you need to send a raw pointer, create newtype `struct Ptr(*const u8)` and `unsafe impl Send for Ptr {}`. Just ensure you _may_ send it.

</footnotes>

{{ tablesep() }}

<div class="color-header sendsync">

| When is ... | ... Send? |
| --- | --- |
| `T` | All contained fields are `Send`, or `unsafe` impl'ed. |
| {{ tab() }}`struct S { ... }` | All fields are `Send`, or `unsafe` impl'ed. |
| {{ tab() }}`struct S<T> { ... }` | All fields are `Send` and T is `Send`, or `unsafe` impl'ed. |
| {{ tab() }}`enum E { ... }` | All fields in all variants are `Send`, or `unsafe` impl'ed. |
| `&T` | If `T` is `Sync`. |
| <code>&vert;&vert; {}</code> | Closures are `Send` if all _captures_ are `Send`.  |
| {{ tab() }} <code>&vert;x&vert; { }</code> | `Send`, regardless of `x`.  |
| {{ tab() }} <code>&vert;x&vert; { Rc::new(x) }</code> | `Send`, since still nothing captured, despite `Rc` not being `Send`.  |
| {{ tab() }} <code>&vert;x&vert; { x + y }</code> | Only `Send` if `y` is `Send`.  |
| <code>async { }</code> | Futures are `Send` if no `!Send` is held over `.await` points.  |
| {{ tab() }} <code>async { Rc::new() }</code> | `Future` is `Send`, since the `!Send` type `Rc` is not held over `.await`.  |
| {{ tab() }} <code>async { rc; x.await; rc; }</code> <sup>1</sup> | `Future` is `!Send`, since `Rc` used across the `.await` point. |
| <code>async &vert;&vert; { }</code> {{ experimental()}} | Async _cl_. `Send` if all cpts. `Send`, res. `Future` if also no `!Send` inside.   |
| {{ tab() }} <code>async &vert;x&vert; { x  + y }</code> {{ experimental()}} | Async closure `Send` if `y` is `Send`. Future `Send` if `x` and `y` `Send`. |

</div>

<footnotes>

<sup>1</sup> This is a bit of pseudo-code to get the point across, the idea is to have an `Rc` before an `.await` point and keep using it beyond that point.

</footnotes>
