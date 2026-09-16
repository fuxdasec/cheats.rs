+++
title = "Conversões de tipos"
description = "Relações e conversões entre tipos de Rust por casts, coerções, From, Into, TryFrom e traits relacionadas."
weight = 36
template = "topic.html"

[extra]
seo_title = "Conversões de tipos"
anchor = "type-conversions"
print = true
translation_of = "working-with-types/type-conversions.md"
source_hash = "0d309079afeb02256c25aeef1ae57a194f2ea342ee4eec710bdd7678ad353f82"
+++
Como obter `B` quando você tem `A`?

<div class="color-header variance">

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-1" name="tab-variance" checked>
<label for="tab-variance-1"><b>Introdução</b></label>
<panel><div>

```
fn f(x: A) -> B {
    // How can you obtain B from A?
}
```

| Método | Explicação |
|--------| -----------|
| **Identidade** | Caso trivial: `B` **é exatamente** `A`. |
| **Cálculo** | Cria e manipula uma instância de `B` por meio de **código** que transforma os dados. |
| **Casts** | Conversão **explícita** entre tipos que exige cuidado. |
| **Coerções** | Conversão **automática** segundo regras de enfraquecimento.<sup>1</sup> |
| **Subtipagem** | Conversão **automática** entre tipos com a mesma organização e lifetimes diferentes.<sup>1</sup> |

{{ tablesep() }}

<footnotes>

<sup>1</sup> Embora ambas convertam `A` em `B`, **coerções** geralmente levam a um `B` _não relacionado_, um tipo do qual se esperam métodos diferentes,
enquanto **subtipagem** leva a um `B` que difere apenas nos lifetimes.

</footnotes>

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-2" name="tab-variance">
<label for="tab-variance-2"><b>Cálculo com traits</b></label>
<panel><div>

```
fn f(x: A) -> B {
    x.into()
}
```

A forma usual de obter `B` a partir de `A`. Algumas traits representam relações canônicas entre tipos que o usuário pode calcular:

| Trait | Exemplo | A trait indica… |
|--------| -----------|-----------|
| `impl From<A> for B {}` | `a.into()` | Relação _óbvia_ e sempre válida. |
| `impl TryFrom<A> for B {}` | `a.try_into()?` | Relação _óbvia_, mas nem sempre válida. |
| `impl Deref for A {}` | `*a` | `A` é um ponteiro inteligente que contém `B`; também habilita coerções. |
| `impl AsRef<B> for A {}` | `a.as_ref()` | `A` pode ser _visto_ como `B`. |
| `impl AsMut<B> for A {}` | `a.as_mut()` | `A` pode ser visto como `B` com acesso mutável. |
| `impl Borrow<B> for A {}` | `a.borrow()` | `A` tem um equivalente emprestado `B`, com o mesmo comportamento para `Eq` e operações relacionadas. |
| `impl ToOwned for A { … }` | `a.to_owned()` | `A` tem um equivalente com posse dos dados, `B`. |


<!--
<footnotes>

<sup>1</sup> Pretty much any function, like `is_signed(x)`, puts values of two types in a _specific_ relationship, especially if their _meaning_ is highly _overloaded_ (e.g., `true` in the `is_signed` relation is proxy for a different concept than `true` in an `is_odd` one). In contrast, the traits above (and type conversions in general) are mainly about unambiguous conversions across any possible meaning.

</footnotes>
 -->

</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-3" name="tab-variance">
<label for="tab-variance-3"><b>Casts</b></label>
<panel><div>

```
fn f(x: A) -> B {
    x as B
}
```

Convertem tipos **com a palavra-chave `as`** quando a conversão é relativamente óbvia, mas **pode causar problemas**. {{ nom(page="casts.html") }}


