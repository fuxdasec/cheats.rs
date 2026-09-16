+++
title = "Funções e comportamento"
description = "Funções, closures, blocos async, funções const, código unsafe e outras construções relacionadas a comportamento em Rust."
weight = 4
template = "topic.html"

[extra]
seo_title = "Funções e comportamento"
anchor = "functions-behavior"
print = true
translation_of = "language-constructs/functions-behavior.md"
source_hash = "7536e73bd5c2acb497243f1ecdcb55e95a930326a143e5a0ba0b0522fc37bb00"
+++
Definição de unidades de código e suas abstrações.

<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `trait T {}` | Define uma **trait**: {{ book(page="ch10-02-traits.html") }} {{ ex(page="trait.html") }} {{ ref(page="items/traits.html") }} um comportamento comum que tipos podem implementar. |
| `trait T : R {}` | `T` é uma subtrait da **supertrait** {{ book(page="ch19-03-advanced-traits.html#using-supertraits-to-require-one-traits-functionality-within-another-trait") }} {{ ex(page="trait/supertraits.html") }} {{ ref(page="items/traits.html#supertraits") }} `R`. Qualquer `S` deve `impl R` antes de poder `impl T`. |
| `impl S {}` | **Implementação** {{ ref(page="items/implementations.html") }} de funcionalidades para um tipo `S`, como métodos. |
| `impl T for S {}` | Implementa a trait `T` para o tipo `S`; especifica _exatamente como_ `S` se comporta como `T`. |
| `impl !T for S {}` | Desabilita uma **auto trait** derivada automaticamente. {{ nom(page="send-and-sync.html") }} {{ ref(page="special-types-and-traits.html#auto-traits") }} {{ experimental() }} {{ esoteric() }} |
| `fn f() {}` | Define uma **função**; {{ book(page="ch03-03-how-functions-work.html") }} {{ ex(page="fn.html") }} {{ ref(page="items/functions.html") }} ou uma função associada, quando dentro de `impl`. |
| {{ tab() }} `fn f() -> S {}` | O mesmo, retornando um valor do tipo S. |
| {{ tab() }} `fn f(&self) {}` | Define um **método**, {{ book(page="ch05-03-method-syntax.html") }} {{ ex(page="fn/methods.html") }} {{ ref(page="items/associated-items.html#methods") }} por exemplo, dentro de um `impl S {}`. |
| `struct S` &#8203;`(T);` | De forma menos óbvia, _também_{{ above(target="/language-constructs/data-structures/#data-structures") }} define `fn S(x: T) -> S` uma **função construtora**. {{ rfc(page="1506-adt-kinds.html#tuple-structs") }} {{ esoteric() }} |
| `const fn f() {}` | Função `fn` constante, utilizável durante a compilação, como `const X: u32 = f(Y)`. {{ ref(page="const_eval.html#const-functions") }} {{ edition(ed="'18") }} |
| {{ tab() }} `const { x }` | Dentro de uma função, garante que `{ x }` seja avaliado durante a compilação. {{ ref(page="expressions/block-expr.html#const-blocks") }} |
| `async fn f() {}` | Transformação **assíncrona** {{ ref(page="items/functions.html#async-functions") }} {{ edition(ed="'18") }} de uma função: {{ below(target="/coding-guides/async-await-101/#async-await-101") }} faz `f` retornar um `impl` **`Future`**. {{ std(page="std/future/trait.Future.html") }} |
| {{ tab() }} `async fn f() -> S {}` | O mesmo, mas faz `f` retornar um `impl Future<Output=S>`. |
| {{ tab() }} `async { x }` | Dentro de uma função, transforma `{ x }` em um `impl Future<Output=X>`. {{ ref(page="expressions/block-expr.html#async-blocks") }} |
| {{ tab() }} `async move { x }` | Move as variáveis capturadas para o future, como em uma closure move. {{ ref(page="expressions/block-expr.html#capture-modes") }} {{ below(target="/language-constructs/functions-behavior/#functions-behavior") }} |
| `fn() -> S` | **Referências a funções**: <sup>1</sup> {{ book(page="ch19-05-advanced-functions-and-closures.html#function-pointers") }} {{ std(page="std/primitive.fn.html") }} {{ ref(page="types.html#function-pointer-types") }} memória que armazena o endereço de algo invocável. |
| `Fn() -> S` | **Trait de invocação** {{ book(page="ch19-05-advanced-functions-and-closures.html#returning-closures") }} {{ std(page="std/ops/trait.Fn.html") }} (também `FnMut` e `FnOnce`), implementada por closures, funções etc. |
| `AsyncFn() -> S` | **Trait de invocação assíncrona** {{ std(page="std/ops/trait.AsyncFn.html") }} (também `AsyncFnMut` e `AsyncFnOnce`), implementada por closures assíncronas. |
| <code>&vert;&vert; {} </code> | Uma **closure** {{ book(page="ch13-01-closures.html") }} {{ ex(page="fn/closures.html") }} {{ ref(page="expressions/closure-expr.html")}} que toma emprestados os valores **capturados**, {{ below(target="/memory-layout/closures/#closures-data") }} {{ ref(page="types/closure.html#capture-modes") }} como uma variável local. |
| {{ tab() }} <code>&vert;x&vert; {}</code> | Closure que recebe um argumento chamado `x`; seu corpo é uma expressão de bloco. |
| {{ tab() }} <code>&vert;x&vert; x + x</code> | O mesmo, sem bloco: só pode conter uma única expressão. |
| {{ tab() }} <code>move &vert;x&vert; x + y </code> | **Closure move** {{ ref(page="types/closure.html#capture-modes")}} que toma posse dos valores; ou seja, `y` é transferido para a closure. |
| {{ tab() }} <code>async &vert;x&vert; x + x</code> | **Closure assíncrona**. {{ ref(page="expressions/closure-expr.html#async-closures")}} Converte o resultado em um `impl Future<Output=X>`. |
| {{ tab() }} <code>async move &vert;x&vert; x + y</code> | **Closure assíncrona move**. Combina os dois casos anteriores. |
| {{ tab() }} <code>return &vert;&vert; true </code> | Closures às vezes parecem operadores OU lógicos; neste caso, retornam outra closure. |
| `unsafe` | Para quem gosta de depurar falhas de segmentação: **código unsafe**. {{ below(target="/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined") }} {{ book(page="ch19-01-unsafe-rust.html#unsafe-superpowers") }} {{ ex(page="unsafe.html#unsafe-operations") }} {{ nom(page="meet-safe-and-unsafe.html") }} {{ ref(page="unsafe-blocks.html#unsafe-blocks") }} |
| {{ tab() }} `unsafe fn f() {}` | Significa: _a chamada pode causar UB; {{ below(target="/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined") }} **VOCÊ deve verificar** os requisitos_. |
| {{ tab() }} `unsafe trait T {}` | Significa: _uma implementação descuidada de `T` pode causar UB_; **quem implementa deve verificar os requisitos**. |
| {{ tab() }} `unsafe { f(); }` | Garante ao compilador: _**verifiquei os requisitos**, confie em mim_. |
| {{ tab() }} `unsafe impl T for S {}` | Garante que _`S` respeita os requisitos de `T`_; assim, é seguro usar `T` em `S`. |
| {{ tab() }} `unsafe extern "abi" {}` | A partir de Rust 2024, `extern "abi" {}` blocos {{ below(target="/language-constructs/organizing-code/#organizing-code")}} precisam ser `unsafe`. |
| {{ tab() }} {{ tab() }} `pub safe fn f();` | Dentro de um `unsafe extern "abi" {}`, indica que `f` é, de fato, seguro para chamar. {{ rfc(page="3484-unsafe-extern-blocks.html") }} |

</fixed-2-column>

<footnotes>

<sup>1</sup> A documentação geralmente os chama de **ponteiros** de função, mas **referências** de função talvez seja mais apropriado{{ link(url="https://users.rust-lang.org/t/why-are-function-pointers-special-no-null/87990/16") }}: eles não podem ser `null` e devem apontar para um destino válido.

</footnotes>
