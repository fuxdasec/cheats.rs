+++
title = "Genéricos e restrições"
description = "Genéricos de Rust, limites de traits, cláusulas where, tipos associados e restrições genéricas."
weight = 10
template = "topic.html"

[extra]
seo_title = "Genéricos e restrições"
anchor = "generics-constraints"
print = true
translation_of = "language-constructs/generics-constraints.md"
source_hash = "f3ebebd41ff207faaf606a028fb4634bc45bc4d6b9eae7fcbd5d36b45608a615"
+++
Genéricos se combinam com construtores de tipos, traits e funções para oferecer mais flexibilidade a quem usa seu código.

<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `struct S<T> …` | Um tipo **genérico** {{ book(page="ch10-01-syntax.html") }} {{ ex(page="generics.html") }} com um parâmetro de tipo; `T` é um marcador de posição neste exemplo. |
| `S<T> where T: R` | **Limite de trait**: {{ book(page="ch10-02-traits.html#using-trait-bounds-to-conditionally-implement-methods") }} {{ ex(page="generics/bounds.html") }} {{ ref(page="trait-bounds.html#trait-and-lifetime-bounds" ) }} restringe os tipos `T` permitidos e garante que `T` implemente `R`. |
| {{ tab() }} `where T: R, P: S` | **Limites de traits independentes**: um para `T` e outro para `P`, não mostrado. |
| {{ tab() }} `where T: R, S` | Erro de compilação; {{ bad() }} provavelmente você quer o limite composto `R + S` mostrado abaixo. |
| {{ tab() }} `where T: R + S` | **Limite composto de traits**: {{ book(page="ch10-02-traits.html#specifying-multiple-trait-bounds-with-the--syntax") }} {{ ex(page="generics/multi_bounds.html") }} `T` deve satisfazer `R` e `S`. |
| {{ tab() }} `where T: R + 'a` | O mesmo, com um lifetime. `T` deve satisfazer `R`; se `T` tiver um lifetime, ele deve durar pelo menos tanto quanto `'a`. |
| {{ tab() }} `where T: ?Sized` | Remove um limite de trait predefinido, neste caso `Sized`. {{ todo() }} |
| {{ tab() }} `where T: 'a` | **Limite de lifetime** de um tipo: {{ ex(page="scope/lifetime/lifetime_bounds.html") }} se T contiver referências, elas devem durar pelo menos tanto quanto `'a`. |
| {{ tab() }} `where T: 'static` | O mesmo; isso _não_ significa que o valor `t` _vá_ {{ bad() }} viver por `'static`, apenas que poderia. |
| {{ tab() }} `where 'b: 'a` | O lifetime `'b` deve durar pelo menos tanto quanto o limite `'a`. |
| {{ tab() }} `where u8: R<T>` | Também permite condições que envolvam _outros_ tipos. {{ esoteric() }} |
| `S<T: R>` | Limite abreviado: quase igual ao anterior, mas mais curto de escrever. |
| `S<const N: usize>` | **Limite de constante genérica**: {{ ref(page="items/generics.html#const-generics") }} quem usa o tipo `S` pode fornecer o valor constante `N`. |
| {{ tab() }} `S<10>` | No uso, parâmetros constantes podem receber valores primitivos. |
| {{ tab() }} `S<{5+5}>` | Expressões devem ficar entre chaves. |
| `S<T = R>` | **Parâmetros padrão**: {{ book(page="ch19-03-advanced-traits.html#default-generic-type-parameters-and-operator-overloading") }} facilita o uso de `S` sem eliminar a flexibilidade. |
| {{ tab() }} `S<const N: u8 = 0>` | Parâmetro constante padrão; por exemplo, em `f(x: S) {}`, o parâmetro `N` vale `0`. |
| {{ tab() }} `S<T = u8>` | Parâmetro de tipo padrão; por exemplo, em `f(x: S) {}`, o parâmetro `T` é `u8`. |
| `S<'_>` | **Lifetime anônimo** inferido; pede ao compilador que o deduza quando for óbvio. |
| `S<_>` | **Tipo anônimo** inferido, por exemplo, como `let x: Vec<_> = iter.collect()`. |
| `S::<T>` | **Turbofish**: {{ std(page="std/iter/trait.Iterator.html#method.collect")}} desambigua tipos no local da chamada, como em `f::<u32>()`. |
| {{ tab() }} `E::<T>::A` | Enums genéricos podem receber seus parâmetros no tipo `E`… |
| {{ tab() }} `E::A::<T>` | …ou na variante, aqui `A`; isso permite `Ok::<R, E>(r)` e construções semelhantes. |
| `trait T<X> {}` | Trait genérica sobre `X`. Pode ter várias `impl T for S`, uma por `X`. |
| `trait T { type X; }` | Define um **tipo associado** {{ book(page="ch19-03-advanced-traits.html#specifying-placeholder-types-in-trait-definitions-with-associated-types") }} {{ ref(page="items/associated-items.html#associated-types") }} {{ rfc(page="0195-associated-items.html") }} `X`. Só é possível uma `impl T for S`. |
| `trait T { type X<G>; }` | Define um **tipo associado genérico** (GAT): {{ rfc(page="1598-generic_associated_types.html") }} `X` pode ser genérico sobre `Vec<>`. |
| `trait T { type X<'a>; }` | Define um GAT genérico sobre um lifetime. |
| {{ tab() }} `type X = R;` | Define o tipo associado dentro de `impl T for S { type X = R; }`. |
| {{ tab() }} `type X<G> = R<G>;` | O mesmo para GATs, por exemplo, `impl T for S { type X<G> = Vec<G>; }`. |
| `impl<T> S<T> {}` | Implementa `fn` para qualquer `T` em `S<T>` **de forma genérica**; {{ ref(page="items/implementations.html#generic-implementations") }} aqui, `T` é um parâmetro de tipo. |
| `impl S<T> {}` | Implementa `fn` exatamente para `S<T>` **de forma inerente**; {{ ref(page="items/implementations.html#inherent-implementations") }} aqui, `T` é um tipo específico, como `u8`. |
| `fn f() -> impl T` | **Tipos existenciais**, também chamados de [_RPIT_](https://santiagopastorino.com/2022/10/20/what-rpits-rpitits-and-afits-and-their-relationship/): {{ book(page="ch10-02-traits.html#returning-types-that-implement-traits") }} retorna um `S` desconhecido de quem chama, que implementa `impl T`. |
| {{ tab() }} `-> impl T + 'a` | Indica que o tipo oculto vive pelo menos tanto quanto `'a`. {{ rfc(page="3498-lifetime-capture-rules-2024.html#capturing-lifetimes") }} |
| {{ tab() }} `-> impl T + use<'a>` | Em vez disso, indica que o tipo oculto capturou o lifetime `'a`: **limite use**. {{ link(url="https://blog.rust-lang.org/2024/09/05/impl-trait-capture-rules.html") }} {{ todo() }} |
| {{ tab() }} `-> impl T + use<'a, R>` | Também indica que o tipo oculto pode ter capturado lifetimes de `R`. |
| {{ tab() }} `-> S<impl T>` | A parte `impl T` também pode ser usada dentro de argumentos de tipo. |
| `fn f(x: &impl T)` | Limite de trait com **impl Trait**: {{ book(page="ch10-02-traits.html#trait-bound-syntax") }} semelhante a `fn f<S: T>(x: &S)` abaixo. |
| `fn f(x: &dyn T)` | Invoca `f` por **despacho dinâmico**: {{ book(page="ch17-02-trait-objects.html#using-trait-objects-that-allow-for-values-of-different-types") }} {{ ref(page="types.html#trait-objects") }} `f` não será instanciada para `x`. |
| `fn f<X: T>(x: X)` | Função genérica sobre `X`; `f` será instanciada ([monomorfizada](https://en.wikipedia.org/wiki/Monomorphization)) para cada `X`. |
| `fn f() where Self: R;` | Em `trait T {}`, torna `f` acessível somente para tipos que também implementem `impl R`. |
| {{ tab() }} `fn f() where Self: Sized;` | Usar `Sized` pode excluir `f` da vtable do objeto de trait, permitindo `dyn T`. |
| {{ tab() }} `fn f() where Self: R {}` | Outros limites `R` são úteis com funções padrão; funções sem implementação padrão precisariam ser implementadas de qualquer forma. |
</fixed-2-column>
