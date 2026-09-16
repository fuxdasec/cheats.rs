+++
title = "Aliases de tipos e casts"
description = "Aliases de tipos, tipos associados, casts, coerções e sintaxe de conversão em Rust."
weight = 7
template = "topic.html"

[extra]
seo_title = "Aliases de tipos e casts"
anchor = "type-aliases-and-casts"
print = true
translation_of = "language-constructs/type-aliases-and-casts.md"
source_hash = "e7809b63a329c36b3c36127edfd97a0d15f4375c67580bbca2692e7567a4fdad"
+++
Nomes alternativos para tipos e formas de converter um tipo em outro.

<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `type T = S;` | Cria um **alias de tipo**, {{ book(page="ch19-04-advanced-types.html#creating-type-synonyms-with-type-aliases") }} {{ ref(page="items/type-aliases.html#type-aliases") }} isto é, outro nome para `S`. |
| `Self` | Alias do **tipo que está sendo implementado**, {{ ref(page="types.html#self-types") }} por exemplo, `fn new() -> Self`. |
| `self` | **Receptor do método** {{ book(page="ch05-03-method-syntax.html#method-syntax") }} {{ ref(page="items/associated-items.html#methods")}} em `fn f(self) {}`, de forma semelhante a `fn f(self: Self) {}`. |
| {{ tab() }} `&self` | O mesmo, mas com empréstimo compartilhado do receptor; equivale a `f(self: &Self)`. |
| {{ tab() }} `&mut self` | O mesmo, mas com empréstimo mutável; equivale a `f(self: &mut Self)`. |
| {{ tab() }} `self: Box<Self>` | [**Tipo arbitrário de receptor**](https://github.com/withoutboats/rfcs/blob/arbitray-receivers/text/0000-century-of-the-self-type.md): adiciona métodos a ponteiros inteligentes (`my_box.f_of_self()`). |
| `<S as T>` | **Desambigua** {{ book(page="ch19-03-advanced-traits.html#fully-qualified-syntax-for-disambiguation-calling-methods-with-the-same-name") }} {{ ref(page="expressions/call-expr.html#disambiguating-function-calls") }} o tipo `S` como a trait `T`, por exemplo, `<S as T>::f()`. |
| `a::b as c` | Na importação `use` de um símbolo, importa `S` com o nome `R`, por exemplo, `use a::S as R`. |
| `x as u32` | **Cast** primitivo: {{ ex(page="types/cast.html#casting") }} {{ ref(page="expressions/operator-expr.html#type-cast-expressions") }} pode truncar o valor e apresentar resultados surpreendentes. <sup>1</sup> {{ nom(page="casts.html") }} |

</fixed-2-column>

<footnotes>

<sup>1</sup> Veja [**Conversões de tipos**](/working-with-types/type-conversions/#type-conversions) abaixo para conhecer todas as formas de converter entre tipos.

</footnotes>
