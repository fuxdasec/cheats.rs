+++
title = "Atomics & Cache"
description = "Rust atomics, memory ordering, cache coherence, and synchronization behavior."
weight = 25
template = "topic.html"

[extra]
seo_title = "Atomics & Cache"
anchor = "atomics-cache"
previous = "/standard-library/thread-safety/"
previous_title = "Thread Safety"
next = "/standard-library/iterators/"
next_title = "Iterators"
print = true
+++
CPU cache, memory writes, and how atomics affect it.

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">


<lifetime-section>
<lifetime-example>
    <memory-row style="cursor: default;">
        <memory-backdrop>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">S</byte>
            <byte class="t">O</byte>
            <byte class="t">M</byte>
            <byte class="t">E</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">D</byte>
            <byte class="t">R</byte>
            <byte class="t">A</byte>
            <byte class="t">M</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">D</byte>
            <byte class="t">A</byte>
            <byte class="t">T</byte>
            <byte class="t">A</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <line-comment>Main Memory</line-comment>
        </memory-backdrop>
    </memory-row>
</lifetime-example>
</lifetime-section>

<lifetime-section>
<lifetime-example>
    <memory-row style="cursor: default;">
        <memory-backdrop>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">S</byte>
            <byte class="cpu1">O</byte>
            <byte class="cpu1">M</byte>
            <byte class="cpu1">E</byte>
            <container><tag>(E)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">D</byte>
            <byte class="cpu1">A</byte>
            <byte class="cpu1">T</byte>
            <byte class="cpu1">A</byte>
            <container><tag>(S)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>CPU1 Cache</line-comment>
        </memory-backdrop>
    </memory-row>
    <memory-row style="cursor: default;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2 borrowed">S</byte>
            <byte class="cpu2">R</byte>
            <byte class="cpu2">A</byte>
            <byte class="cpu2">M</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2">D</byte>
            <byte class="cpu2">A</byte>
            <byte class="cpu2">T</byte>
            <byte class="cpu2">A</byte>
            <container><tag>(S)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>CPU2 Cache</line-comment>
        </memory-backdrop>
    </memory-row>
</lifetime-example>
</lifetime-section>

<!-- end overflow -->
</div>
</div>

<footnotes>

Modern CPUs don't accesses memory directly, only their cache. Each CPU has its own cache, 100x faster than RAM, but much smaller. It comes in **cache lines**,{{ link(url="https://stackoverflow.com/questions/3928995/how-do-cache-lines-work") }} some _sliced_ window of bytes, which track if it's an exclusive (E), shared (S) or modified (M) {{ link(url="https://en.wikipedia.org/wiki/MESI_protocol") }} view of the main memory. Caches talk to each other to ensure **coherence**,{{ link(url="https://gfxcourses.stanford.edu/cs149/fall20content/media/cachecoherence/10_coherence.pdf")}}
i.e., 'small-enough' data will be 'immediately' seen by all other CPUs, but that may stall the CPU.

</footnotes>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

<lifetime-section>
<lifetime-example class="not-first">
    <memory-row style="cursor: default;">
        <memory-backdrop>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">S</byte>
            <byte class="cpu1">O</byte>
            <byte class="cpu1">M</byte>
            <byte class="cpu1">E</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">D</byte>
            <byte class="cpu1 borrowed">X</byte>
            <byte class="cpu1">T</byte>
            <byte class="cpu1">A</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Cycle 1</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="t byte2 maybe-borrowed" style="left: 96px;">O3</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">S</byte>
            <byte class="cpu1">O</byte>
            <byte class="cpu1">M</byte>
            <byte class="cpu1 borrowed">4</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2">D</byte>
            <byte class="cpu2">X</byte>
            <byte class="cpu2">T</byte>
            <byte class="cpu2">A</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Cycle 2</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="t byte2 borrowed" style="left: 96px;">23</value>
            <value class="stalled" style="left: 350px;">STALLED</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1 borrowed">1</byte>
            <byte class="cpu1"></byte>
            <byte class="cpu1"></byte>
            <byte class="cpu1 borrowed">4</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2">D</byte>
            <byte class="cpu2">X</byte>
            <byte class="cpu2">T</byte>
            <byte class="cpu2 borrowed">Y</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Cycle 3</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="t byte2 borrowed" style="left: 96px;">23</value>
        </values>
    </memory-row>
</lifetime-example>
</lifetime-section>

<!-- end overflow -->
</div>
</div>


<footnotes>

