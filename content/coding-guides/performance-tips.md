+++
title = "Performance Tips"
description = "Practical Rust performance guidance for builds, CPU use, allocations, collections, and I/O."
weight = 38
template = "topic.html"

[extra]
seo_title = "Performance Tips"
anchor = "performance-tips"
previous = "/coding-guides/idiomatic-rust/"
previous_title = "Idiomatic Rust"
next = "/coding-guides/async-await-101/"
next_title = "Async-Await 101"
print = true
+++
"My code is slow" sometimes comes up when porting microbenchmarks to Rust, or after profiling.

<div class="color-header blue">

| Rating | Name | Description |
| --- | --- |--- |
| {{ tbl_boost() }}{{ tbl_simple() }} | **Release Mode** {{ book(page="ch01-03-hello-cargo.html") }} {{ hot() }} |  Always do `cargo build --release` for massive speed boost. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ noemoji1() }}{{ tbl_risk() }} | **Target Native CPU** {{ link(url="https://doc.rust-lang.org/rustc/codegen-options/index.html#target-cpu") }} | Add `rustflags = ["-Ctarget-cpu=native"]` to `config.toml`. {{ above(target = "/tooling/project-anatomy/#project-anatomy") }} |
| {{ noemoji1() }}{{ tbl_simple() }}{{ tbl_tradeoff() }} | **Codegen Units** {{ link(url="https://doc.rust-lang.org/rustc/codegen-options/index.html#codegen-units") }} | Codegen units `1` may yield faster code, slower compile. |
| {{ noemoji1() }}{{ tbl_simple() }} | **Reserve Capacity** {{ std(page="std/?search=with_capacity") }}  | Pre-allocation of collections reduces allocation pressure. |
| {{ noemoji1() }}{{ tbl_simple() }} | **Recycle Collections** {{ std(page="std/index.html?search=clear") }} | Calling `x.clear()` and reusing `x` prevents allocations. |
| {{ noemoji1() }}{{ tbl_simple() }} | **Append to Strings** {{ std(page="std/macro.write.html") }} | Using `write!(&mut s, "{}")` can prevent extra allocation. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ tbl_tradeoff() }} | **Global Allocator** {{ std(page="std/alloc/index.html#the-global_allocator-attribute") }} | On some platforms ext. allocator (e.g., **mimalloc** {{ link(url="https://crates.io/crates/mimalloc") }}) faster. |
| | **Bump Allocations** {{ link(url="https://docs.rs/bumpalo/latest/bumpalo/") }} | Cheaply gets _temporary_, dynamic memory, esp. in hot loops. |
|  | **Batch APIs** | Design APIs to handle multiple similar elements at once, e.g., slices. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **SoA** / **AoSoA** {{ link(url="https://web.archive.org/web/20240815193855/https://www.rustsim.org/blog/2020/03/23/simd-aosoa-in-nalgebra/") }} | Beyond that consider _struct of arrays_ (SoA) and similar. |
| {{ tbl_boost() }}{{ noemoji1() }}{{ tbl_tradeoff() }} | **SIMD** {{ std(page="std/simd/index.html") }} {{ experimental() }} | Inside (math heavy) batch APIs using SIMD can give 2x - 8x boost. |
|  | **Reduce Data Size**  | Small types (e.g, `u8` vs `u32`, niches{{ todo() }}) and data have better cache use. |
|  | **Keep Data Nearby** {{ link(url="https://en.wikipedia.org/wiki/Data-oriented_design" ) }} | Storing often-used data _nearby_ can improve memory access times. |
|  | **Pass by Size** {{ link(url="https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#reason-45" ) }} | Small (2-3 words) structs best passed by value, larger by reference. |
|  {{ noemoji2() }}{{ tbl_tradeoff() }} | **Async-Await** {{ link( url = "https://rust-lang.github.io/async-book/01_getting_started/01_chapter.html") }} | If _parallel waiting_ happens a lot (e.g., server I/O) `async` good idea. |
|  | **Threading** {{ std(page="std/thread/index.html") }} | Threads allow you to perform _parallel work_ on mult. items at once. |
| {{ tbl_boost() }} | ... **in app** | Often good for apps, as lower wait times means better UX. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | ... **inside libs** | Opaque _t._ use _inside_ lib often not good idea, can be too opinionated. |
| {{ tbl_boost() }}{{ noemoji1() }} | ... **for lib callers** | However, allowing _your user_ to process _you_ in parallel excellent idea. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Avoid Locks**| Locks in multi-threaded code kills parallelism.  |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Avoid Atomics**| Needless atomics (e.g., `Arc` vs `Rc`) impact other memory access. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Avoid False Sharing** {{ link(url="https://en.wikipedia.org/wiki/False_sharing") }}| Make sure data R/W by different CPUs at least 64 bytes apart. {{ link(url="https://igoro.com/archive/gallery-of-processor-cache-effects/")}}  |
| {{ tbl_boost() }}{{ tbl_simple() }} | **Buffered I/O** {{ std(page="std/io/index.html#bufreader-and-bufwriter") }} {{ hot() }} | Raw `File` I/O highly inefficient w/o buffering. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ noemoji1() }}{{ tbl_risk() }} | **Faster Hasher** {{ link(url="https://lib.rs/crates/seahash") }} | Default `HashMap` {{ std(page="std/collections/struct.HashMap.html") }} hasher DoS attack-resilient but slow. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ noemoji1() }}{{ tbl_risk() }} | **Faster RNG**  | If you use a crypto RNG consider swapping for non-crypto. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Avoid Trait Objects** {{ link(url="https://stackoverflow.com/questions/28621980/what-are-the-actual-runtime-performance-costs-of-dynamic-dispatch") }} | T.O. reduce code size, but increase memory indirection. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Defer Drop** {{ link(url="https://abrams.cc/rust-dropping-things-in-another-thread") }} | Dropping _heavy_ objects in dump-thread can free up current one. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ noemoji1() }}{{ tbl_risk() }} | **Unchecked APIs**  {{ std(page="std/?search=unchecked") }} | If you are 100% confident, `unsafe { unchecked_ }` skips checks. |

</div>


<footnotes>

Entries marked {{ tbl_boost() }} often come with a massive (> 2x) performance boost, {{ tbl_simple() }} are easy to implement even after-the-fact, {{ tbl_tradeoff() }} might have costly side effects (e.g., memory, complexity), {{ tbl_risk() }} have special risks (e.g., security, correctness).

</footnotes>

{{ tablesep() }}

> **Profiling Tips** {{ opinionated() }}
>
> Profilers are indispensable to identify hot spots in code. For the best experience add this to your <code class="ignore-auto language-bash">Cargo.toml</code>:
> ```cargo
> [profile.release]
> debug = true
> ```
> Then do a `cargo build --release` and run the result with [**Superluminal**](https://superluminal.eu/rust/) (Windows) or [**Instruments**](https://en.wikipedia.org/wiki/Instruments_%28software%29) (macOS).
> That said, there are many performance opportunities profilers won't find, but that need to be _designed in_.

{{ tablesep() }}
