+++
title = "Basic Types"
description = "Memory layouts for Rust booleans, numbers, text, tuples, arrays, slices, structs, enums, and pointers."
weight = 18
template = "topic.html"

[extra]
seo_title = "Basic Types"
anchor = "basic-types"
previous = "/behind-the-scenes/memory-lifetimes/"
previous_title = "Memory & Lifetimes"
next = "/memory-layout/custom-types/"
next_title = "Custom Types"
print = true
+++
Essential types built into the core of the language.



### Boolean {{ ref(page="types/boolean.html") }} and Numeric Types {{ ref(page="types/numeric.html") }}

<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>bool</code></name>
    <visual class="bool">
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>u8</code>, <code>i8</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced" >
    <name><code>u16</code>, <code>i16</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum  class="spaced">
    <name><code>u32</code>, <code>i32</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum  class="spaced">
    <name><code>u64</code>, <code>i64</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum  class="spaced">
    <name><code>u128</code>, <code>i128</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>usize</code>, <code>isize</code></name>
    <visual class="sized">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte style="border-color: #888;"><code></code></byte>
        <byte style="border-color: #888;"><code></code></byte>
        <byte style="border-color: #aaa;"><code></code></byte>
        <byte style="border-color: #aaa;"><code></code></byte>
        <byte style="border-color: #aaa;"><code></code></byte>
        <byte style="border-color: #aaa;"><code></code></byte>
    </visual>
    <zoom>
        Same as <code>ptr</code> on platform.
    </zoom>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>f16</code> {{ experimental() }} </name>
    <visual class="float">
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>f32</code></name>
    <visual class="float">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>f64</code></name>
    <visual class="float">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>f128</code> {{ experimental() }} </name>
    <visual class="float">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>



<br/>


{{ tablesep() }}


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-1" name="tab-group-numeric" checked>
<label for="tab-numeric-1"><b>Unsigned Types</b></label>
<panel><div>



|Type|Max Value|
|---|---|
|`u8`| `255` |
|`u16` | `65_535` |
|`u32`| `4_294_967_295` |
|`u64`| `18_446_744_073_709_551_615` |
|`u128`| `340_282_366_920_938_463_463_374_607_431_768_211_455` |
|`usize`| Depending on platform pointer size, same as `u16`, `u32`, or `u64`. |


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-3" name="tab-group-numeric">
<label for="tab-numeric-3"><b>Signed Types</b></label>
<panel><div>



|Type |Max Value|
|---|---|
|`i8`| `127` |
|`i16` | `32_767` |
|`i32`| `2_147_483_647` |
|`i64`| `9_223_372_036_854_775_807` |
|`i128`| `170_141_183_460_469_231_731_687_303_715_884_105_727` |
|`isize`| Depending on platform pointer size, same as `i16`, `i32`, or `i64`. |

{{ tablesep() }}

|Type |Min Value|
|---|---|
|`i8`| `-128` |
|`i16` | `-32_768` |
|`i32`| `-2_147_483_648` |
|`i64`| `-9_223_372_036_854_775_808` |
|`i128`| `-170_141_183_460_469_231_731_687_303_715_884_105_728` |
|`isize`| Depending on platform pointer size, same as `i16`, `i32`, or `i64`. |


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-6" name="tab-group-numeric">
<label for="tab-numeric-6"><b>Float Types</b></label>
<panel><div>


| Type | Max value | Min pos value | Max lossless integer<sup>1</sup> |
|---|---|---| ---|
| `f16` {{ experimental() }} | 65504.0 | 6.10 ⋅ 10 <sup>-5</sup> | `2048`  |
| `f32` | 3.40 ⋅ 10 <sup>38</sup> | 3.40 ⋅ 10 <sup>-38</sup> | `16_777_216` |
| `f64` | 1.79 ⋅ 10 <sup>308</sup> | 2.23 ⋅ 10 <sup>-308</sup> | `9_007_199_254_740_992` |
| `f128` {{ experimental() }} | 1.19 ⋅ 10 <sup>4932</sup>  |  3.36 ⋅ 10 <sup>-4932</sup> | 2.07 ⋅ 10 <sup>34</sup> |

<footnotes>

<sup>1</sup> The maximum integer `M` so that all other integers `0 <= X <= M` can be
losslessly represented in that type. In other words, there might be larger integers
that could still be represented losslessly (e.g., `65504` for `f16`), but up until that
value a lossless representation is guaranteed.

</footnotes>

{{ tablesep() }}

> Float values approximated for visual clarity. Negative limits are values multipled with -1.

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-2" name="tab-group-numeric">
<label for="tab-numeric-2"><b>Float Internals</b>{{ esoteric() }}</label>
<panel><div>


Sample bit representation<sup>*</sup> for a `f32`:

<!-- NEW ENTRY -->
<datum style="opacity:0.7; margin-bottom:10px;">
    <visual class="float">
    <bitgroup>
        <bit><code>S</code></bit>
    </bitgroup>
    <bitgroup>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
    </bitgroup>
    <bitgroup>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
    </bitgroup>
    </visual>