Left: Both compiler _and_ CPUs are free to **re-order** {{ link(url="https://en.wikipedia.org/wiki/Memory_ordering")}} and split R/W memory access. Even if you explicitly said `write(1); write(23); write(4)`, your compiler might think it's a good idea to write `23` first; in addition your CPU might insist on splitting the write, doing `3` before `2`. Each of these steps could be observable (even the _impossible_ `O3`) by CPU2 via an `unsafe` _data race_. Reordering is also fatal for locks.

Right: Semi-related, even when two CPUs do not attempt to access each other's data (e.g., update 2 independent variables), they might still experience a significant performance loss if the underlying memory is mapped by 2 cache lines (**false sharing**).{{ link(url="https://docs.kernel.org/kernel-hacking/false-sharing.html")}}

</footnotes>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

<lifetime-section>
<lifetime-example class="not-first">
    <memory-row style="cursor: default;">
        <memory-backdrop>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">1</byte>
            <byte class="t">2</byte>
            <byte class="t">3</byte>
            <byte class="t">4</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">S</byte>
            <byte class="t">R</byte>
            <byte class="t">A</byte>
            <byte class="t">M</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">D</byte>
            <byte class="t">X</byte>
            <byte class="t">T</byte>
            <byte class="t">Y</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <line-comment>Main Memory</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="atomic byte2" style="left: 246px;">RA</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default; margin-top: 40px;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2 borrowed">1</byte>
            <byte class="cpu2">R</byte>
            <byte class="cpu2">A</byte>
            <byte class="cpu2">M</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Cycle 4</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="atomic byte2" style="left: 246px;">RA</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default; margin-top: 40px;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2 borrowed">1</byte>
            <byte class="cpu2">2</byte>
            <byte class="cpu2"></byte>
            <byte class="cpu2">M</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Cycle 5</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="atomic byte2 borrowed" style="left: 246px;">23</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default; margin-top: 40px;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2 borrowed">1</byte>
            <byte class="cpu2">2</byte>
            <byte class="cpu2">3</byte>
            <byte class="cpu2 borrowed">4</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Cycle 6</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="atomic byte2 borrowed" style="left: 246px;">23</value>
        </values>
    </memory-row>
</lifetime-example>
</lifetime-section>

<!-- end overflow -->
</div>
</div>


<footnotes>

Atomics address the above issues by doing two things, they

- make sure a read / write / update is not partially observable by temporarily locking cache lines in other CPUs,
- force both the compiler and the CPU to not re-order _'unrelated'_ access around it (i.e., act as a **fence** {{ std(page="std/sync/atomic/fn.fence.html")}}). Ensuring multiple CPUs agree on the relative order of these other ops is called  **consistency**. {{ link(url="https://gfxcourses.stanford.edu/cs149/winter19content/lectures/09_consistency/09_consistency_slides.pdf" )}} This also comes at a cost of missed performance optimizations.

</footnotes>


{{ tablesep() }}

> **Note** &mdash; The above section is greatly simplified. While the issues of coherence and consistency are universal, CPU architectures differ a lot in how they implement caching and atomics, and in their performance impact.





{{ tablesep() }}

<div class="color-header atomics">

| {{ tab() }} A. Ordering  | Explanation |
| --- | --- |
| **`Relaxed`** {{ std(page="std/sync/atomic/enum.Ordering.html#variant.Relaxed") }} | Full reordering. Unrelated R/W can be freely shuffled around the atomic. |
| **`Release`** {{ std(page="std/sync/atomic/enum.Ordering.html#variant.Release") }}<sup>, 1</sup> | When writing, ensure other data loaded by 3<sup>rd</sup> party `Acquire` is seen after this write. |
| **`Acquire`** {{ std(page="std/sync/atomic/enum.Ordering.html#variant.Acquire") }}<sup>, 1</sup> | When reading, ensures other data written before 3<sup>rd</sup> party `Release` is seen after this read. |
| **`SeqCst`** {{ std(page="std/sync/atomic/enum.Ordering.html#variant.SeqCst") }} | No reordering around atomic. All unrelated reads and writes stay on proper side. |

</div>

<footnotes>

<sup>1</sup> To be clear, when synchronizing memory access with 2+ CPUs, _all_ must use `Acquire` or `Release` (or stronger). The writer must ensure that all other data it wishes to _release_ to memory are put before the atomic signal, while the readers who wish to _acquire_ this data must ensure that their other reads are only done after the atomic signal.

</footnotes>
