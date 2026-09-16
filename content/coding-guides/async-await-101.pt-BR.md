+++
title = "Introdução a async e await"
description = "Um guia compacto de funções async, futures, ambientes de execução, pinning e concorrência em Rust."
weight = 39
template = "topic.html"

[extra]
seo_title = "Introdução a async e await"
anchor = "async-await-101"
print = true
translation_of = "coding-guides/async-await-101.md"
source_hash = "18e8988389a2b1c3850cb0807c47d6907168a15d14ff7d9af837b33b3bc9b9c9"
+++
Se você conhece async/await de C# ou TypeScript, tenha em mente os pontos a seguir.


<tabs class="color-header orange">

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-async-1" name="tab-async" checked>
<label for="tab-async-1"><b>Conceitos básicos</b></label>
<panel><div>



| Construção | Explicação |
|---------|-------------|
| `async` | Tudo que é declarado `async` sempre retorna um `impl Future<Output=_>`. {{ std(page="std/future/trait.Future.html") }} |
| {{ tab() }} `async fn f() {}` | A função `f` retorna um `impl Future<Output=()>`. |
| {{ tab() }} `async fn f() -> S {}` | A função `f` retorna um `impl Future<Output=S>`. |
| {{ tab() }} `async { x }` | Transforma `{ x }` em um `impl Future<Output=X>`. |
| `let sm = f();   ` | Chamar `f()`, que é `async`, **não executa** `f`: produz a máquina de estados `sm`. {{ note(note="1") }} {{ note(note="2") }} |
| {{ tab() }} `sm = async { g() };` | Da mesma forma, **não executa** o bloco `{ g() }`; produz uma máquina de estados. |
| `runtime.block_on(sm);` | Fora de um `async {}`, agenda `sm` para execução efetiva. Isso executaria `g()`. {{ note(note="3") }} {{ note(note="4") }} |
| `sm.await` | Dentro de um `async {}`, executa `sm` até concluir. Cede ao ambiente de execução se `sm` não estiver pronto. |



<footnotes>

<sup>1</sup> Tecnicamente, `async` transforma o código seguinte em um tipo anônimo de máquina de estados gerado pelo compilador; `f()` instancia essa máquina. <br>
<sup>2</sup> A máquina de estados sempre `impl Future` e pode também `Send` e implementar outras traits, dependendo dos tipos usados dentro de `async`. <br>
<sup>3</sup> A máquina de estados é conduzida por uma thread de trabalho que invoca `Future::poll()` diretamente pelo ambiente de execução ou, indiretamente, por um `.await` pai. <br>
<sup>4</sup> Rust não inclui um ambiente de execução assíncrono; use uma crate externa, como [tokio](https://crates.io/crates/tokio). Há outros utilitários na crate [futures](https://github.com/rust-lang-nursery/futures-rs).

</footnotes>



</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-async-2" name="tab-async">
<label for="tab-async-2"><b>Fluxo de execução</b></label>
<panel><div>


Em cada `x.await`, a máquina de estados passa o controle à máquina subordinada `x`. Em algum ponto, uma máquina de baixo nível invocada por `.await` pode não estar pronta. Nesse caso, a thread
retorna até o ambiente de execução, que pode conduzir outro Future. Mais tarde, o ambiente de execução:
- **Pode** retomar a execução. Geralmente faz isso, a menos que `sm` ou `Future` tenha sido descartado.
- **Pode** retomar na mesma thread de trabalho **ou em outra**, dependendo do ambiente de execução.

Diagrama simplificado de código escrito dentro de um bloco `async`:


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
       consecutive_code();           consecutive_code();           consecutive_code();
START --------------------> x.await --------------------> y.await --------------------> READY
// ^                          ^     ^                               Future<Output=X> ready -^
// Invoked via runtime        |     |
// or an external .await      |     This might resume on another thread (next best available),
//                            |     or NOT AT ALL if Future was dropped.
//                            |
//                            Execute `x`. If ready: just continue execution; if not, return
//                            this thread to runtime.
```

</div>
</div>

</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-async-3" name="tab-async">
<label for="tab-async-3"><b>Cuidados</b> {{ bad() }} </label>
<panel><div>


Considerando esse fluxo, observe os seguintes pontos ao escrever código dentro de uma construção `async`.

<div class="color-header orange">


| Construções {{ note(note="1") }} | Explicação |
|---------|-------------|
| `sleep_or_block();` | Definitivamente inadequado {{ bad() }}: nunca bloqueie a thread atual, pois isso bloqueia o executor. |
| `set_TL(a); x.await; TL();` | Definitivamente inadequado {{ bad() }}: `await` pode retomar em outra thread; o [armazenamento local de thread](https://doc.rust-lang.org/std/macro.thread_local.html) deixa de ser válido. |
| `s.no(); x.await; s.go();` | Pode ser inadequado {{ bad() }}: `await` [não retorna](http://www.randomhacks.net/2019/03/09/in-nightly-rust-await-may-never-return/) se `Future` for descartado durante a espera. {{ note(note="2") }} |
| `Rc::new(); x.await; rc();` | Tipos que não implementam `Send` impedem que `impl Future` implemente `Send`, reduzindo a compatibilidade. |

</div>

<footnotes>

<sup>1</sup> Aqui, `s` representa qualquer estado não local que possa ser temporariamente invalidado;
`TL` representa armazenamento local de thread; e o `async {}` que contém o código foi escrito
sem pressupor detalhes específicos do executor. <br/>
<sup>2</sup> Como [Drop](https://doc.rust-lang.org/std/ops/trait.Drop.html) sempre é executado quando `Future` é descartado, considere uma guarda de descarte que limpe ou repare o estado da aplicação caso ele precise permanecer inválido entre pontos `.await`.

</footnotes>

</div></panel></tab>

<!-- end tabs -->
</tabs>


{{ tablesep() }}
