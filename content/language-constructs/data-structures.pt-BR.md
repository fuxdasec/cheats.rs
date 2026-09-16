+++
title = "Estruturas de dados"
description = "Declarações de estruturas de dados e vínculos em Rust, incluindo structs, enums, unions, constantes e variáveis."
weight = 2
template = "topic.html"

[extra]
seo_title = "Estruturas de dados"
anchor = "data-structures"
print = true
translation_of = "language-constructs/data-structures.md"
source_hash = "65be8cfaa4de196913d3920513001f9081f058af595c261d60c7704dc33e6a0a"
+++
Tipos de dados e posições de memória definidos por palavras-chave.

<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `struct S {}` | Define uma **struct** {{ book(page="ch05-00-structs.html") }} {{ ex(page="custom_types/structs.html") }} {{ std(page="std/keyword.struct.html") }} {{ ref(page="expressions/struct-expr.html") }} com campos nomeados. |
| {{ tab() }} `struct S { x: T }` | Define uma struct com um campo chamado `x` do tipo `T`. |
| {{ tab() }} `struct S` &#8203;`(T);` | Define uma struct de tupla com o campo numerado `.0` do tipo `T`. |
| {{ tab() }} `struct S;` | Define uma struct unitária de **tamanho zero**. {{ nom(page="exotic-sizes.html#zero-sized-types-zsts")}} Não ocupa espaço e é eliminada pela otimização. |
| `enum E {}` | Define um **enum**; {{ book(page="ch06-01-defining-an-enum.html") }} {{ ex(page="custom_types/enum.html#enums") }} {{ ref(page="items/enumerations.html") }} veja também [tipos de dados algébricos](https://en.wikipedia.org/wiki/Algebraic_data_type) e [uniões discriminadas](https://en.wikipedia.org/wiki/Tagged_union). |
| {{ tab() }} `enum E { A, B`&#8203;`(), C {} }` | Define variantes de enum: unitárias `A`, de tupla `B` &#8203;`()` ou de struct `C{}`. |
| {{ tab() }} `enum E { A = 1 }` | Enum com **valores discriminantes** explícitos, {{ ref(page="items/enumerations.html#custom-discriminant-values-for-fieldless-enumerations") }} por exemplo, para FFI. |
| {{ tab() }} `enum E {}` | Um enum sem variantes é **não habitado**: {{ ref(page="glossary.html#uninhabited") }} não pode ser instanciado; compare com o tipo never {{ below(target="/language-constructs/miscellaneous/#miscellaneous") }} {{ esoteric() }}. |
| `union U {}` | **Union** semelhante à de C, {{ ref(page="items/unions.html") }} com acesso unsafe para compatibilidade com FFI. {{ esoteric() }} |
| `static X: T = T();` | **Variável global** {{ book(page="ch19-01-unsafe-rust.html#accessing-or-modifying-a-mutable-static-variable") }} {{ ex(page="custom_types/constants.html#constants") }} {{ ref(page="items/static-items.html#static-items") }} com lifetime `'static` e uma única {{ bad() }}{{ note( note="1") }} posição de memória. |
| `const X: T = T();` | Define uma **constante**, {{ book(page="ch03-01-variables-and-mutability.html#constants") }} {{ ex(page="custom_types/constants.html") }} {{ ref(page="items/constant-items.html") }} copiada para um valor temporário quando usada. |
| `let x: T;` | Aloca `T` bytes na pilha{{ note( note="2") }} com o vínculo `x`. Pode receber um valor uma única vez; não é mutável. |
| `let mut x: T;` | Como `let`, mas permite **mutação** {{ book(page="ch03-01-variables-and-mutability.html") }} {{ ex(page="variable_bindings/mut.html") }} e empréstimos mutáveis.{{ note( note="3") }} |
| {{ tab() }} `x = y;` | Move `y` para `x`, invalidando `y` se `T` não implementar **`Copy`**; {{ std(page="std/marker/trait.Copy.html") }} caso contrário, copia `y`. |

</fixed-2-column>

<footnotes>

<sup>1</sup> Em _bibliotecas_, pode haver várias instâncias de `X` sem que isso seja óbvio, dependendo de como sua crate é importada. {{ link(url="https://doc.rust-lang.org/cargo/reference/resolver.html#version-incompatibility-hazards") }} <br>
<sup>2</sup> **Variáveis com vínculo** {{ book(page="ch03-01-variables-and-mutability.html") }} {{ ex(page="variable_bindings.html") }} {{ ref(page="variables.html") }} ficam na pilha em código síncrono. Em `async {}`, tornam-se parte da máquina de estados assíncrona e podem ficar no heap.<br>
<sup>3</sup> Tecnicamente, _mutável_ e _imutável_ são nomes imprecisos. Um vínculo imutável ou uma referência compartilhada pode conter Cell {{ std(page="std/cell/index.html") }}, que oferece _mutabilidade interna_.

</footnotes>


{{ tablesep() }}

Criação e acesso a estruturas de dados e outros tipos representados por símbolos.

<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `S { x: y }` | Cria `struct S {}` ou um alias via `use` de `enum E::S {}`, com o campo `x` definido como `y`. |
| `S { x }` | O mesmo, usando a variável local `x` para preencher o campo `x`. |
| `S { ..s }` | Preenche os campos restantes a partir de `s`; especialmente útil com `Default::default()`. {{ std(page="std/default/trait.Default.html") }} |
| `S { 0: x }` | Como `S` &#8203;`(x)` abaixo, mas define o campo `.0` com sintaxe de struct. |
| `S`&#8203; `(x)` | Cria `struct S` &#8203;`(T)` ou um alias via `use` de `enum E::S`&#8203; `()`, com o campo `.0` definido como `x`. |
| `S` | Se `S` for uma struct unitária `struct S;` ou um alias via `use` de `enum E::S`, cria um valor de `S`. |
| `E::C { x: y }` | Cria a variante de enum `C`. As outras formas acima também funcionam. |
| `()` | Tupla vazia, como literal e como tipo; também chamada de **unit**. {{ std(page="std/primitive.unit.html") }} |
| `(x)` | Expressão entre parênteses. |
| `(x,)` | Expressão de **tupla** com um elemento. {{ ex(page="primitives/tuples.html") }} {{ std(page="std/primitive.tuple.html") }} {{ ref(page="expressions/tuple-expr.html") }} |
| `(S,)` | Tipo de tupla com um elemento. |
| `[S]` | Tipo de array de comprimento não especificado, ou **slice**. {{ ex(page="primitives/array.html") }} {{ std(page="std/primitive.slice.html") }} {{ ref(page="types/slice.html") }} Não pode existir diretamente na pilha. {{ note( note="*") }} |
| `[S; n]` | **Tipo de array** {{ ex(page="primitives/array.html") }} {{ std(page="std/primitive.array.html") }} {{ ref(page="types/array.html") }} de comprimento fixo `n`, com elementos do tipo `S`. |
| `[x; n]` | **Instância de array** {{ ref(page="expressions/array-expr.html") }}, uma expressão com `n` cópias de `x`. |
| `[x, y]` | Instância de array com os elementos indicados `x` e `y`. |
| `x[0]` | Indexação de uma coleção, aqui por `usize`. Implementada por [**Index**](https://doc.rust-lang.org/std/ops/trait.Index.html) e [**IndexMut**](https://doc.rust-lang.org/std/ops/trait.IndexMut.html). |
| {{ tab() }} `x[..]` | O mesmo, usando um intervalo, aqui o _intervalo completo_; também aceita `x[a..b]`, `x[a..=b]` etc. Veja abaixo. |
| `a..b` | Cria um **intervalo com limite superior exclusivo**: {{ std(page="std/ops/struct.Range.html") }} {{ ref(page="expressions/range-expr.html") }} por exemplo, `1..3` significa `1, 2`. |
| `..b` | **Intervalo até** {{ std(page="std/ops/struct.RangeTo.html") }}, sem limite inferior e com limite superior exclusivo. |
| `..=b` | **Intervalo inclusivo até** {{ std(page="std/ops/struct.RangeToInclusive.html") }}, sem limite inferior. |
| `a..=b` | **Intervalo inclusivo**: {{ std(page="std/ops/struct.RangeInclusive.html") }} `1..=3` significa `1, 2, 3`. |
| `a..` | **Intervalo a partir de** {{ std(page="std/ops/struct.RangeFrom.html") }}, sem limite superior. |
| `..` | **Intervalo completo**, {{ std(page="std/ops/struct.RangeFull.html") }} geralmente representa _toda a coleção_. |
| `s.x` | **Acesso a campo** nomeado: {{ ref(page="expressions/field-expr.html") }} pode tentar [Deref](https://doc.rust-lang.org/std/ops/trait.Deref.html) se `x` não fizer parte do tipo `S`. |
| `s.0` | Acesso a campo numerado, usado em tipos de tupla `S` &#8203;`(T)`. |

</fixed-2-column>

<footnotes>

<sup>*</sup> Por enquanto,{{ rfc( page ="1909-unsized-rvalues.html") }} aguardando a conclusão desta [issue de acompanhamento](https://github.com/rust-lang/rust/issues/48055).

</footnotes>