</datum>

{{ tablesep() }}

Explanation:

| f32 | S (1) | E (8) | F (23) | Value |
|------| ---------| ---------| ---------| ---------|
| Normalized number | ± | 1 to 254 | any | ±(1.F)<sub>2</sub> * 2<sup>E-127</sup>  |
| Denormalized number | ± | 0 | non-zero | ±(0.F)<sub>2</sub> * 2<sup>-126</sup>  |
| Zero | ± | 0 | 0 | ±0  |
| Infinity | ± | 255 | 0 | ±∞  |
| NaN | ± | 255 | non-zero | NaN  |

{{ tablesep() }}

Similarly, for <code>f64</code> types this would look like:

| f64 | S (1) | E (11) | F (52) | Value |
|------| ---------| ---------| ---------| ---------|
| Normalized number | ± | 1 to 2046 | any | ±(1.F)<sub>2</sub> * 2<sup>E-1023</sup>  |
| Denormalized number | ± | 0 | non-zero | ±(0.F)<sub>2</sub> * 2<sup>-1022</sup>  |
| Zero | ± | 0 | 0 | ±0  |
| Infinity | ± | 2047 | 0 | ±∞  |
| NaN | ± | 2047 | non-zero | NaN  |

<footnotes>
    <sup>*</sup> Float types follow <a href="https://en.wikipedia.org/wiki/IEEE_754-2008_revision">IEEE 754-2008</a> and depend on platform endianness.
</footnotes>

</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-4" name="tab-group-numeric">
<label for="tab-numeric-4"><b>Casting Pitfalls</b> {{ bad() }}</label>
<panel><div class="">


| Cast<sup>1</sup> | Gives | Note |
| --- | --- | --- |
| `3.9_f32 as u8` | `3` | Truncates, consider `x.round()` first. |
| `314_f32 as u8` | `255` | Takes closest available number. |
| `f32::INFINITY as u8` | `255` | Same, treats `INFINITY` as _really_ large number.|
| `f32::NAN as u8` | `0` | - |
| `_314 as u8` | `58` | Truncates excess bits. |
| `_257 as i8` | `1` | Truncates excess bits. |
| `_200 as i8` | `-56` | Truncates excess bits, MSB might then also signal negative. |

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-5" name="tab-group-numeric">
<label for="tab-numeric-5"><b>Arithmetic Pitfalls</b> {{ bad() }}</label>
<panel><div class="">

