+++
title = "Pattern Matching"
description = "Rust pattern matching syntax for destructuring, bindings, guards, ranges, and or-patterns."
weight = 9
template = "topic.html"

[extra]
seo_title = "Pattern Matching"
anchor = "pattern-matching"
previous = "/language-constructs/macros-attributes/"
previous_title = "Macros & Attributes"
next = "/language-constructs/generics-constraints/"
next_title = "Generics & Constraints"
print = true
+++
Constructs found in `match` or `let` expressions, or function parameters.


<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `match m {}` | Initiate **pattern matching**, {{ book(page="ch06-02-match.html") }} {{ ex(page="flow_control/match.html") }} {{ ref(page="expressions/match-expr.html") }} then use match arms, _c_. next table. |
| `let S(x) = get();`  | Notably, `let` also **destructures** {{ ex(page="flow_control/match/destructuring.html") }} similar to the table below. |
|  {{ tab() }} `let S { x } = s;` | Only `x` will be bound to value `s.x`. |
|  {{ tab() }} `let (_, b, _) = abc;` | Only `b` will be bound to value `abc.1`. |
|  {{ tab() }} `let (a, ..) = abc;` | Ignoring 'the rest' also works. |
|  {{ tab() }} `let (.., a, b) = (1, 2);` | Specific bindings take precedence over 'the rest', here `a` is `1`, `b` is `2`. |
|  {{ tab() }} `let s @ S { x } = get();`  | Bind `s` to `S` while `x` is bnd. to `s.x`, **pattern binding**, {{ book(page="ch18-03-pattern-syntax.html#-bindings") }} {{ ex(page="flow_control/match/binding.html#binding") }} {{ ref(page="patterns.html#identifier-patterns") }} _c_. below {{ esoteric() }} |
|  {{ tab() }} `let w @ t @ f = get();`  | Stores 3 copies of `get()` result in each `w`, `t`, `f`. {{ esoteric() }} |
|  {{ tab() }} <code>let (&vert;x&vert; x) = get();</code> | Pathological or-pattern,{{ below(target="/language-constructs/pattern-matching/#pattern-matching")}} **not** closure.{{ bad() }} Same as `let x = get();` {{ esoteric() }}  |
| `let Ok(x) = f();` | **Won't** work {{ bad() }} if p. can be **refuted**, {{ ref(page="expressions/if-expr.html#if-let-expressions") }} use `let else` or `if let` instead. |
| `let Ok(x) = f();` | But can work if alternatives uninhabited, e.g., `f` returns `Result<T, !>` {{ edition(ed="1.82+") }} |
| `let Ok(x) = f() else {};`  | Try to assign {{ rfc(page="3137-let-else.html") }} if not `else {}` w. must `break`, `return`, `panic!`, … {{ edition(ed="1.65+")}} {{ hot() }} |
| `if let Ok(x) = f() {}`  | Branch if pattern can be assigned (e.g., `enum` variant), syntactic sugar. <sup>*</sup>|
| <code>if let &hellip; && let &hellip; { }</code>  | **Let chains**, {{ ref(page="expressions/if-expr.html#r-expr.if.chains.bindings")}} use more than binding w.o. nesting. {{ edition(ed="'24") }}|
| `while let Ok(x) = f() {}`  | Equiv.; here keep calling `f()`, run `{}` as long as _p._ can be assigned. |
| `fn f(S { x }: S)`  | Function param. also work like `let`, here `x` bound to `s.x` of `f(s)`. {{ esoteric() }} |

</fixed-2-column>


<footnotes>

<sup>*</sup> Desugars to `match get() { Some(x) => {}, _ => () }`.

</footnotes>



{{ tablesep() }}

Pattern matching arms in `match` expressions. Left side of these arms can also be found in `let` expressions.

<fixed-2-column class="color-header special_example">