| A | B | Exemplo | Explicação |
|----|----| ----| -----------|
| `Pointer` | `Pointer` | `device_ptr as *const u8` | Se `*A` e `*B` forem `Sized`. |
| `Pointer` | `Integer` | `device_ptr as usize` |  |
| `Integer` | `Pointer` | `my_usize as *const Device` |  |
| `Number` | `Number` | `my_u8 as u16` | Comportamento frequentemente surpreendente. {{ above(target="/memory-layout/basic-types/#boolean-and-numeric-types") }} |
| `enum` sem campos | `Integer` | `E::A as u8` | |
| `bool` | `Integer` | `true as u8` |  |
| `char` | `Integer` | `'A' as u8` |  |
| `&[T; N]` | `*const T` | `my_ref as *const u8` |  |
| `fn(…)` | `Pointer` | `f as *const u8` | Se `Pointer` for `Sized`. |
| `fn(…)` | `Integer` | `f as usize` |  |

{{ tablesep() }}

<footnote>

Aqui, `Pointer`, `Integer` e `Number` são abreviações para:
- `Pointer`: qualquer `*const T` ou `*mut T`;
- `Integer`: qualquer tipo enumerável de `u8` a `i128`;
- `Number`: qualquer `Integer`, `f32` ou `f64`.

</footnote>

> **Opinião** {{ opinionated() }} — Casts, especialmente `Number - Number`, podem dar errado facilmente.
> Se a correção é importante, considere métodos mais explícitos.

</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-4" name="tab-variance">
<label for="tab-variance-4"><b>Coerções</b></label>
<panel><div>

```
fn f(x: A) -> B {
    x
}
```

**Enfraquecem** automaticamente o tipo `A` para `B`; os tipos podem ser _substancialmente_<sup>1</sup> diferentes. {{ nom(page="coercions.html") }}


| A | B | Explicação |
|----|----| -----------|
| `&mut T` | `&T` | **Enfraquecimento de ponteiro**. |
| `&mut T` | `*mut T` | - |
| `&T` | `*const T` | - |
| `*mut T` | `*const T` | - |
| `&T` | `&U` | **Deref**, se `impl Deref<Target=U> for T`. |
| `T` | `U` | **Remoção do tamanho estático**, se `impl CoerceUnsized<U> for T`.<sup>2</sup> {{ experimental() }} |
| `T` | `V` | **Transitividade**, se `T` pode ser convertido por coerção em `U` e `U` em `V`. |
| <code>&vert;x&vert; x + x</code> | `fn(u8) -> u8` | **Closure sem capturas**, convertida no ponteiro `fn` equivalente. |

{{ tablesep() }}

<footnote>

<sup>1</sup> _Substancialmente_ significa que o resultado `B` pode ser _um tipo completamente diferente_, com métodos diferentes dos do tipo original `A`.

<sup>2</sup> O exemplo acima não funciona exatamente assim, pois tipos sem tamanho estático não podem ficar diretamente na pilha; imagine `f(x: &A) -> &B`. A remoção do tamanho funciona por padrão para:
- `[T; n]` para `[T]`;
- `T` para `dyn Trait`, se `impl Trait for T {}`;
- `Foo<…, T, …>` para `Foo<…, U, …>`, sob condições específicas e pouco usuais de {{ link(url="https://doc.rust-lang.org/nomicon/coercions.html") }}.

</footnote>


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-5" name="tab-variance">
<label for="tab-variance-5"><b>Subtipagem</b>{{ esoteric() }}</label>
<panel><div>

```
fn f(x: A) -> B {
    x
}
```

Converte automaticamente `A` em `B` para tipos que **diferem apenas nos lifetimes**. {{ nom(page="subtyping.html") }} Exemplos de subtipagem:


