+++
title = "Dicas de desempenho"
description = "Orientações práticas de desempenho em Rust para compilação, uso de CPU, alocações, coleções e entrada e saída."
weight = 38
template = "topic.html"

[extra]
seo_title = "Dicas de desempenho"
anchor = "performance-tips"
print = true
translation_of = "coding-guides/performance-tips.md"
source_hash = "6407b331684e1e094438b2fdc219541cc2d0ed1c666506422e89a2bcd3c80625"
+++
“Meu código está lento” é uma queixa que pode surgir ao portar microbenchmarks para Rust ou após medir o desempenho.

<div class="color-header blue">

| Avaliação | Nome | Descrição |
| --- | --- |--- |
| {{ tbl_boost() }}{{ tbl_simple() }} | **Modo release** {{ book(page="ch01-03-hello-cargo.html") }} {{ hot() }} | Sempre use `cargo build --release` para obter um grande ganho de velocidade. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ noemoji1() }}{{ tbl_risk() }} | **CPU nativa como alvo** {{ link(url="https://doc.rust-lang.org/rustc/codegen-options/index.html#target-cpu") }} | Adicione `rustflags = ["-Ctarget-cpu=native"]` a `config.toml`. {{ above(target = "/tooling/project-anatomy/#project-anatomy") }} |
| {{ noemoji1() }}{{ tbl_simple() }}{{ tbl_tradeoff() }} | **Unidades de geração de código** {{ link(url="https://doc.rust-lang.org/rustc/codegen-options/index.html#codegen-units") }} | Usar `1` unidades pode gerar código mais rápido, com compilação mais lenta. |
| {{ noemoji1() }}{{ tbl_simple() }} | **Reserve capacidade** {{ std(page="std/?search=with_capacity") }} | Pré-alocar coleções reduz a pressão sobre o alocador. |
| {{ noemoji1() }}{{ tbl_simple() }} | **Reutilize coleções** {{ std(page="std/index.html?search=clear") }} | Chamar `x.clear()` e reutilizar `x` evita novas alocações. |
| {{ noemoji1() }}{{ tbl_simple() }} | **Acrescente às strings** {{ std(page="std/macro.write.html") }} | Usar `write!(&mut s, "{}")` pode evitar uma alocação adicional. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ tbl_tradeoff() }} | **Alocador global** {{ std(page="std/alloc/index.html#the-global_allocator-attribute") }} | Em algumas plataformas, um alocador externo, como **mimalloc** {{ link(url="https://crates.io/crates/mimalloc") }}, é mais rápido. |
| | **Alocação por avanço** {{ link(url="https://docs.rs/bumpalo/latest/bumpalo/") }} | Obtém memória dinâmica _temporária_ a baixo custo, especialmente em laços críticos. |
| | **APIs em lote** | Projete APIs que processem vários elementos semelhantes de uma vez, como slices. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **SoA / AoSoA** {{ link(url="https://web.archive.org/web/20240815193855/https://www.rustsim.org/blog/2020/03/23/simd-aosoa-in-nalgebra/") }} | Considere também estruturas de arrays (SoA) e organizações semelhantes. |
| {{ tbl_boost() }}{{ noemoji1() }}{{ tbl_tradeoff() }} | **SIMD** {{ std(page="std/simd/index.html") }} {{ experimental() }} | Em APIs em lote com muitos cálculos, SIMD pode oferecer ganhos de 2 a 8 vezes. |
| | **Reduza os dados** | Tipos e dados menores, como `u8` em vez de `u32` e nichos{{ todo() }}, aproveitam melhor o cache. |
| | **Mantenha dados próximos** {{ link(url="https://en.wikipedia.org/wiki/Data-oriented_design" ) }} | Armazenar dados usados com frequência _próximos uns dos outros_ pode reduzir o tempo de acesso à memória. |
| | **Passe conforme o tamanho** {{ link(url="https://github.com/isocpp/CppCoreGuidelines/blob/master/CppCoreGuidelines.md#reason-45" ) }} | Structs pequenas, de duas ou três palavras, costumam ser melhor passadas por valor; as maiores, por referência. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Async/await** {{ link( url = "https://rust-lang.github.io/async-book/01_getting_started/01_chapter.html") }} | Se houver muita _espera paralela_, como E/S em servidores, `async` pode ser uma boa escolha. |
| | **Threads** {{ std(page="std/thread/index.html") }} | Threads permitem executar _trabalho paralelo_ sobre vários itens ao mesmo tempo. |
| {{ tbl_boost() }} | …**na aplicação** | Geralmente é útil: menos espera melhora a experiência de uso. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | …**dentro de bibliotecas** | Usar threads de forma opaca dentro de uma biblioteca costuma impor decisões demais a quem a usa. |
| {{ tbl_boost() }}{{ noemoji1() }} | …**para quem usa a biblioteca** | Por outro lado, permitir que seu usuário processe seus dados em paralelo é uma excelente ideia. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Evite locks** | Locks em código com várias threads prejudicam o paralelismo. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Evite operações atômicas** | Operações atômicas desnecessárias, como `Arc` em vez de `Rc`, afetam outros acessos à memória. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Evite falso compartilhamento** {{ link(url="https://en.wikipedia.org/wiki/False_sharing") }} | Mantenha pelo menos 64 bytes entre dados lidos ou escritos por CPUs diferentes. {{ link(url="https://igoro.com/archive/gallery-of-processor-cache-effects/")}} |
| {{ tbl_boost() }}{{ tbl_simple() }} | **E/S com buffer** {{ std(page="std/io/index.html#bufreader-and-bufwriter") }} {{ hot() }} | E/S direta com `File` é muito ineficiente sem buffer. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ noemoji1() }}{{ tbl_risk() }} | **Hasher mais rápido** {{ link(url="https://lib.rs/crates/seahash") }} | O hasher padrão de `HashMap` {{ std(page="std/collections/struct.HashMap.html") }} resiste a ataques de negação de serviço, mas é lento. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ noemoji1() }}{{ tbl_risk() }} | **Gerador aleatório mais rápido** | Se usar um gerador criptográfico, avalie se um não criptográfico atende aos requisitos. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Evite objetos de trait** {{ link(url="https://stackoverflow.com/questions/28621980/what-are-the-actual-runtime-performance-costs-of-dynamic-dispatch") }} | Eles reduzem o tamanho do código, mas aumentam a indireção de memória. |
| {{ noemoji2() }}{{ tbl_tradeoff() }} | **Adie o descarte** {{ link(url="https://abrams.cc/rust-dropping-things-in-another-thread") }} | Descartar objetos pesados em uma thread dedicada pode liberar a thread atual. |
| {{ noemoji1() }}{{ tbl_simple() }}{{ noemoji1() }}{{ tbl_risk() }} | **APIs sem verificação** {{ std(page="std/?search=unchecked") }} | Se tiver certeza absoluta de que os requisitos são atendidos, `unsafe { unchecked_ }` elimina verificações. |

</div>


<footnotes>

Itens marcados com {{ tbl_boost() }} costumam trazer um ganho superior a 2×; {{ tbl_simple() }} são fáceis de implementar posteriormente; {{ tbl_tradeoff() }} podem ter efeitos colaterais custosos, como consumo de memória ou complexidade; {{ tbl_risk() }} têm riscos específicos, como segurança ou correção.

</footnotes>

{{ tablesep() }}

> **Dicas de medição de desempenho** {{ opinionated() }}
>
> Profilers são indispensáveis para identificar gargalos. Para facilitar a análise, acrescente isto ao seu <code class="ignore-auto language-bash">Cargo.toml</code>:
> ```cargo
> [profile.release]
> debug = true
> ```
> Depois, execute `cargo build --release` e analise o resultado com [**Superluminal**](https://superluminal.eu/rust/) no Windows ou [**Instruments**](https://en.wikipedia.org/wiki/Instruments_%28software%29) no macOS.
> Ainda assim, muitas oportunidades de desempenho não aparecem em profilers e precisam ser consideradas _no projeto_.

{{ tablesep() }}
