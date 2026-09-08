+++
title = "Hello, Rust!"
description = "A compact introduction to Rust strengths, installation, first steps, and a runnable Hello World example."
weight = 1
template = "topic.html"

[extra]
seo_title = "Hello, Rust!"
anchor = "hello-rust"
previous = "/"
previous_title = "Home"
next = "/language-constructs/data-structures/"
next_title = "Data Structures"
print = false
+++
If you are new to Rust, or if you want to try the things below:


<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-1" name="tab-hello" checked/>
<label for="tab-hello-1"><b>Hello World</b></label>
<panel><div>
<div id="hellostatic">

```rust
fn main() {
    println!("Hello, world!");
}
```


</div>
<div id="helloplay"></div>
<div id="helloinfo">Service provided by <a href="https://play.rust-lang.org/" target="_blank" rel="noopener">play.rust-lang.org <sup>🔗</sup></a></div>
<div id="helloctrl"><a href="javascript:show_playground(true);">▶️ Edit & Run</a></div>
</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-3" name="tab-hello">
<label for="tab-hello-3"><b>Strengths</b></label>
<panel><div>

**Things Rust does measurably really well**

- Compiled code [about same performance](https://benchmarksgame-team.pages.debian.net/benchmarksgame/box-plot-summary-charts.html) as C / C++, and excellent memory and energy efficiency.
- Can [avoid 70% of all safety issues](https://www.chromium.org/Home/chromium-security/memory-safety) present in C / C++, and most memory issues.
- Strong type system prevents [data races](https://doc.rust-lang.org/nomicon/races.html), brings ['fearless concurrency'](https://blog.rust-lang.org/2015/04/10/Fearless-Concurrency.html) (amongst others).
- Seamless C interop, and [dozens of supported platforms](https://doc.rust-lang.org/rustc/platform-support.html) (based on LLVM).
- ["Most loved or admired language"](https://survey.stackoverflow.co/2023/#section-admired-and-desired-programming-scripting-and-markup-languages) for <strike>4</strike> <strike>5</strike> <strike>6</strike> <strike>7</strike> 8 years in a row. 🤷‍♀️
- Modern tooling: `cargo` (builds _just work_), `clippy` (700+ code quality lints), `rustup` (easy toolchain mgmt).

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-4" name="tab-hello">
<label for="tab-hello-4"><b>Weaknesses</b></label>
<panel><div>

**Points you might run into**

- Steep learning curve;<sup>1</sup> compiler enforcing (esp. memory) rules that would be "best practices" elsewhere.
- Missing Rust-native libs in some domains, target platforms (esp. embedded), IDE features.<sup>1</sup>
- Longer compile times than "similar" code in other languages.<sup>1</sup>
- Careless (use of `unsafe` in) libraries can secretly break safety guarantees.
- ~~No formal language specification~~, {{ link(url="https://spec.ferrocene.dev/") }} ~~can prevent legal use in some domains (aviation, medical, &hellip;)~~. {{ link(url="https://ferrous-systems.com/ferrocene/") }}
- Rust Foundation may offensively use their IP to affect _'Rust'_ projects (e.g, forbid names, impose policies). {{ link(url="https://devclass.com/2023/04/11/dont-call-it-rust-community-complains-about-draft-trademark-policy-restricting-use-of-word-marks/") }}{{ link(url="https://web.archive.org/web/20230413161930/https://old.reddit.com/r/rust/comments/12e7tdb/rust_trademark_policy_feedback_form/") }}<sup>2</sup>


<sup>1</sup> Compare [Rust Survey](https://blog.rust-lang.org/2020/04/17/Rust-survey-2019.html#why-not-use-rust). <br>
<sup>2</sup> Avoiding their marks (e.g, in your name, URL, logo, dress) is probably sufficient.

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-5" name="tab-hello">
<label for="tab-hello-5"><b>Installation</b></label>
<panel><div>

**Download**
- Get installer from [**rustup.rs**](https://rustup.rs/) (highly recommended){{ hot() }}


**IDEs**
- [**Rust Rover**](https://www.jetbrains.com/rust/) (free for non-commercial)
- [Visual Studio Code](https://code.visualstudio.com/) with [**rust-analyzer**](https://rust-analyzer.github.io/) (free)


</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-6" name="tab-hello">
<label for="tab-hello-6"><b>First Steps</b></label>
<panel><div>

<!-- Note - Please ONLY submit PRs linking to high-quality, "permanent" sites
            dedicated to learning Rust that work in a browser, are moderately
            condensed, and have a public Git repo and issue tracker.
            Also, this section should be very short <=3 entries, so it should only list
            "the best of their kind".
             -->

**Modular Beginner Resources**
- [**Tour of Rust**](https://tourofrust.com/TOC_en.html) - Live code and explanations, side by side.
- [**Rust in Easy English**](https://dhghomon.github.io/easy_rust/Chapter_3.html) - 60+ concepts, simple English, example-driven.
- [**Rust for the Polyglot Programmer**](https://www.chiark.greenend.org.uk/~ianmdlvl/rust-polyglot/index.html) - A guide for the experienced programmer.

In addition consider **The Book**,{{ book(page="") }} **Rust by Example**,{{ ex(page="") }} the **Standard Library**,{{ std(page="std") }} and **Learn Rust**.{{ link(url="https://github.com/ImplFerris/LearnRust") }}



> **Opinion** {{ opinionated() }} &mdash; If you have never seen or used any Rust it might be good to visit one of the links above before continuing; the next chapter might feel a bit terse otherwise.

</div></panel></tab>

</tabs>
