+++
title = "Closures em APIs"
description = "Como aceitar, armazenar e retornar closures de Rust usando Fn, FnMut, FnOnce e impl Trait."
weight = 40
template = "topic.html"

[extra]
seo_title = "Closures em APIs"
anchor = "closures-in-apis"
print = true
translation_of = "coding-guides/closures-in-apis.md"
source_hash = "584f67182ea8a9e59b570dd9130d815bb33ead580126cb80650970dc89a2e413"
+++
Existe a relação de subtraits `Fn` : `FnMut` : `FnOnce`. Isso significa que uma closure que
implementa `Fn` {{ std(page="std/ops/trait.Fn.html") }} também implementa `FnMut` e `FnOnce`. Da mesma forma, uma closure
que implementa `FnMut` {{ std(page="std/ops/trait.FnMut.html") }} também implementa `FnOnce`. {{ std(page="std/ops/trait.FnOnce.html") }}

Do ponto de vista de quem chama, isso significa:

<div class="color-header green">

| Assinatura | A função `g` pode chamar… | A função `g` aceita… |
|--------| -----------| -----------|
| `g<F: FnOnce()>(f: F)` | …`f()` no máximo uma vez. | `Fn`, `FnMut`, `FnOnce` |
| `g<F: FnMut()>(mut f: F)` | …`f()` várias vezes. | `Fn`, `FnMut` |
| `g<F: Fn()>(f: F)` | …`f()` várias vezes. | `Fn` |

</div>

<footnotes>

Observe que uma função **exigir** uma closure `Fn` é a opção
mais restritiva para quem chama; mas **ter** uma closure `Fn`
é a opção mais compatível com qualquer função.

</footnotes>



{{ tablesep() }}

Do ponto de vista de quem define a closure:

<div class="color-header green">

| Closure | Implementa<sup>*</sup> | Observação |
|--------| -----------| --- |
| <code> &vert;&vert; { moved_s; } </code> | `FnOnce` | Quem chama deve abrir mão da posse de `moved_s`. |
| <code> &vert;&vert; { &mut s; } </code> | `FnOnce`, `FnMut` | Permite que `g()` altere o estado local `s` de quem chama. |
| <code> &vert;&vert; { &s; } </code> | `FnOnce`, `FnMut`, `Fn` | Não pode alterar o estado, mas pode compartilhar e reutilizar `s`. |

</div>

<div class="footnotes">

<sup>*</sup> Rust [prefere capturar](https://doc.rust-lang.org/stable/reference/expressions/closure-expr.html) por referência,
produzindo closures `Fn`, as mais compatíveis do ponto de vista de quem chama. Porém, pode ser
forçado a capturar seu ambiente por cópia ou movimento com a
sintaxe `move || {}`.

</div>

{{ tablesep() }}

Isso produz as seguintes vantagens e desvantagens:

<div class="color-header green">

| Requisito | Vantagem | Desvantagem |
|--------| -----------| -----------|
| `F: FnOnce` | <span class="good">Fácil de satisfazer para quem chama.</span> | <span class="bad">Uso único: `g()` só pode chamar `f()` uma vez.</span> |
| `F: FnMut` | <span class="good">Permite que `g()` altere o estado de quem chama.</span> | <span class="bad">Quem chama não pode reutilizar as capturas durante `g()`.</span> |
| `F: Fn` | <span class="good">Várias closures podem coexistir.</span> | <span class="bad">É a forma mais difícil de produzir para quem chama.</span> |

</div>


{{ tablesep() }}



<!-- ## Macro Hygiene -->
<!-- {{ tablesep() }} -->