| Within Match Arm | Explanation |
|---------|-------------|
|  `E::A => {}` | Match enum variant `A`, _c_. **pattern matching**. {{ book(page="ch06-02-match.html") }} {{ ex(page="flow_control/match.html") }} {{ ref(page="expressions/match-expr.html") }} |
|  `E::B ( .. ) => {}` | Match enum tuple variant `B`, ignoring any index. |
|  `E::C { .. } => {}` | Match enum struct variant `C`, ignoring any field. |
|  `S { x: 0, y: 1 } => {}` | Match _s._ with specific values (only `s` with `s.x` of `0` and `s.y` of `1`). |
|  `S { x: a, y: b } => {}` | Match _s._ with _any_ {{ bad() }} values and bind `s.x` to `a` and `s.y` to `b`. |
|  {{ tab() }} `S { x, y } => {}` | Same, but shorthand with `s.x` and `s.y` bound as `x` and `y` respectively. |
|  `S { .. } => {}` | Match struct with any values. |
|  `D => {}` | Match enum variant `E::D` if `D` in `use`. |
|  `D => {}` | Match anything, bind `D`; possibly false friend {{ bad() }} of `E::D` if `D` not in `use`. |
|  `_ => {}` | Proper wildcard that matches anything / "all the rest". |
| <code>0 &vert; 1 => {}</code> | Pattern alternatives, **or-patterns**. {{ rfc( page ="2535-or-patterns.html") }}|
| {{ tab() }}  <code>E::A &vert; E::Z => {}</code> | Same, but on enum variants. |
| {{ tab() }}  <code>E::C {x} &vert; E::D {x} => {}</code> | Same, but bind `x` if all variants have it. |
| {{ tab() }}  <code>Some(A &vert; B) => {}</code> | Same, can also match alternatives deeply nested. |
| {{ tab() }}  <code>&vert;x&vert; x => {}</code> | **Pathological or-pattern**,{{ above(target="/language-constructs/pattern-matching/#pattern-matching")}}{{bad()}} leading <code>&vert;</code> ignored, is just <code>x &vert; x</code>, thus <code>x</code>. {{esoteric()}} |
| {{ tab() }}  <code>&vert;x => {}</code> | Similar, leading <code>&vert;</code> ignored. {{esoteric() }} |
|  `(a, 0) => {}` | Match tuple with any value for `a` and `0` for second. |
|  `[a, 0] => {}` | **Slice pattern**, {{ ref(page="patterns.html#slice-patterns") }} {{ link(url="https://doc.rust-lang.org/edition-guide/rust-2018/slice-patterns.html") }} match array with any value for `a` and `0` for second. |
|  {{ tab() }} `[1, ..] => {}` | Match array starting with `1`, any value for rest; **subslice pattern**.  {{ ref(page="patterns.html#rest-patterns") }} {{ rfc(page="2359-subslice-pattern-syntax.html") }} |
|  {{ tab() }} `[1, .., 5] => {}` | Match array starting with `1`, ending with `5`. |
|  {{ tab() }} `[1, x @ .., 5] => {}` | Same, but also bind `x` to slice representing middle (_c._ pattern binding).  |
|  {{ tab() }} `[a, x @ .., b] => {}` | Same, but match any first, last, bound as `a`, `b` respectively.  |
|  `1 .. 3 => {}` | **Range pattern**, {{ book(page="ch18-03-pattern-syntax.html#matching-ranges-of-values-with-") }} {{ ref(page="patterns.html#range-patterns") }} here matches `1` and `2`; partially unstable. {{ experimental() }} |
|  {{ tab() }} `1 ..= 3 => {}` | Inclusive range pattern, matches `1`, `2` and `3`. |
|  {{ tab() }} `1 .. => {}` | Open range pattern, matches `1` and any larger number.  |
| `x @ 1..=5 => {}` | Bind matched to `x`; **pattern binding**, {{ book(page="ch18-03-pattern-syntax.html#-bindings") }} {{ ex(page="flow_control/match/binding.html#binding") }} {{ ref(page="patterns.html#identifier-patterns") }} here `x` would be `1` &hellip; `5`.  |
| {{ tab() }} `Err(x @ Error {..}) => {}` | Also works nested, here `x` binds to `Error`, esp. useful with `if` below. |
| `S { x } if x > 10 => {}`  | Pattern **match guards**, {{ book(page="ch18-03-pattern-syntax.html#extra-conditionals-with-match-guards")}} {{ ex(page="flow_control/match/guard.html#guards")}} {{ ref(page="expressions/match-expr.html#match-guards") }} condition must be true as well to match. |

</fixed-2-column>
