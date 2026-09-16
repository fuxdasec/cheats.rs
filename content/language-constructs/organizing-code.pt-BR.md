+++
title = "Organização do código"
description = "Módulos, importações, visibilidade, crates, blocos externos e sintaxe de organização do código em Rust."
weight = 6
template = "topic.html"

[extra]
seo_title = "Organização do código"
anchor = "organizing-code"
print = true
translation_of = "language-constructs/organizing-code.md"
source_hash = "b3501d5811bd5fdd4c6b27f418a4cbdfd3d47ccb4ad368b21552855635f4f8e7"
+++
Divida projetos em unidades menores e minimize as dependências.

<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `mod m {}` | Define um **módulo** {{ book(page="ch07-02-defining-modules-to-control-scope-and-privacy.html") }} {{ ex(page="mod.html#modules") }} {{ ref(page="items/modules.html#modules") }} com a definição dentro de `{}`. {{ below(target="/tooling/project-anatomy/#project-anatomy") }} |
| `mod m;` | Define um módulo cuja definição vem de `m.rs` ou `m/mod.rs`. {{ below(target="/tooling/project-anatomy/#project-anatomy") }} |
| `a::b` | **Caminho** {{ ex(page="mod/use.html") }} {{ ref(page="paths.html")}} para o elemento `b` dentro de `a`, que pode ser `mod`, `enum` etc. |
| {{ tab() }} `::b` | Procura `b` na **raiz da crate** {{ edition(ed="'15") }} {{ ref(page="glossary.html#crate")}} ou no **prelúdio externo**; {{ edition(ed="'18") }} {{ ref(page="names/preludes.html#extern-prelude")}} é um **caminho global**. {{ ref(page="paths.html#path-qualifiers")}} {{ deprecated() }} |
| {{ tab() }} `crate::b` | Procura `b` na raiz da crate. {{ edition(ed="'18") }} |
| {{ tab() }} `self::b` | Procura `b` no módulo atual. |
| {{ tab() }} `super::b` | Procura `b` no módulo pai. |
| `use a::b;` | **Usa** {{ ex(page="mod/use.html#the-use-declaration") }} {{ ref(page="items/use-declarations.html") }} `b` diretamente neste escopo, sem precisar escrever `a`. |
| `use a::{b, c};` | O mesmo, mas traz `b` e `c` para o escopo. |
| `use a::b as x;` | Traz `b` para o escopo com o nome `x`, como em `use std::error::Error as E`. |
| `use a::b as _;` | Traz `b` anonimamente para o escopo; útil para traits com nomes conflitantes. |
| `use a::*;` | Importa tudo de `a`; só é recomendado se `a` for algum **prelúdio**. {{ std(page="std/prelude/index.html#other-preludes")}} {{ link(url="https://stackoverflow.com/questions/36384840/what-is-the-prelude" ) }} |
| `pub use a::b;` | Traz `a::b` para o escopo e o reexporta a partir daqui. |
| `pub T` | **Visibilidade** {{ book(page="ch07-02-defining-modules-to-control-scope-and-privacy.html") }} {{ ref(page="visibility-and-privacy.html")}} de `T`: público se o caminho que o contém também for público. |
| {{ tab() }} `pub(crate) T` | Visível, no máximo,<sup>1</sup> na crate atual. |
| {{ tab() }} `pub(super) T` | Visível, no máximo,<sup>1</sup> no módulo pai. |
| {{ tab() }} `pub(self) T` | Visível, no máximo,<sup>1</sup> no módulo atual; é o padrão e equivale à ausência de `pub`. |
| {{ tab() }} `pub(in a::b) T` | Visível, no máximo,<sup>1</sup> no ancestral `a::b`. |
| `extern crate a;` | Declara dependência de uma **crate** externa; {{ book(page="ch02-00-guessing-game-tutorial.html#using-a-crate-to-get-more-functionality") }} {{ ref(page="items/extern-crates.html#extern-crate-declarations") }} {{ deprecated() }} basta usar `use a::b` em {{ edition(ed="'18") }}. |
| `extern "C" {}` | _Declara_ dependências externas e a ABI, como `"C"`, para **FFI**. {{ book(page="ch19-01-unsafe-rust.html#using-extern-functions-to-call-external-code") }} {{ ex(page="std_misc/ffi.html#foreign-function-interface") }} {{ nom(page="ffi.html#calling-foreign-functions") }} {{ ref(page="items/external-blocks.html#external-blocks") }} |
| `extern "C" fn f() {}` | _Define_ uma função exportada com uma ABI, como `"C"`, para FFI. |

</fixed-2-column>

<footnotes>

<sup>1</sup> Itens em módulos filhos sempre têm acesso a qualquer item, independentemente de ele ser `pub`.

</footnotes>
