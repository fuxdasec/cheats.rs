+++
title = "Açúcar sintático"
description = "Açúcar sintático de Rust, expansão da sintaxe, desreferenciamento, coerções e conversões implícitas."
weight = 16
template = "topic.html"

[extra]
seo_title = "Açúcar sintático"
anchor = "language-sugar"
print = true
translation_of = "behind-the-scenes/language-sugar.md"
source_hash = "170ac7d41d72e29ecd2b1f7a10e005c7759cdc507642e9f4e25c9919d749f128"
+++
Se algo funciona e você pensa que “isso não deveria funcionar”, a explicação pode ser um destes recursos.


<div class="color-header language-sugar">


| Nome | Descrição |
|--------| -----------|
| **Coerções** {{ nom(page="coercions.html") }} | Enfraquecem tipos para ajustá-los à assinatura, como `&mut T` para `&T`; veja conversões de tipos. {{ below(target="/working-with-types/type-conversions/#type-conversions") }} |
| **Deref** {{ nom(page="vec-deref.html") }} {{ link(url="https://stackoverflow.com/questions/28519997/what-are-rusts-exact-auto-dereferencing-rules") }} | [Desreferencia](https://doc.rust-lang.org/std/ops/trait.Deref.html) `x: T` até que `*x`, `**x` etc. sejam compatíveis com algum destino `S`. |
| **Prelúdio** {{ std(page="std/prelude/index.html") }} | Importa automaticamente itens básicos, como `Option` e `drop()`.
| **Novo empréstimo** {{ link(url="https://quinedot.github.io/rust-learning/st-reborrow.html") }} | Como `x: &mut T` não pode ser copiado, move um novo `&mut *x` em seu lugar. |
| **Elisão de lifetimes** {{ book(page="ch10-03-lifetime-syntax.html#lifetime-elision") }} {{ nom(page="lifetime-elision.html#lifetime-elision") }} {{ ref(page="lifetime-elision.html#lifetime-elision") }} | Permite escrever `f(x: &T)` em vez de `f<'a>(x: &'a T)`, de forma mais breve. |
| **Extensão de lifetimes** {{ link(url="https://blog.m-ou.se/super-let/") }} {{ ref(page="destructors.html#temporary-lifetime-extension") }} | Em `let x = &tmp().f` e casos semelhantes, mantém um valor temporário além da linha atual. |
| **Resolução de métodos** {{ ref(page="expressions/method-call-expr.html") }} | Desreferencia ou toma emprestado `x` até que `x.f()` funcione. |
| **Ergonomia de match** {{ rfc(page="2005-match-ergonomics.html") }} | Desreferencia repetidamente o [valor examinado](https://doc.rust-lang.org/stable/reference/glossary.html#scrutinee) e adiciona `ref` e `ref mut` aos vínculos. |
| **Promoção estática de valores temporários** {{ rfc(page="1414-rvalue_static_promotion.html") }} {{ esoteric() }} | Torna `'static` as referências a constantes, como `&42`, `&None` e `&mut []`. |
| **Definições duplas** {{ rfc(page="1506-adt-kinds.html#tuple-structs") }} {{ esoteric() }} | Definir um item, como `struct S(u8)`, define outro implicitamente, como `fn S`. |
| **Fluxo oculto de Drop** {{ ref(page="destructors.html") }} {{ esoteric() }} | No fim de blocos `{ ... }` ou em uma atribuição `_`, pode chamar `T::drop()`. {{ std(page="std/ops/trait.Drop.html") }} |
| **Drop não pode ser chamado diretamente** {{ std(page="std/ops/trait.Drop.html") }} {{ esoteric() }} | O compilador proíbe chamar `T::drop()` explicitamente; use `mem::drop()`. {{ std(page="std/mem/fn.drop.html") }} |
| **Auto traits** {{ ref(page="special-types-and-traits.html#auto-traits") }} | São implementadas automaticamente para seus tipos, closures e futures sempre que possível. |


</div>

{{ tablesep() }}

> **Opinião** {{ opinionated() }} — Esses recursos facilitam o uso de Rust, mas dificultam seu aprendizado. Para compreender a linguagem de fato, dedique um tempo extra a explorá-los.
