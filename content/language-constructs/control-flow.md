+++
title = "Control Flow"
description = "Rust control flow syntax for loops, conditions, matching, branching, and early returns."
weight = 5
template = "topic.html"

[extra]
seo_title = "Control Flow"
anchor = "control-flow"
previous = "/language-constructs/functions-behavior/"
previous_title = "Functions & Behavior"
next = "/language-constructs/organizing-code/"
next_title = "Organizing Code"
print = true
+++
Control execution within a function.

<fixed-2-column>

| Example | Explanation |
|---------|-------------|
| `while x {}`  | **Loop**, {{ ref(page="expressions/loop-expr.html#predicate-loops") }} run while expression `x` is true. |
| `loop {}`  | **Loop indefinitely** {{ ref(page="expressions/loop-expr.html#infinite-loops") }} until `break`. Can yield value with `break x`. |
| `for x in collection {}` | Syntactic sugar to loop over **iterators**. {{ book(page="ch13-02-iterators.html") }} {{ std(page="std/iter/index.html") }} {{ ref(page="expressions/loop-expr.html#iterator-loops") }} |
| <less-important> {{ tab() }} {{ expands_to()}}  `collection.into_iter()` </less-important> | <less-important>Effectively converts any  **`IntoIterator`** {{ std(page="std/iter/trait.IntoIterator.html") }} type into proper iterator first. </less-important> |
| <less-important> {{ tab() }} {{ expands_to()}}  `iterator.next()` </less-important> | <less-important>On proper **`Iterator`** {{ std(page="std/iter/trait.Iterator.html") }} then `x = next()` until exhausted (first `None`). </less-important>  |
| `if x {} else {}`  | **Conditional branch** {{ ref(page="expressions/if-expr.html") }} if expression is true. |
| `'label: {}` | **Block label**, {{ rfc(page="2046-label-break-value.html" )}}  can be used with `break` to exit out of this block. {{ edition(ed="1.65+")}} |
| `'label: loop {}` | Similar **loop label**, {{ ex(page="flow_control/loop/nested.html") }} {{ ref(page="expressions/loop-expr.html#loop-labels")}} useful for flow control in nested loops. |
| `break`  | **Break expression** {{ ref(page="expressions/loop-expr.html#break-expressions") }} to exit a labelled block or loop. |
| {{ tab() }} `break 'label x`  |  Break out of block or loop named `'label` and make `x` its value.  |
| {{ tab() }} `break 'label`  | Same, but don't produce any value. |
| {{ tab() }} `break x`  | Make `x` value of the innermost loop (only in actual `loop`). |
| `continue `  | **Continue expression** {{ ref(page="expressions/loop-expr.html#continue-expressions") }} to the next loop iteration of this loop. |
| `continue 'label`  | Same but instead of this loop, enclosing loop marked with 'label. |
| `x?` | If `x` is [Err](https://doc.rust-lang.org/std/result/enum.Result.html#variant.Err) or [None](https://doc.rust-lang.org/std/option/enum.Option.html#variant.None), **return and propagate**. {{ book(page="ch09-02-recoverable-errors-with-result.html#propagating-errors") }} {{ ex(page="error/result/enter_question_mark.html") }} {{ std(page="std/result/index.html#the-question-mark-operator-") }} {{ ref(page="expressions/operator-expr.html#the-question-mark-operator")}} |
| `x.await` | Syntactic sugar to **get future, poll, yield**.  {{ ref(page="expressions/await-expr.html#await-expressions") }}  {{ edition(ed="'18") }} Only inside `async`.  |
| <less-important> {{ tab() }} {{ expands_to()}} `x.into_future()` </less-important>  | <less-important> Effectively converts any  **`IntoFuture`** {{ std(page="std/future/trait.IntoFuture.html") }} type into proper future first. </less-important> |
| <less-important> {{ tab() }} {{ expands_to()}} `future.poll()` </less-important> | <less-important> On proper **`Future`** {{ std(page="std/future/trait.Future.html") }} then `poll()` and yield flow if **`Poll::Pending`**. {{ std(page="std/task/enum.Poll.html") }} </less-important> |
| `return x`  | **Early return** {{ ref(page="expressions/return-expr.html" ) }} from fn. More idiomatic is to end with expression. |
| {{ tab() }} `{ return }`  | Inside normal `{}`-blocks `return` exits surrounding function. |
| {{ tab() }} <code>&vert;&vert; { return }</code>  | Within closures `return` exits that _c._ only, i.e., closure is _s. fn._ |
| {{ tab() }} `async { return }`  | Inside `async` a `return` **only** {{ ref(page="expressions/block-expr.html#control-flow-operators") }} {{ bad() }} exits that `{}`, i.e., `async {}` is _s. fn._ |
| `f()` | Invoke callable `f` (e.g., a function, closure, function pointer, `Fn`, &hellip;). |
| `x.f()` | Call member fn, requires `f` takes `self`, `&self`, &hellip; as first argument. |
| {{ tab() }} `X::f(x)` | Same as `x.f()`. Unless `impl Copy for X {}`, `f` can only be called once. |
| {{ tab() }} `X::f(&x)` | Same as `x.f()`. |
| {{ tab() }} `X::f(&mut x)` | Same as `x.f()`. |
| {{ tab() }} `S::f(&x)` | Same as `x.f()` if `X` [derefs](https://doc.rust-lang.org/std/ops/trait.Deref.html) to `S`, i.e., `x.f()` finds methods of `S`. |
| {{ tab() }} `T::f(&x)` | Same as `x.f()` if `X impl T`, i.e., `x.f()` finds methods of `T` if in scope. |
| `X::f()` | Call associated function, e.g., `X::new()`. |
| {{ tab() }} `<X as T>::f()` | Call trait method `T::f()` implemented for `X`. |

</fixed-2-column>