| Operation<sup>1</sup> | Gives | Note |
| --- | --- | --- |
| `200_u8 / 0_u8` | Compile error. | - |
| `200_u8 / _0` <sup>d, r</sup> | Panic. | Regular math may panic; here: division by zero. |
| `200_u8 + 200_u8` |  Compile error. | - |
| `200_u8 + _200` <sup>d</sup> | Panic. | Consider `checked_`, `wrapping_`, … instead. {{ std(page="std/primitive.isize.html#method.checked_add") }}|
| `200_u8 + _200` <sup>r</sup> | `144` | In release mode this will overflow. |
| `-128_i8 * -1` | Compile error. | Would overflow (`128_i8` doesn't exist). |
| `-128_i8 * _1neg` <sup>d</sup> | Panic. | - |
| `-128_i8 * _1neg` <sup>r</sup> | `-128` | Overflows back to `-128` in release mode. |
| `1_u8 / 2_u8` | `0` | Other integer division truncates. |
| `0.8_f32 + 0.1_f32` | `0.90000004` | - |
| `1.0_f32 / 0.0_f32` | `f32::INFINITY` | - |
| `0.0_f32 / 0.0_f32` | `f32::NAN` | - |
| `x < f32::NAN` | `false` | `NAN` comparisons always return false. |
| `x > f32::NAN` | `false` | `NAN` comparisons always return false. |
| `f32::NAN == f32::NAN` | `false` | Use `f32::is_nan()` {{ std(page="std/primitive.f32.html#method.is_nan") }} instead. |

</div></panel></tab>


<!-- End tabs -->
</tabs>

<!-- End overflow prevention -->
</div></div>


<footnotes>

<sup>1</sup> Expression `_100` means anything that might contain the value `100`, e.g., `100_i32`, but is opaque to compiler.<br/>
<sup>d</sup> Debug build.<br/>
<sup>r</sup> Release build.<br/>

</footnotes>


{{ tablesep() }}



### Textual Types {{ ref(page="types/textual.html") }}


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>char</code></name>
    <visual class="char">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
    <description>Any Unicode scalar.</description>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>str</code></name>
    <visual>
        <note>…</note>
        <byte class="bytes"><code>U</code></byte>
        <byte class="bytes"><code>T</code></byte>
        <byte class="bytes"><code>F</code></byte>
        <byte class="bytes"><code>-</code></byte>
        <byte class="bytes"><code>8</code></byte>
        <note>… unspecified times</note>
    </visual>
    <description>Rarely seen alone, but as <code>&str</code> instead.</description>
</datum>


{{ tablesep() }}

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-textual-3" name="tab-group-textual" checked>
<label for="tab-textual-3"><b>Basics</b></label>
<panel><div>

| Type | Description |
|---------|-------------|
| `char` | Always 4 bytes and only holds a single Unicode **scalar value** {{ link(url="https://www.unicode.org/glossary/#unicode_scalar_value") }}. |
| `str` | An `u8`-array of unknown length guaranteed to hold **UTF-8 encoded code points**. |

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-textual-1" name="tab-group-textual">
<label for="tab-textual-1"><b>Usage</b></label>
<panel><div>



<!-- Notice how:

- `char` is always 4 bytes and only holds a single Unicode **scalar value** {{ link(url="https://www.unicode.org/glossary/#unicode_scalar_value") }}, thus possibly wasting space.
- `str` is a byte-array of unknown length guaranteed to hold **UTF-8 encoded code points** (but harder to index).
 -->

| Chars | Description |
|---------|-------------|
| `let c = 'a';` | Often a `char` (unicode scalar) can coincide with your intuition of _character_. |
| `let c = '❤';` | It can also hold many Unicode symbols. |
| `let c = '❤️';` | But not always. Given emoji is **two** `char` (see Encoding) and **can't** {{ bad() }} be held by `c`.<sup>1</sup> |
| `c = 0xffff_ffff;` | Also, chars are **not allowed** {{ bad() }} to hold arbitrary bit patterns. |

<footnotes>
    <sup>1</sup> Fun fact, due to the <a href="https://en.wikipedia.org/wiki/Zero-width_joiner">Zero-width joiner</a> (⨝) what the user <i>perceives as a character</i> can get even more unpredictable: 👨‍👩‍👧 is in fact 5 chars 👨⨝👩⨝👧, and rendering engines are free to either show them fused as one, or separately as three, depending on their abilities.
</footnotes>


{{ tablesep() }}

| Strings | Description |
|---------|-------------|
| `let s = "a";` | A `str` is usually never held directly, but as `&str`, like `s` here. |
| `let s = "❤❤️";` | It can hold arbitrary text, has variable length per _c._, and is hard to index. |


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-textual-2" name="tab-group-textual">
<label for="tab-textual-2"><b>Encoding</b>{{ esoteric() }}</label>
<panel><div>


`let s = "I ❤ Rust"; ` <br>
`let t = "I ❤️ Rust";`

| Variant | Memory Representation<sup>2<sup> |
|---------|-------------|
| `s.as_bytes()` | `49` `20` <span class="force-code-color same-black"><b>`e2 9d a4`</b> </span> `20 52 75 73 74` <sup>3<sup> |
| `t.as_bytes()` | `49` `20` <span class="force-code-color same-black"><b>`e2 9d a4`</b> </span> <span class="force-code-color same-red"><b>`ef b8 8f`</b></span> `20 52 75 73 74` <sup>4<sup> |
| `s.chars()`<sup>1<sup> | `49 00 00 00 20 00 00 00` <span class="force-code-color same-black"><b>`64 27 00 00` </b></span> `20 00 00 00 52 00 00 00 75 00 00 00 73 00` &hellip; |
| `t.chars()`<sup>1<sup> | `49 00 00 00 20 00 00 00` <span class="force-code-color same-black"><b>`64 27 00 00`</b></span> <span class="force-code-color same-red"><b>`0f fe 00 00`</b></span> `20 00 00 00 52 00 00 00 75 00` &hellip; |

{{ tablesep() }}

<footnotes>
    <sup>1</sup> Result then collected into array and transmuted to bytes, <a href="https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=4303e6e40f3e971901409552bae88ac0">compare here</a>.<br>
    <sup>2</sup> Values given in hex, on x86.<br>
    <sup>3</sup> Notice how <code>❤</code>, having <a href="https://codepoints.net/U+2764">Unicode Code Point (U+2764)</a>, is represented as <span class="force-code-color same-black"><b>64 27 00 00</b></span> inside the <code>char</code>, but got <a href="https://en.wikipedia.org/wiki/UTF-8#Description">UTF-8 encoded to</a> <span class="force-code-color same-black"><b>e2 9d a4</b></span> in the <code>str</code>.<br>
    <sup>4</sup> Also observe how the emoji <a href="https://emojipedia.org/red-heart/">Red Heart <code>❤️</code></a>, is a combination of <code>❤</code> and the <a href="https://codepoints.net/U+FE0F">U+FE0F Variation Selector-16</a>, thus <code>t</code> has a higher char count than <code>s</code>.
</footnotes>

{{ tablesep() }}


<footnotes>

> <sup>⚠️</sup> For what seem to be browser bugs Safari and Edge render the hearts in Footnote 3 and 4 wrong, despite being able to differentiate them correctly in `s` and `t` above.

</footnotes>

</div></panel></tab>


<!-- End tabs -->
</tabs>


{{ tablesep() }}
