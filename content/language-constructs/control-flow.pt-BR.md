+++
title = "Fluxo de controle"
description = "Sintaxe de fluxo de controle de Rust para laços, condições, correspondência de padrões, ramificações e retornos antecipados."
weight = 5
template = "topic.html"

[extra]
seo_title = "Fluxo de controle"
anchor = "control-flow"
print = true
translation_of = "language-constructs/control-flow.md"
source_hash = "df747bd3f88f3483ce3cec5589e0f342d645faa821fa6108896b1a9a08b3541a"
+++
Controle da execução dentro de uma função.

<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `while x {}` | **Laço**: {{ ref(page="expressions/loop-expr.html#predicate-loops") }} executa enquanto a expressão `x` for verdadeira. |
| `loop {}` | **Repete indefinidamente** {{ ref(page="expressions/loop-expr.html#infinite-loops") }} até `break`. Pode produzir um valor com `break x`. |
| `for x in collection {}` | Açúcar sintático para percorrer **iteradores**. {{ book(page="ch13-02-iterators.html") }} {{ std(page="std/iter/index.html") }} {{ ref(page="expressions/loop-expr.html#iterator-loops") }} |
| <less-important> {{ tab() }} {{ expands_to()}} `collection.into_iter()` </less-important> | <less-important>Primeiro converte um tipo que implementa **`IntoIterator`** {{ std(page="std/iter/trait.IntoIterator.html") }} em um iterador propriamente dito. </less-important> |
| <less-important> {{ tab() }} {{ expands_to()}} `iterator.next()` </less-important> | <less-important>No **`Iterator`** {{ std(page="std/iter/trait.Iterator.html") }} resultante, executa `x = next()` até esgotá-lo, no primeiro `None`. </less-important> |
| `if x {} else {}` | **Ramificação condicional** {{ ref(page="expressions/if-expr.html") }} quando a expressão é verdadeira. |
| `'label: {}` | **Rótulo de bloco**: {{ rfc(page="2046-label-break-value.html" )}} permite usar `break` para sair deste bloco. {{ edition(ed="1.65+")}} |
| `'label: loop {}` | **Rótulo de laço** semelhante, {{ ex(page="flow_control/loop/nested.html") }} {{ ref(page="expressions/loop-expr.html#loop-labels")}} útil para controlar o fluxo em laços aninhados. |
| `break` | **Expressão de saída** {{ ref(page="expressions/loop-expr.html#break-expressions") }} de um bloco rotulado ou de um laço. |
| {{ tab() }} `break 'label x` | Sai do bloco ou laço chamado `'label` e faz de `x` o valor resultante. |
| {{ tab() }} `break 'label` | O mesmo, mas sem produzir um valor. |
| {{ tab() }} `break x` | Faz de `x` o valor do laço mais interno; funciona apenas em um `loop` propriamente dito. |
| `continue ` | **Expressão de continuação** {{ ref(page="expressions/loop-expr.html#continue-expressions") }} para a próxima iteração deste laço. |
| `continue 'label` | O mesmo, mas para o laço externo identificado por 'label. |
| `x?` | Se `x` for [Err](https://doc.rust-lang.org/std/result/enum.Result.html#variant.Err) ou [None](https://doc.rust-lang.org/std/option/enum.Option.html#variant.None), **retorna e propaga**. {{ book(page="ch09-02-recoverable-errors-with-result.html#propagating-errors") }} {{ ex(page="error/result/enter_question_mark.html") }} {{ std(page="std/result/index.html#the-question-mark-operator-") }} {{ ref(page="expressions/operator-expr.html#the-question-mark-operator")}} |
| `x.await` | Açúcar sintático para **obter um future, consultar seu progresso e ceder a execução**. {{ ref(page="expressions/await-expr.html#await-expressions") }} {{ edition(ed="'18") }} Apenas dentro de `async`. |
| <less-important> {{ tab() }} {{ expands_to()}} `x.into_future()` </less-important> | <less-important>Primeiro converte um tipo que implementa **`IntoFuture`** {{ std(page="std/future/trait.IntoFuture.html") }} em um future propriamente dito. </less-important> |
| <less-important> {{ tab() }} {{ expands_to()}} `future.poll()` </less-important> | <less-important>No **`Future`** {{ std(page="std/future/trait.Future.html") }} resultante, chama `poll()` e cede a execução se o resultado for **`Poll::Pending`**. {{ std(page="std/task/enum.Poll.html") }} </less-important> |
| `return x` | **Retorno antecipado** {{ ref(page="expressions/return-expr.html" ) }} da função. É mais idiomático terminar com uma expressão. |
| {{ tab() }} `{ return }` | Em blocos `{}` comuns, `return` sai da função que os contém. |
| {{ tab() }} <code>&vert;&vert; { return }</code> | Em closures, `return` sai apenas daquela closure, que é uma função separada. |
| {{ tab() }} `async { return }` | Dentro de `async`, um `return` **sai apenas** {{ ref(page="expressions/block-expr.html#control-flow-operators") }} {{ bad() }} daquele `{}`: `async {}` é uma função separada. |
| `f()` | Invoca `f`, que pode ser uma função, closure, ponteiro de função, `Fn` etc. |
| `x.f()` | Chama um método; exige que `f` receba `self`, `&self` etc. como primeiro argumento. |
| {{ tab() }} `X::f(x)` | Equivale a `x.f()`. A menos que `impl Copy for X {}`, `f` só pode ser chamada uma vez. |
| {{ tab() }} `X::f(&x)` | Equivale a `x.f()`. |
| {{ tab() }} `X::f(&mut x)` | Equivale a `x.f()`. |
| {{ tab() }} `S::f(&x)` | Equivale a `x.f()` se `X` [desreferenciar](https://doc.rust-lang.org/std/ops/trait.Deref.html) para `S`; assim, `x.f()` encontra métodos de `S`. |
| {{ tab() }} `T::f(&x)` | Equivale a `x.f()` se `X impl T`; assim, `x.f()` encontra métodos de `T` que estejam no escopo. |
| `X::f()` | Chama uma função associada, como `X::new()`. |
| {{ tab() }} `<X as T>::f()` | Chama o método de trait `T::f()` implementado para `X`. |

</fixed-2-column>
