+++
title = "Iterators"
description = "Rust iterator creation, transformation, inspection, consumption, and collection methods."
weight = 26
template = "topic.html"

[extra]
seo_title = "Iterators"
anchor = "iterators"
previous = "/standard-library/atomics-cache/"
previous_title = "Atomics & Cache"
next = "/standard-library/number-conversions/"
next_title = "Number Conversions"
print = true
+++
Processing elements in a collection.

<tabs class="color-header iterators">

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-p0" name="tab-group-trait-iter" checked>
<label for="tab-trait-iter-p0"><b>Basics</b></label>
<panel><div>


There are, broadly speaking, four _styles_ of collection iteration:

| Style | Description |
| --- | --- |
| `for x in c { ... }` | _Imperative_, useful w. side effects, interdepend., or need to break flow early.  |
| `c.iter().map().filter()` | _Functional_, often much cleaner when only results of interest. |
| `c_iter.next()` | _Low-level_, via explicit `Iterator::next()` {{ std(page="std/iter/trait.Iterator.html#tymethod.next") }} invocation. {{ esoteric() }} |
| `c.get(n)` | _Manual_, bypassing official iteration machinery. |

{{ tablesep() }}

> **Opinion** {{ opinionated() }} &mdash; Functional style is often easiest to follow, but don't hesitate to use  `for` if your `.iter()` chain turns messy. When implementing containers iterator support would be ideal, but when in a hurry it can sometimes be more practical to just implement `.len()` and `.get()` and move on with your life.


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-1" name="tab-group-trait-iter">
<label for="tab-trait-iter-1"><b>Obtaining</b></label>
<panel><div>



**Basics**

Assume you have a collection `c` of type `C` you want to use:

* **`c.into_iter()`**<sup>1</sup>  &mdash; Turns collection `c` into an **`Iterator`** {{ std(page="std/iter/trait.Iterator.html") }} `i` and **consumes**<sup>2</sup> `c`. _Std._ way to get iterator.
* **`c.iter()`** &mdash; Courtesy method **some** collections provide, returns **borrowing** Iterator, doesn't consume `c`.
* **`c.iter_mut()`** &mdash; Same, but **mutably borrowing** Iterator that allow collection to be changed.


**The Iterator**

Once you have an `i`:

* **`i.next()`** &mdash; Returns `Some(x)` next element `c` provides, or `None` if we're done.


**For Loops**

* **`for x in c {}`** &mdash; Syntactic sugar, calls `c.into_iter()` and loops `i` until `None`.



<footnotes>

<sup>1</sup> Requires **`IntoIterator`** {{ std(page="std/iter/trait.IntoIterator.html") }} for `C` to be implemented. Type of item depends on what `C` was.

<sup>2</sup> If it looks as if it doesn't consume `c` that's because type was `Copy`. For example, if you call `(&c).into_iter()` it will invoke `.into_iter()` on `&c` (which will consume a _copy_ of the reference and turn it into an Iterator), but the original `c` remains untouched.

</footnotes>

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-2" name="tab-group-trait-iter">
<label for="tab-trait-iter-2"><b>Creating</b></label>
<panel><div>

**Essentials**

Let's assume you have a `struct Collection<T> {}` you authored. You should also implement:


* **`struct IntoIter<T> {}`** &mdash; Create a struct to hold your iteration status (e.g., an index) for value iteration.
* **`impl Iterator for IntoIter<T> {}`** &mdash; Implement `Iterator::next()` so it can produce elements.

<mini-zoo class="zoo" style="">
    <entry class="wide">
        <type class="generic dotted"><code>Collection&lt;T&gt;</code></type>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-right: 20px;">
    <entry class="wide">
        <type class="generic dotted"><code>IntoIter&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">Iterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = T;</code></associated-type>
    </entry>
</mini-zoo>

{{ tablesep() }}

> At this point you have something that can behave as an **Iterator**, {{ std(page="std/iter/trait.Iterator.html") }} but no way of actually obtaining it. See the next tab for how that usually works.


</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-3" name="tab-group-trait-iter">
<label for="tab-trait-iter-3"><b>For Loops</b></label>
<panel><div>

**Native Loop Support**

Many users would expect your collection to _just work_ in `for` loops. You need to implement:

