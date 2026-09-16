+++
title = "Estabilidade de APIs"
description = "Compatibilidade de APIs em Rust e riscos de versionamento semântico envolvendo tipos, traits, genéricos e interfaces públicas."
weight = 43
template = "topic.html"

[extra]
seo_title = "Estabilidade de APIs"
anchor = "api-stability"
print = true
translation_of = "coding-guides/api-stability.md"
source_hash = "95ff392d84c2b791bd25e9da793826b6d944a7b1bc137b68d2beff89afef0170"
+++
Ao atualizar uma API, estas mudanças podem quebrar código que a utiliza.{{ rfc(page="1105-api-evolution.html") }} Mudanças maiores (🔴) **certamente quebram compatibilidade**; mudanças menores (🟡) **podem quebrá-la**.

<div class="color-header api-stability">


{{ tablesep() }}

| Crates |
|---------|
| 🔴 Fazer uma crate que compilava no canal _stable_ passar a exigir _nightly_. |
| 🔴 Remover features do Cargo. |
| 🟡 Alterar features existentes do Cargo. |

{{ tablesep() }}


| Módulos |
|---------|
| 🔴 Renomear, mover ou remover qualquer item público. |
| 🟡 Adicionar itens públicos, pois isso pode quebrar código que usa `use your_crate::*`. |

{{ tablesep() }}

| Structs |
|---------|
| 🔴 Adicionar um campo privado quando todos os campos atuais são públicos. |
| 🔴 Adicionar um campo público quando não há campos privados. |
| 🟡 Adicionar ou remover campos privados quando já existe pelo menos um antes e depois da mudança. |
| 🟡 Converter uma struct de tupla com pelo menos um campo, todos privados, em uma struct comum, ou vice-versa. |

{{ tablesep() }}

| Enums |
|---------|
| 🔴 Adicionar variantes; é possível mitigar isso com o uso antecipado de `#[non_exhaustive]` {{ ref(page="attributes/type_system.html#the-non_exhaustive-attribute") }}. |
| 🔴 Adicionar campos a uma variante. |


{{ tablesep() }}

| Traits |
|---------|
| 🔴 Adicionar um item sem implementação padrão, quebrando todas as `impl T for S {}` existentes. |
| 🔴 Fazer mudanças não triviais nas assinaturas de itens, afetando quem usa ou implementa a trait. |
| 🔴 Implementar uma trait “fundamental”, pois a ausência dessa implementação já constituía uma garantia. |
| 🟡 Adicionar um item com implementação padrão; pode causar ambiguidade com outra trait existente. |
| 🟡 Adicionar um parâmetro de tipo com valor padrão. |
| 🟡 Implementar uma trait não fundamental; também pode causar ambiguidade de despacho. |

{{ tablesep() }}

| Implementações inerentes |
|---------|
| 🟡 Adicionar itens inerentes; o código cliente pode preferi-los aos métodos de traits e deixar de compilar. |

{{ tablesep() }}

| Assinaturas em definições de tipos |
|---------|
| 🔴 Restringir limites, como de `<T>` para `<T: Clone>`. |
| 🟡 Relaxar limites. |
| 🟡 Adicionar parâmetros de tipo com valores padrão. |
| 🟡 Generalizar usando genéricos. |

| Assinaturas de funções |
|---------|
| 🔴 Adicionar ou remover argumentos. |
| 🟡 Introduzir um parâmetro de tipo. |
| 🟡 Generalizar usando genéricos. |


{{ tablesep() }}

| Mudanças de comportamento |
|---------|
| 🔴 / 🟡 _Mudar a semântica pode não causar erros de compilação, mas pode fazer o código cliente se comportar incorretamente._ |


</div>


{{ tablesep() }}


<!-- ## Authoring Quality Crates

> **Note** <sup>💬</sup> &mdash; This chapter is mildly **subjective**. That said, it tries to be observational with respect to successful Rust crates (i.e., crates with most downloads should check most of these boxes).


<div class="color-header quality_crate">

### Code Patterns

| What | Why |
|--------| ---- |
| ☐ Write idiomatic code, follow API guides. |  |
| ☐ Regularly use `clippy`, `fmt` |   |
| ☐ Err on the side of `#[deny]`, not `#[allow]` | asdasd |


### Infrastructure

| What | Why |
|--------| ---- |
| ☐ Minimize dependencies. | asds |
| ☐ Add optional deps. to essential `trait` crates |  asds |
| ☐ Have unit & integration tests |  asds |
| ☐ Have benchmarks |  asds |


### Site

| What | Why |
|--------| ---- |
| ☐ Feature **prominent** API example, screenshot … | asds |
| ☐ Have permissive license for libs. | asds |

</div>

<footnotes>


</footnotes> -->


<!-- Don't render this section for printing, won't be helpful -->