| A<sup>(subtipo)</sup> | B<sup>(supertipo)</sup> | Explicação |
|--------| -----------| -----------|
| `&'static u8` | `&'a u8` | Válido: um ponteiro <i>permanente</i> também serve como ponteiro <i>temporário</i>. |
| `&'a u8` | `&'static u8` | {{ bad() }} Inválido: algo temporário não deve se tornar permanente. |
| `&'a &'b u8` | `&'a &'b u8` | Válido, pelo mesmo motivo. **Agora começa a parte interessante. Continue lendo.** |
| `&'a &'static u8` | `&'a &'b u8` | Válido: `&'static u8` também é `&'b u8`; **covariância** dentro de `&`. |
| `&'a mut &'static u8` | `&'a mut &'b u8` | {{ bad() }} Inválido e surpreendente: **invariância** dentro de `&mut`. |
| `Box<&'static u8>` | `Box<&'a u8>` | Válido: `Box` com lifetime permanente também serve com lifetime temporário; covariância. |
| `Box<&'a u8>` | `Box<&'static u8>` | {{ bad() }} Inválido: `Box` com lifetime temporário não pode se tornar permanente. |
| `Box<&'a mut u8>` | `Box<&'a u8>` | {{ bad() }} <sup>⚡</sup> Inválido; veja abaixo. `&mut u8` nunca _foi_ um `&u8`. |
| `Cell<&'static u8>` | `Cell<&'a u8>` | {{ bad() }} Inválido: `Cell` **nunca** são outra coisa; invariância. |
| `fn(&'static u8)` | `fn(&'a u8)` | {{ bad() }} Se `fn` exige algo permanente, pode falhar ao receber algo temporário; **contravariância**. |
| `fn(&'a u8)` | `fn(&'static u8)` | Mas algo que aceita temporários **pode ser** algo que aceita permanentes. |
| `for<'r> fn(&'r u8)` | `fn(&'a u8)` | O tipo de ordem superior `for<'r> fn(&'r u8)` também é `fn(&'a u8).`. |


{{ tablesep() }}

Em contraste, estes **não**{{ bad() }} são exemplos de subtipagem:

| A | B | Explicação |
|----|----| -----------|
| `u16` | `u8` | {{ bad() }} **Claramente inválido**: `u16` nunca deve se tornar `u8` automaticamente. |
| `u8` | `u16` | {{ bad() }} Inválido **por projeto**: tipos com dados diferentes não são subtipos, mesmo que pudessem ser. |
| `&'a mut u8` | `&'a u8` | {{ bad() }} Parece subtipagem, mas é coerção. Funciona, porém não é subtipagem. |

{{ tablesep() }}

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-variance-8" name="tab-variance">
<label for="tab-variance-8"><b>Variância</b>{{ esoteric() }}</label>
<panel><div>

```
fn f(x: A) -> B {
    x
}
```

Converte automaticamente `A` em `B` para tipos que **diferem apenas nos lifetimes**. {{ nom(page="subtyping.html") }} Regras de variância da subtipagem:

- Um lifetime `'a` que dura mais que o lifetime `'b` é um subtipo de `'b`.
- Portanto, `'static` é subtipo de todos os outros lifetimes `'a`.
- Para determinar se tipos parametrizados, como `&'a T`, são subtipos entre si, usa-se esta tabela:

| Construção<sup>1</sup> | `'a` | `T` | `U` |
|--------| -----------| -------| -------|
| `&'a T` | covariante | covariante | |
| `&'a mut T` | covariante | invariante | |
| `Box<T>` | | covariante | |
| `Cell<T>` | | invariante | |
| `fn(T) -> U` | | **contra**variante | covariante |
| `*const T` | | covariante | |
| `*mut T` | | invariante | |

<footnotes>

**Covariante** significa que, se `A` é subtipo de `B`, então `T[A]` é subtipo de `T[B]`. <br>
**Contravariante** significa que, se `A` é subtipo de `B`, então **`T[B]`** é subtipo de `T[A]`. <br>
**Invariante** significa que, mesmo se `A` for subtipo de `B`, nem `T[A]` nem `T[B]` será subtipo do outro.<br>
<!-- <br> -->

<sup>1</sup> Tipos compostos como `struct S<T> {}` obtêm sua variância dos campos usados e geralmente se tornam invariantes quando várias variâncias se misturam.<br>

</footnotes>

> 💡 **Em outras palavras**, tipos comuns nunca são subtipos entre si; `u8` não é subtipo de `u16`,
> e um `Box<u32>` nunca é subtipo nem supertipo de outro tipo.
> Porém, em geral, `Box<A>` pode ser subtipo de `Box<B>` por covariância se `A` for subtipo
> de `B`. Isso só ocorre se `A` e `B` forem essencialmente o mesmo tipo, diferindo nos lifetimes, como `A` igual a `&'static u32` e `B` igual a `&'a u32`.

</div></panel></tab>

</tabs>

</div>


{{ tablesep() }}
