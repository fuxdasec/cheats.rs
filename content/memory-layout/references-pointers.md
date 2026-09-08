+++
title = "References & Pointers"
description = "Memory representations of Rust references, raw pointers, slices, trait objects, and pointer metadata."
weight = 20
template = "topic.html"

[extra]
seo_title = "References & Pointers: Memory Layout"
anchor = "references-pointers-ui"
previous = "/memory-layout/custom-types/"
previous_title = "Custom Types"
next = "/memory-layout/closures/"
next_title = "Closures"
print = true
+++
References give safe access to 3<sup>rd</sup> party memory, raw pointers `unsafe` access.
The corresponding `mut` types have an identical data layout to their immutable counterparts.


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a T</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <payload>
            <code>meta</code><sub>2/4/8</sub>
        </payload>
    </visual>
    <memory-entry>
        <memory-link style="left:46%;">|</memory-link>
        <memory class="anymem">
            <framed class="any unsized"><code>T</code></framed>
        </memory>
    </memory-entry>
    <description>Must target some valid <code>t</code> of <code>T</code>, <br> and any such target must exist for <br> at least <code>'a</code>.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>*const T</code></name>
    <visual class="unsafe">
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <payload>
            <code>meta</code><sub>2/4/8</sub>
        </payload>
    </visual>
    <zoom>
        No guarantees.
    </zoom>
</datum>

<br/>


## Pointer Meta {#pointer-meta}

Many reference and pointer types can carry an extra field, **pointer metadata**. {{ std(page="nightly/std/ptr/trait.Pointee.html#pointer-metadata") }}
It can be the element- or byte-length of the target, or a pointer to a <i>vtable</i>. Pointers with meta are called **fat**, otherwise **thin**.

<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a T</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
    </visual>
    <memory-entry>
        <memory-link style="left:46%;">|</memory-link>
        <memory class="anymem">
            <framed class="any t"><code>T</code></framed>
        </memory>
    </memory-entry>
    <description>No meta for <br>sized target.<br>(pointer is thin).</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a T</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry>
        <memory-link style="left:46%;">|</memory-link>
        <memory class="anymem">
            <framed class="any unsized"><code>T</code></framed>
        </memory>
    </memory-entry>
    <description>If <code>T</code> is a DST <code>struct</code> such as<br> <code>S { x: [u8] }</code>
    meta field <code>len</code> is <br>count of dyn. sized content.</description>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a [T]</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry class="double">
        <memory-link style="left:24%;">|</memory-link>
        <memory class="anymem">
            …
            <framed class="any" style="width: 30px;"><code>T</code></framed>
            <framed class="any" style="width: 30px;"><code>T</code></framed>
            …
        </memory>
    </memory-entry>
    <description>Regular <b>slice reference</b> (i.e., the <br>reference type of a slice type <code>[T]</code>) {{ above (target="/memory-layout/custom-types/#custom-types") }} <br>often seen as <code>&[T]</code> if <code>'a</code> elided.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a str</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry class="double">
        <memory-link style="left:24%;">|</memory-link>
        <memory class="anymem">
            …
            <byte class="bytes"><code>U</code></byte>
            <byte class="bytes"><code>T</code></byte>
            <byte class="bytes"><code>F</code></byte>
            <byte class="bytes"><code>-</code></byte>
            <byte class="bytes"><code>8</code></byte>
            …
        </memory>
    </memory-entry>
    <description><b>String slice reference</b> (i.e., the <br>reference type of string type <code>str</code>),<br> with meta <code>len</code> being byte length.</description>
</datum>

<br>

<!-- NEW ENTRY -->
<datum class="spaced" style="padding-bottom: 165px; position: relative;">
    <name><code>&'a dyn Trait</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <ptr>
            <code>ptr</code><sub>2/4/8</sub>
        </ptr>
    </visual>
    <memory-entry>
        <memory-link style="left:49%;">|</memory-link>
        <memory class="anymem">
            <framed class="any unsized"><code>T</code></framed>
        </memory>
    </memory-entry>
    <memory-entry style="width:220px; position: absolute;">
        <memory-link style="left:22%;">|</memory-link>
        <memory class="static-vtable" style="width: 210px;">
            <table>
                <tr class="vtable"><td><code>*Drop::drop(&mut T)</code></td></tr>
                <tr class="vtable"><td><code>size</code></td></tr>
                <tr class="vtable"><td><code>align</code></td></tr>
                <tr class="vtable"><td><code>*Trait::f(&T, …)</code></td></tr>
                <tr class="vtable"><td><code>*Trait::g(&T, …)</code></td></tr>
            </table>
        </memory>
        <description>Meta points to vtable, where <code>*Drop::drop()</code>, <code>*Trait::f()</code>, … are pointers to their respective <code>impl</code> for <code>T</code>.</description>
    </memory-entry>

</datum>
