+++
title = "Referências e ponteiros"
description = "Uma visão rápida da sintaxe de referências, ponteiros, empréstimos, mutabilidade e desreferenciamento em Rust."
weight = 3
template = "topic.html"

[extra]
seo_title = "Sintaxe de referências e ponteiros"
anchor = "references-pointers"
print = true
translation_of = "language-constructs/references-pointers.md"
source_hash = "2af97dcd54e1eea74a0414c542727f7d492402131194734eda78841205dec651"
+++
Acesso à memória da qual não se tem posse. Veja também a seção Genéricos e restrições.


<fixed-2-column>

<!-- | {{ tab() }} `&pin mut T` | Ergonomic wrapper for `Pin<&mut T>`. {{ std(page="std/pin/") }} {{ experimental() }} Prevents _selfref._ `t` from moving. |
| {{ tab() }} `&pin const T` | Ergonomic wrapper for `Pin<&T>`. {{ experimental() }} | -->


| Exemplo | Explicação |
|---------|-------------|
| `&S` | **Referência** compartilhada {{ book(page="ch04-02-references-and-borrowing.html") }} {{ std(page="std/primitive.reference.html") }} {{ nom(page="references.html")}} {{ ref(page="types.html#pointer-types")}}: tipo capaz de armazenar _qualquer_ `&s`. |
| {{ tab() }} `&[S]` | Referência especial a slice que contém (`addr`, `count`). |
| {{ tab() }} `&str` | Referência especial a uma fatia de string que contém (`addr`, `byte_len`). |
| {{ tab() }} `&mut S` | Referência exclusiva que permite mutação; também se aplica a `&mut [S]`, `&mut dyn S` etc. |
| {{ tab() }} `&dyn T` | Referência especial a **objeto de trait**, {{ book(page="ch17-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types") }} {{ ref(page="types/trait-object.html")}} representada por (`addr`, `vtable`); `T` deve ser **compatível com dyn**. {{ ref(page="items/traits.html#dyn-compatibility")}} |
| `&s` | **Empréstimo** compartilhado {{ book(page="ch04-02-references-and-borrowing.html") }} {{ ex(page="scope/borrow.html") }} {{ std(page="std/borrow/trait.Borrow.html") }}: endereço, comprimento, vtable etc. _deste_ `s`, como em `0x1234`. |
| {{ tab() }} `&mut s` | Empréstimo exclusivo que permite **mutação**. {{ ex(page="scope/borrow/mut.html") }} |
| `*const S` | **Tipo de ponteiro bruto** imutável {{ book(page="ch19-01-unsafe-rust.html#dereferencing-a-raw-pointer") }} {{ std(page="std/primitive.pointer.html") }} {{ ref(page="types.html#raw-pointers-const-and-mut") }}, sem garantias de segurança de memória. |
| {{ tab() }} `*mut S` | Tipo de ponteiro bruto mutável, sem garantias de segurança de memória. |
| {{ tab() }} `&raw const s` | Cria um ponteiro bruto sem passar por uma referência; veja `ptr:addr_of!()` {{ std(page="std/ptr/macro.addr_of.html") }} {{ esoteric() }}. |
| {{ tab() }} `&raw mut s` | O mesmo, mas mutável. {{ experimental() }} Necessário para campos compactados sem alinhamento. {{ esoteric() }} |
| `ref s` | **Vínculo por referência**: {{ ex(page="scope/borrow/ref.html") }} faz o vínculo ter um tipo de referência. {{ deprecated() }} |
| {{ tab() }} `let ref r = s;` | Equivale a `let r = &s`. |
| {{ tab() }} `let S { ref mut x } = s;` | Vínculo por referência mutável (`let x = &mut s.x`); versão abreviada de desestruturação com {{ below( target = "/language-constructs/pattern-matching/#pattern-matching") }}. |
| `*r` | **Desreferencia** {{ book(page="ch15-02-deref.html") }} {{ std(page="std/ops/trait.Deref.html") }} {{ nom(page="vec-deref.html") }} uma referência `r` para acessar aquilo para que ela aponta. |
| {{ tab() }} `*r = s;` | Se `r` for uma referência mutável, move ou copia `s` para a memória de destino. |
| {{ tab() }} `s = *r;` | Faz de `s` uma cópia do valor referenciado por `r`, se esse valor for `Copy`. |
| {{ tab() }} `s = *r;` | Não funciona {{ bad() }} se `*r` não for `Copy`, pois moveria o valor e deixaria a posição vazia. |
| {{ tab() }} `s = *my_box;` | Caso especial{{ link(url="https://web.archive.org/web/20230130111147/https://old.reddit.com/r/rust/comments/b4so6i/what_is_exactly/ej8xwg8/") }} de **`Box`**{{ std(page="std/boxed/index.html") }}: permite mover o conteúdo encapsulado mesmo que ele não seja `Copy`. |
| `'a` | **Parâmetro de lifetime**: {{ book(page="ch10-00-generics.html") }} {{ ex(page="scope/lifetime.html")}} {{ nom(page="lifetimes.html") }} {{ ref(page="items/generics.html#type-and-lifetime-parameters")}} duração de um fluxo na análise estática. |
| {{ tab() }} `&'a S` | Aceita apenas o endereço de algum `s` que permaneça válido por `'a` ou mais. |
| {{ tab() }} `&'a mut S` | O mesmo, permitindo alterar o conteúdo no endereço. |
| {{ tab() }} `struct S<'a> {}` | Indica que este `S` conterá um endereço com lifetime `'a`. Quem cria `S` escolhe `'a`. |
| {{ tab() }} `trait T<'a> {}` | Indica que qualquer `S` que implemente `impl T for S` pode conter um endereço. |
| {{ tab() }} `fn f<'a>(t: &'a T)` | Indica que esta função lida com algum endereço. Quem chama escolhe `'a`. |
| `'static` | Lifetime especial que dura toda a execução do programa. |

</fixed-2-column>
