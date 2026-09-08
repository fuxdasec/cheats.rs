+++
title = "Closures"
description = "How Rust closures capture their environment and are represented in memory."
weight = 21
template = "topic.html"

[extra]
seo_title = "Closures"
anchor = "closures-data"
previous = "/memory-layout/references-pointers/"
previous_title = "References & Pointers"
next = "/memory-layout/standard-library-types/"
next_title = "Standard Library Types"
print = true
+++
Ad-hoc functions with an automatically managed data block **capturing** {{ ref(page="types/closure.html#capture-modes") }}<sup>, 1</sup>
environment where closure was defined. For example, if you had:

```rust
let y = ...;
let z = ...;

with_closure(move |x| x + y.f() + z); // y and z are moved into closure instance (of type C1)
with_closure(     |x| x + y.f() + z); // y and z are pointed at from closure instance (of type C2)
```

Then the generated, anonymous closures types `C1` and `C2` passed to `with_closure()` would look like:

<!-- NEW ENTRY -->
<datum class="doublespaced">
    <name><code>move |x| x + y.f() + z</code></name>
    <visual>
       <framed class="any" style="width: 100px;"><code>Y</code></framed>
       <framed class="any" style="width: 50px;"><code>Z</code></framed>
    </visual>
    <zoom>Anonymous closure type C1</zoom>
    <!-- <description>Also produces anonymous <br><code>f<sub>c1</sub> (c: C1, x: T)</code>. Details depend<br> which <code>FnOnce</code>, <code>FnMut</code>, <code>Fn</code> is allowed.</description> -->
</datum>


<!-- NEW ENTRY -->
<datum class="">
    <name><code>|x| x + y.f() + z</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
    </visual>
    <zoom>Anonymous closure type C2</zoom>
    <memory-entry>
        <memory-link style="left:44%;">|</memory-link>
        <memory class="anymem">
            <framed class="any" style="width: 30px;"><code>Y</code></framed>
        </memory>
    </memory-entry>
    <memory-entry>
        <memory-link style="left:44%;">|</memory-link>
        <memory class="anymem">
            <framed class="any" style="width: 30px;"><code>Z</code></framed>
        </memory>
    </memory-entry>
    <!-- <description>Similar, but captured context by<br> reference. Details might differ <br> depending on types involved.</description> -->
</datum>

<!-- Little hack as description below was too cluttered. -->
<!-- <datum>
    <name>&nbsp;</name>
    <description>
    Also produces anonymous <code>fn</code> such as <code>f_c1 (C1, X)</code> or <br>
    <code>f_c2 (&C2, X)</code>. Details depend which <code>FnOnce</code>, <code>FnMut</code>, <code>Fn</code> ...<br>
    is supported, based on properties of captured types.
    </description>
</datum> -->

<blockquote>
<footnotes>

Also produces anonymous <code>fn</code> such as <code>f<sub>c1</sub>(C1, X)</code> or <code>f<sub>c2</sub>(&C2, X)</code>. Details depend on which <code>FnOnce</code>, <code>FnMut</code>, <code>Fn</code> ... is supported, based on properties of captured types.

</footnotes>
</blockquote>


<footnotes>

<sup>1</sup> A bit oversimplified a closure is a convenient-to-write 'mini function' that accepts parameters _but also_ needs some local variables to do its job. It is therefore a type (containing the needed locals) and a function. _'Capturing the environment'_ is a fancy way of saying that and how the closure type holds on to these locals, either _by moved value_, or _by pointer_. See **Closures in APIs** {{ below(target="/coding-guides/closures-in-apis/#closures-in-apis") }} for various implications.

</footnotes>
