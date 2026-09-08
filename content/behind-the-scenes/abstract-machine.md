+++
title = "The Abstract Machine"
description = "How Rust's abstract machine defines valid program behavior and enables compiler optimizations."
weight = 15
template = "topic.html"

[extra]
seo_title = "The Abstract Machine"
anchor = "the-abstract-machine"
previous = "/language-constructs/miscellaneous/"
previous_title = "Miscellaneous"
next = "/behind-the-scenes/language-sugar/"
next_title = "Language Sugar"
print = true
+++
Like `C` and `C++`, Rust is based on an _abstract machine_.


<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-abstract-machine-1" name="tab-group-abstract-machine" checked>
<label for="tab-abstract-machine-1"><b>Overview</b></label>
<panel><div>


<div style="text-align: center;">

<mini-zoo class="zoo" style="text-align: center;">
    <entry>
        <machine class="bad">Rust</machine>
    </entry>
    <code style="text-align:center;">→</code>
    <entry>
        <machine class="bad">CPU</machine>
    </entry>
    <br/>
    <note>{{bad()}} Misleading.</note>
</mini-zoo>

<mini-zoo class="zoo" style="text-align: center; margin-left: 80px;">
    <entry>
        <machine class="good">Rust</machine>
    </entry>
    <code style="text-align:center">→</code>
    <entry style="width: 120px;">
        <machine class="good">Abstract Machine</machine>
    </entry>
    <code style="text-align:center">→</code>
    <entry>
        <machine class="good">CPU</machine>
    </entry>
    <br/>
    <note>Correct.</note>
</mini-zoo>

</div>

{{ tablesep() }}

With rare exceptions you are never 'allowed to reason' about the actual CPU. You write code for an _abstracted_ CPU. Rust then (sort of) understands what you want, and translates that into actual RISC-V / x86 / … machine code.


{{ tablesep() }}


This _abstract machine_
- is not a runtime, and does not have any runtime overhead, but is a _computing model abstraction_,
- contains concepts such as memory regions (_stack_, …), execution semantics, …
- _knows_ and _sees_ things your CPU might not care about,
- is de-facto a contract between you and the compiler,
- and **exploits all of the above for optimizations**.


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-abstract-machine-2" name="tab-group-abstract-machine">
<label for="tab-abstract-machine-2"><b>Misconceptions</b></label>
<panel><div>

<div class="color-header abstract-machine">

On the left things people may incorrectly assume they _should get away with_ if Rust targeted CPU directly. On the right things you'd interfere with if in reality if you violate the AM contract.

{{ tablesep() }}

| Without AM | With AM |
|---------|-------------|
| `0xffff_ffff` would make a valid `char`. {{ bad() }} | AM may exploit _'invalid'_ bit patterns to pack unrelated data.  |
| `0xff` and `0xff` are same pointer. {{ bad() }} | AM pointers can have **provenance** {{ std(page="std/ptr/index.html#provenance")}} for optimization.  |
| Any r/w on pointer `0xff` always fine. {{ bad() }} | AM may issue cache-friendly ops since _'no read possible'_.  |
| Reading un-init just gives random value. {{ bad() }} | AM _'knows'_ read impossible, may remove all related code.  |
| Data race just gives random value. {{ bad() }} | AM may split R/W, produce _impossible_ value. {{ below(target="/standard-library/atomics-cache/#atomics-cache") }}  |
| Null ref. is just `0x0` in some register. {{ bad() }} | Holding `0x0` in reference summons Cthulhu.  |

{{ tablesep() }}

> This table is only to outline what the AM does. Unlike C or C++, Rust never lets you do the wrong thing unless you force it with `unsafe`. {{ below(target="/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined") }}

</div>
</div></panel></tab>


</tabs>

<!--  -->
<!-- > Practically this means: -->
<!-- > - before assuming your **CPU** will do `A` when writing `B` you need positive proof **via documentation**(!), -->
<!-- > - if you don't have that any physical behavior is _coincidental_, -->
<!-- > - violate the abtract machine's contract and the optimizer makes your CPU do something **entirely else** &mdash; **undefined behavior**.{{ below(target="/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined")}} -->
<!--  -->
