+++
title = "Rust idiomático"
description = "Uma lista concisa de padrões idiomáticos de Rust para quem vem de outras linguagens."
weight = 37
template = "topic.html"

[extra]
seo_title = "Rust idiomático"
anchor = "idiomatic-rust"
print = true
translation_of = "coding-guides/idiomatic-rust.md"
source_hash = "39acd076b14151a5705f8122146fcd2633b2f7206974760634db312511529368"
+++
Se você está acostumado com Java ou C, considere estas práticas.

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px; ">
<div class="color-header number">


| Prática | Código |
|--------| ---- |
| **Pense em expressões** | `y = if x { a } else { b };` |
|  | `y = loop { break 5 };`  |
|  | `fn f() -> u32 { 0 }`  |
| **Pense em iteradores** | `(1..10).map(f).collect()` |
|  | <code>names.iter().filter(&vert;x&vert; x.starts_with("A"))</code> |
| **Teste ausência com `?`** | `y = try_something()?;` |
|  | `get_option()?.run()?` |
| **Use tipos fortes** | `enum E { Invalid, Valid { … } }` em vez de `ERROR_INVALID = -1` |
| | `enum E { Visible, Hidden }` em vez de `visible: bool` |
| | `struct Charge(f32)` em vez de `f32` |
| **Torne estados inválidos impossíveis** | `my_lock.write().unwrap().guaranteed_at_compile_time_to_be_locked = 10;` <sup>1</sup> |
|  | <code>thread::scope(&vert;s&vert; { /* Threads can't exist longer than scope() */ });</code> |
| **Evite estado global** | Um projeto pode depender de várias versões da sua crate e duplicar variáveis estáticas sem que isso seja óbvio. {{ bad() }} {{ link(url="https://doc.rust-lang.org/cargo/reference/resolver.html#version-incompatibility-hazards") }} |
| **Ofereça builders** | `Car::builder().name("Model T").hp(20).build();` |
| **Torne constante** | Sempre que possível, marque funções como `const`; quando viável, execute código dentro de `const {}`. |
| **Evite pânico** | Pânicos _não_ são exceções: sugerem o encerramento imediato do processo! |
| | Use pânico apenas para erros de programação; nos demais casos, use `Option<T>`{{ std(page="std/option/enum.Option.html") }} ou `Result<T,E>`{{ std(page="std/result/enum.Result.html") }}. |
| | Se o usuário o solicitar explicitamente, como ao chamar `obtain()` em vez de `try_obtain()`, o pânico também é aceitável. |
| | Dentro de `const { NonZero::new(1).unwrap() }`, o pânico se torna um erro de compilação, o que também é aceitável. |
| **Use genéricos com moderação** | Um `<T: Bound>` simples, como `AsRef<Path>`, pode facilitar o uso da API. |
| | Limites complexos tornam o código difícil de acompanhar. Na dúvida, evite criatividade excessiva com genéricos. |
| **Separe implementações** | Tipos genéricos como `Point<T>` podem ter um `impl` separado para cada `T`, permitindo alguma especialização. |
|   | `impl<T> Point<T> { /* Add common methods here */ }` |
|   | `impl Point<f32> { /* Add methods only relevant for Point<f32> */ }` |
| **Unsafe** | Evite `unsafe {}`;{{ below(target="/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined") }} muitas vezes existe uma solução mais segura e mais rápida sem ele. |
| **Implemente traits** | Use `#[derive(Debug, Copy, …)]` e implemente `impl` personalizada quando necessário. |
| **Ferramentas** | Execute [**clippy**](https://github.com/rust-lang/rust-clippy) regularmente para melhorar a qualidade do código. {{ hot() }} |
| | Formate o código com [**rustfmt**](https://github.com/rust-lang/rustfmt) para manter a consistência. {{ hot() }} |
| | Adicione **testes unitários** {{ book(page="ch11-01-writing-tests.html") }} (`#[test]`) para verificar o funcionamento do código. |
| | Adicione **testes de documentação** {{ book(page="ch14-02-publishing-to-crates-io.html") }} (` ``` my_api::f() ``` `) para verificar que os exemplos correspondem ao código. |
| **Documentação** | Documente as APIs com comentários que possam aparecer em [**docs.rs**](https://docs.rs). |
| | Inclua uma **frase de resumo** e a seção **Examples**. |
| | Quando aplicável, inclua **Panics**, **Errors**, **Safety**, **Abort** e **Undefined Behavior**. |


</div>
</div>
</div>

<footnotes>

<sup>1</sup> Na maioria dos casos, prefira `?` a `.unwrap()`. Para locks, porém, o [**`PoisonError`**](https://doc.rust-lang.org/stable/std/sync/struct.PoisonError.html) retornado indica um pânico em outra thread; desembrulhá-lo e propagar o pânico costuma ser a melhor opção.


</footnotes>

{{ tablesep() }}

> 🔥 Recomendamos **fortemente** seguir também as
> [**diretrizes de APIs**](https://rust-lang.github.io/api-guidelines/) e as
> [**diretrizes práticas de Rust**](https://microsoft.github.io/rust-guidelines/). 🔥


{{ tablesep() }}