* **`impl IntoIterator for Collection<T> {}`** &mdash; Now `for x in c {}` works.
* **`impl IntoIterator for &Collection<T> {}`** &mdash; Now `for x in &c {}` works.
* **`impl IntoIterator for &mut Collection<T> {}`** &mdash; Now `for x in &mut c {}` works.

<mini-zoo class="zoo" style="">
    <entry class="wide">
        <type class="generic dotted"><code>Collection&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">IntoIterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = T;</code></associated-type>
        <associated-type class="grayed"><code>To = IntoIter&lt;T&gt;</code></associated-type>
        <note>Iterate over <code>T</code>.</note>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="">
    <entry class="wide">
        <type class="generic dotted grayed"><code>&Collection&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">IntoIterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = &T;</code></associated-type>
        <associated-type class="grayed"><code>To = Iter&lt;T&gt;</code></associated-type>
        <note>Iterate over <code>&T</code>.</note>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="">
    <entry class="wide">
        <type class="generic dotted grayed"><code>&mut Collectn&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">IntoIterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = &mut T;</code></associated-type>
        <associated-type class="grayed"><code>To = IterMut&lt;T&gt;</code></associated-type>
        <note>Iterate over <code>&mut T</code>.</note>
    </entry>
</mini-zoo>

{{ tablesep() }}

> As you can see, the **IntoIterator** {{ std(page="std/iter/trait.IntoIterator.html") }} trait is what actually connects your collection with the **IntoIter** struct you created in the previous tab. The two siblings of **IntoIter** (**Iter** and **IterMut**) are discussed in the next tab.


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-2b" name="tab-group-trait-iter">
<label for="tab-trait-iter-2b"><b>Borrowing</b></label>
<panel><div>



**Shared & Mutable Iterators**

In addition, if you want your collection to be useful when borrowed you should implement:

* **`struct Iter<T> {}`** &mdash; Create struct holding `&Collection<T>` state for shared iteration.
* **`struct IterMut<T> {}`** &mdash; Similar, but holding `&mut Collection<T>` state for mutable iteration.
* **`impl Iterator for Iter<T> {}`** &mdash; Implement shared iteration.
* **`impl Iterator for IterMut<T> {}`** &mdash; Implement mutable iteration.

Also you might want to add convenience methods:

- `Collection::iter(&self) -> Iter`,
- `Collection::iter_mut(&mut self) -> IterMut`.



<mini-zoo class="zoo" style="margin-right: 20px;">
    <entry class="wide">
        <type class="generic dotted"><code>Iter&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">Iterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = &T;</code></associated-type>
    </entry>
</mini-zoo>


<mini-zoo class="zoo" style="margin-right: 20px;">
    <entry class="wide">
        <type class="generic dotted"><code>IterMut&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">Iterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = &mut T;</code></associated-type>
    </entry>
</mini-zoo>

{{ tablesep() }}

> The code for borrowing interator support is basically just a repetition of the previous steps with a slightly different types, e.g., `&T` vs `T`.


</div></panel></tab>




<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-4" name="tab-group-trait-iter">
<label for="tab-trait-iter-4"><b>Interoperability</b></label>
<panel><div>


**Iterator Interoperability**

To allow **3<sup>rd</sup> party iterators** to 'collect into' your collection implement:

* **`impl FromIterator for Collection<T> {}`** &mdash; Now `some_iter.collect::<Collection<_>>()` works.
* **`impl Extend for Collection<T> {}`** &mdash; Now `c.extend(other)` works.

In addition, also consider adding the extra traits from **`std::iter`** {{ std(page="std/iter/index.html#") }} to your previous structs:

<mini-zoo class="zoo" style="margin-right: 20px;">
    <entry class="wide">
        <type class="generic dotted"><code>Collection&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">FromIterator</code></trait-impl>
        <trait-impl class="">⌾ <code style="">Extend</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry class="wide">
        <type class="generic dotted"><code>IntoIter&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">DoubleEndedIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">ExactSizeIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">FusedIterator </code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry class="wide">
        <type class="generic dotted"><code>Iter&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">DoubleEndedIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">ExactSizeIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">FusedIterator </code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry class="wide">
        <type class="generic dotted"><code>IterMut&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">DoubleEndedIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">ExactSizeIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">FusedIterator </code></trait-impl>
    </entry>
</mini-zoo>



{{ tablesep() }}

> Writing collections can be work. The good news is, if you followed all
> these steps your collections will feel like _first class citizens_.


</div></panel></tab>

</tabs>
