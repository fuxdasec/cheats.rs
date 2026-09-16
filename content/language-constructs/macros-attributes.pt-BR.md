+++
title = "Macros e atributos"
description = "Invocação e definição de macros em Rust, atributos, derive e sintaxe de compilação condicional."
weight = 8
template = "topic.html"

[extra]
seo_title = "Macros e atributos"
anchor = "macros-attributes"
print = true
translation_of = "language-constructs/macros-attributes.md"
source_hash = "c52e46034ef6e1549666e11ea87c89825398517cfbd33acd5efef54a4c971581"
+++
Construções de geração de código expandidas antes da compilação propriamente dita.

<fixed-2-column>

| Exemplo | Explicação |
|---------|---------|
| `m!()` | Invocação de **macro**; {{ book(page="ch19-06-macros.html") }} {{std(page="std/index.html#macros")}} {{ ref(page="macros.html") }} também aceita `m!{}` e `m![]`, dependendo da macro. |
| `#[attr]` | **Atributo externo** {{ex(page="attribute.html")}} {{ref(page="attributes.html")}} que anota o item seguinte. |
| `#![attr]` | Atributo interno que anota o item _que o contém_. |

</fixed-2-column>

{{ tablesep() }}

<fixed-2-column class="color-header special_example">

| Dentro de macros <sup>1</sup> | Explicação |
|---------|---------|
| `$x:ty` | Captura de macro: o **especificador de fragmento** `:ty` {{ ref(page="macros-by-example.html#metavariables") }} <sup>,2</sup> declara o que `$x` pode ser. |
| `$x` | Substituição de macro; por exemplo, usa o `$x:ty` capturado acima. |
| `$(x),*` | **Repetição** {{ ref(page="macros-by-example.html#repetitions") }} de macro _zero ou mais vezes_. |
| {{ tab() }} `$(x),+` | O mesmo, mas _uma ou mais vezes_. |
| {{ tab() }} `$(x)?` | O mesmo, mas _zero ou uma vez_; o separador não se aplica. |
| {{ tab() }} `$(x)<<+` | Também são aceitos separadores diferentes de `,`; aqui, `<<`. |

</fixed-2-column>

<footnotes>

<sup>1</sup> Aplica-se a **macros por exemplo**. {{ ref(page="macros-by-example.html") }} <br>
<sup>2</sup> Veja [**Diretivas de ferramentas**](/tooling/tooling-directives/#tooling-directives) abaixo para todos os especificadores de fragmento.

</footnotes>
