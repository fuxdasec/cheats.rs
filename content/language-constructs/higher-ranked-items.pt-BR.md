+++
title = "Itens de ordem superior"
description = "Tipos de ordem superior em Rust, limites de traits, ponteiros de função, closures e relações entre lifetimes."
weight = 11
template = "topic.html"

[extra]
seo_title = "Itens de ordem superior"
anchor = "higher-ranked-items"
print = true
translation_of = "language-constructs/higher-ranked-items.md"
source_hash = "edaa70fc84740466e2a79fd682b7a591bb6f2498737130df6c28aae484cf5381"
+++
Tipos e traits _propriamente ditos_ que abstraem sobre algo, geralmente lifetimes.

<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `for<'a>` | Marcador de **limites de ordem superior**. {{ nom(page="hrtb.html")}} {{ ref(page="trait-bounds.html#higher-ranked-trait-bounds")}} {{ esoteric() }} |
| {{ tab() }} `trait T: for<'a> R<'a> {}` | Qualquer `S` que implemente `impl T` também precisa satisfazer `R` para qualquer lifetime. |
| `fn(&'a u8)` | Tipo de ponteiro de função que armazena uma função invocável com o lifetime **específico** `'a`. |
| `for<'a> fn(&'a u8)` | **Tipo de ordem superior**<sup>1</sup> {{ link(url="https://github.com/rust-lang/rust/issues/56105") }} que armazena uma função invocável com **qualquer** lifetime; é um subtipo{{ below(target="/working-with-types/type-conversions/#type-conversions") }} do caso anterior. |
| {{ tab() }} `fn(&'_ u8)` | O mesmo; é expandido automaticamente para o tipo `for<'a> fn(&'a u8)`. |
| {{ tab() }} `fn(&u8)` | O mesmo; é expandido automaticamente para o tipo `for<'a> fn(&'a u8)`. |
| `dyn for<'a> Fn(&'a u8)` | Tipo de objeto de trait de ordem superior; funciona como `fn` acima. |
| {{ tab() }} `dyn Fn(&'_ u8)` | O mesmo; é expandido automaticamente para o tipo `dyn for<'a> Fn(&'a u8)`. |
| {{ tab() }} `dyn Fn(&u8)` | O mesmo; é expandido automaticamente para o tipo `dyn for<'a> Fn(&'a u8)`. |

<footnotes>

<sup>1</sup> Sim, `for<>` faz parte do tipo; por isso se escreve `impl T for for<'a> fn(&'a u8)` abaixo.

</footnotes>

</fixed-2-column>


<div class="color-header special_example">
{{ tablesep() }}

| Implementação de traits | Explicação |
|---------|-------------|
| `impl<'a> T for fn(&'a u8) {}` | Implementa a trait para um ponteiro de função cuja chamada aceita o lifetime **específico** `'a`, implementando `T`. |
| `impl T for for<'a> fn(&'a u8) {}` | Implementa a trait para um ponteiro de função cuja chamada aceita **qualquer** lifetime, implementando `T`. |
| {{ tab() }} `impl T for fn(&u8) {}` | O mesmo, na forma abreviada. |

</div>
