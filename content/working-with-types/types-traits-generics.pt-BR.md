+++
title = "Tipos, traits e genéricos"
description = "Um guia visual de tipos, traits, genéricos, implementações, limites e despacho em Rust."
weight = 34
template = "topic.html"

[extra]
seo_title = "Tipos, traits e genéricos"
anchor = "types-traits-generics"
print = true
translation_of = "working-with-types/types-traits-generics.md"
source_hash = "da22516c7ff22eecbf8f5171b8f01d3c01eed49656136a460e7d4d12eee92749"
+++
Permita que usuários forneçam seus próprios tipos e evite duplicação de código.

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-types-1" name="tab-group-types" checked>
<label for="tab-types-1"><b>Tipos e traits</b></label>
<panel><div>


<!-- Section -->
<generics-section id="ttg-types">
<header>Tipos</header>
<description>

<mini-zoo class="zoo">
    <entry>
        <type class="primitive"><code>u8</code></type>
    </entry>
    <entry>
        <type class="composed"><code>String</code></type>
    </entry>
    <entry>
        <type class="composed"><code>Device</code></type>
    </entry>
</mini-zoo>

- Conjuntos de valores com semântica, organização de memória e outras propriedades definidas.

<mini-table>

| Tipo | Valores |
| --- | --- |
| `u8`  |  <code>{ 0<sub>u8</sub>, 1<sub>u8</sub>, …, 255<sub>u8</sub> }</code> |
| `char`  | `{ 'a', 'b', … '🦀' }` |
| `struct S(u8, char)`  | <code>{ (0<sub>u8</sub>, 'a'), … (255<sub>u8</sub>, '🦀') }</code> |

<subtitle>Exemplos de tipos e de seus valores.</subtitle>

</mini-table>

</description>
</generics-section>


<!-- Section -->
<generics-section id="ttg-equivalence">
<header>Equivalência e conversões de tipos</header>
<description>

<mini-zoo class="zoo">
    <entry>
        <type class="primitive"><code>u8</code></type>
    </entry>
    <entry>
        <type class="primitive"><code>&u8</code></type>
    </entry>
    <entry>
        <type class="primitive"><code>&mut u8</code></type>
    </entry>
    <entry>
        <type class="primitive"><code>[u8; 1]</code></type>
    </entry>
    <entry>
        <type class="composed"><code>String</code></type>
    </entry>
</mini-zoo>



<!-- - Question: which of the types above is different from all others?
    - Trick question: all of these types are totally different -->
- Pode parecer óbvio, mas `u8`, `&u8` e `&mut u8` são tipos completamente diferentes entre si.
- Qualquer `t: T` aceita apenas valores exatamente do tipo `T`. Por exemplo:
    - `f(0_u8)` não pode receber `f(&0_u8)`;
    - `f(&mut my_u8)` não pode receber `f(&my_u8)`;
    - `f(0_u8)` não pode receber `f(0_i8)`.

> Sim, `0 != 0` no sentido matemático quando se trata de tipos! Na linguagem, a operação <code>==(0<sub>u8</sub>, 0<sub>u16</sub>)</code> simplesmente não é definida, para evitar acidentes.

<mini-table>

| Tipo | Valores |
| --- | --- |
| `u8`  | <code>{ 0<sub>u8</sub>, 1<sub>u8</sub>, …, 255<sub>u8</sub> }</code> |
| `u16`  | <code>{ 0<sub>u16</sub>, 1<sub>u16</sub>, …, 65_535<sub>u16</sub> }</code> |
| `&u8`  | <code>{ 0xffaa<sub>&u8</sub>, 0xffbb<sub>&u8</sub>, … }</code> |
| `&mut u8`  | <code>{ 0xffaa<sub>&mut u8</sub>, 0xffbb<sub>&mut u8</sub>, … }</code> |

<subtitle>Como os valores diferem entre tipos.</subtitle>

</mini-table>



- Porém, Rust às vezes ajuda a **converter entre tipos**.<sup>1</sup>
    - **Casts** convertem valores manualmente: `0_i8 as u8`.
    - **Coerções** {{ above(target="/behind-the-scenes/language-sugar/#language-sugar") }} convertem tipos automaticamente quando isso é seguro:<sup>2</sup> `let x: &u8 = &mut 0_u8;`.




<footnotes>

<sup>1</sup> Casts e coerções convertem valores de um conjunto, como `u8`, para outro, como `u16`, podendo acrescentar instruções de CPU. Diferem, portanto, da **subtipagem**, que pressupõe que tipo e subtipo pertencem ao mesmo conjunto — por exemplo, `u8` como subtipo de `u16` e `0_u8` igual a `0_u16` — e exigiria apenas uma verificação na compilação. Rust não usa subtipagem para tipos comuns, e `0_u8` _difere_ de `0_u16`, mas a utiliza de certa forma para lifetimes. {{ link(url = "https://featherweightmusings.blogspot.com/2014/03/subtyping-and-coercion-in-rust.html") }}

<sup>2</sup> Segurança aqui não é apenas uma propriedade física, como a impossibilidade de converter <code>&u8</code> em <code>&u128</code> por coerção: também considera se a experiência mostra que a conversão levaria a erros de programação.

</footnotes>

</description>
</generics-section>



<!-- Section -->
<generics-section id="ttg-impl-s">
<header>Implementações — <code>impl S { }</code></header>
<description>

<mini-zoo class="zoo">
    <entry>
        <type class="primitive"><code>u8</code></type>
        <impl><code>impl { … }</code></impl>
    </entry>
    <entry>
        <type class="composed"><code>String</code></type>
        <impl><code>impl { … }</code></impl>
    </entry>
    <entry>
        <type class="composed"><code>Port</code></type>
        <impl><code>impl { … }</code></impl>
    </entry>
</mini-zoo>

```
impl Port {
    fn f() { … }
}
```

- Tipos geralmente têm **implementações inerentes**, {{ ref(page="items/implementations.html#inherent-implementations") }} como `impl Port {}`: comportamentos _relacionados_ ao tipo.
    - **Funções associadas**: `Port::new(80)`.
    - **Métodos**: `port.close()`.

> O que é considerado _relacionado_ é mais filosófico que técnico: nada, além do bom senso, impediria `u8::play_sound()`.


</description>
</generics-section>


<!-- Section -->
<generics-section id="ttg-traits">
<header>Traits — <code>trait T { }</code></header>
<description>

<mini-zoo class="zoo">
    <entry>
        <trait-impl>⌾ <code>Copy</code></trait-impl>
    </entry>
    <entry>
        <trait-impl>⌾ <code>Clone</code></trait-impl>
    </entry>
    <entry>
        <trait-impl>⌾ <code>Sized</code></trait-impl>
    </entry>
    <entry>
        <trait-impl>⌾ <code>ShowHex</code></trait-impl>
    </entry>
</mini-zoo>

- **Traits**…
    - são uma forma de abstrair comportamentos;
    - o autor declara semanticamente que _esta trait significa X_;
    - outros podem implementar esse comportamento para seus tipos.
- Pense em uma trait como uma lista de membros formada por tipos:


<mini-table>

<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th>Trait Copy</th></tr>
        <tr class="subheader"><th><code>Self</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>u8</code></td></tr>
        <tr><td><code>u16</code></td></tr>
        <tr><td><code>…</code></td></tr>
    </tbody>
</table>

</mini-table>

<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th>Trait Clone</th></tr>
        <tr class="subheader"><th><code>Self</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>u8</code></td></tr>
        <tr><td><code>String</code></td></tr>
        <tr><td><code>…</code></td></tr>
    </tbody>
</table>

</mini-table>

<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th>Trait Sized</th></tr>
        <tr class="subheader"><th><code>Self</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>char</code></td></tr>
        <tr><td><code>Port</code></td></tr>
        <tr><td><code>…</code></td></tr>
    </tbody>
</table>

</mini-table>

<subtitle>Traits como tabelas de membros; <code>Self</code> se refere ao tipo incluído.</subtitle>

</mini-table>


- **Todo tipo que faz parte da lista deve respeitar seu comportamento.**
- Traits também podem incluir métodos, funções associadas e outros itens.

```
trait ShowHex {
    // Must be implemented according to documentation.
    fn as_hex() -> String;

    // Provided by trait author.
    fn print_hex() {}
}
```

<mini-zoo class="zoo">
    <entry>
        <trait-impl>⌾ <code>Copy</code></trait-impl>
    </entry>
</mini-zoo>

```
trait Copy { }
```

- Traits sem métodos costumam ser chamadas de **traits marcadoras**.
- `Copy` é um exemplo: significa que _a memória pode ser copiada bit a bit_.

<mini-zoo class="zoo">
    <entry>
        <trait-impl>⌾ <code>Sized</code></trait-impl>
    </entry>
</mini-zoo>


- Algumas traits estão totalmente fora do controle explícito do usuário.
- `Sized` é fornecida pelo compilador para tipos de _tamanho conhecido_; o tipo tem essa propriedade ou não.


</description>
</generics-section>


<!-- Section -->
<generics-section>
<header>Implementação de traits para tipos — <code>impl T for S { }</code></header>
<description>


```
impl ShowHex for Port { … }
```
- Traits são implementadas para tipos em algum momento.
- Uma implementação `impl A for B` adiciona o tipo `B` à lista de membros da trait:

<mini-table>

<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr><th>Trait ShowHex</th></tr>
        <tr class="subheader"><th><code>Self</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>Port</code></td></tr>
    </tbody>
</table>

</mini-table>
</mini-table>

- Visualmente, pense no tipo recebendo um distintivo que indica sua participação.

<mini-zoo class="zoo">
    <entry>
        <type class="primitive"><code>u8</code></type>
        <impl><code>impl { … }</code></impl>
        <trait-impl>⌾ <code>Sized</code></trait-impl>
        <trait-impl>⌾ <code>Clone</code></trait-impl>
        <trait-impl>⌾ <code>Copy</code></trait-impl>
    </entry>
    <entry>
        <type class="composed"><code>Device</code></type>
        <impl><code>impl { … }</code></impl>
        <trait-impl>⌾ <code>Transport</code></trait-impl>
    </entry>
    <entry>
        <type class="composed"><code>Port</code></type>
        <impl><code>impl { … }</code></impl>
        <trait-impl>⌾ <code>Sized</code></trait-impl>
        <trait-impl>⌾ <code>Clone</code></trait-impl>
        <trait-impl>⌾ <code>ShowHex</code></trait-impl>
    </entry>
</mini-zoo>

</description>
</generics-section>




<!-- Section -->
<generics-section>
<header>Traits e interfaces</header>
<description>


<mini-zoo class="zoo">
    <person>👩‍🦰</person>
    <entry>
        <trait-impl>⌾ <code>Eat</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>🧔</person>
    <entry>
        <type class="composed"><code>Venison</code></type>
        <trait-impl>⌾ <code>Eat</code></trait-impl>
    </entry>
</mini-zoo>


<mini-zoo class="zoo" style="margin-left: 10px; width: 130px;">
    <person></person>
    <entry>
        <code style="text-align:center; width: 100%;"></code>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>🎅</person>
    <entry>
        <code>venison.eat()</code>
    </entry>
</mini-zoo>

{{ tablesep() }}

**Interfaces**

- Em **Java**, Alice cria a interface `Eat`.
- Ao criar `Venison`, Bob precisa decidir se `Venison` implementa `Eat`.
- Toda participação em interfaces precisa, portanto, ser declarada na definição do tipo.
- Ao usar `Venison`, Santa pode aproveitar o comportamento fornecido por `Eat`:

```
// Santa imports `Venison` to create it, can `eat()` if he wants.
import food.Venison;

new Venison("rudolph").eat();
```


{{ tablesep() }}
{{ tablesep() }}


<mini-zoo class="zoo">
    <person>👩‍🦰</person>
    <entry>
        <trait-impl>⌾ <code>Eat</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>🧔</person>
    <entry>
        <type class="composed"><code>Venison</code></type>
    </entry>
</mini-zoo>


<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>👩‍🦰</person> / <person>🧔</person>
    <entry>
        <type class="composed"><code>Venison</code></type>
        <code style="text-align:center; width: 100%;">+</code>
        <trait-impl>⌾ <code>Eat</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>🎅</person>
    <entry>
        <code>venison.eat()</code>
    </entry>
</mini-zoo>

{{ tablesep() }}

**Traits**

- Em **Rust**, Alice cria a trait `Eat`.
- Bob cria o tipo `Venison` e decide não implementar `Eat`; talvez nem conheça `Eat`.
- Mais tarde, alguém<sup>*</sup> decide que adicionar `Eat` a `Venison` seria uma boa ideia.
- Ao usar `Venison`, Santa precisa importar `Eat` separadamente:

```
// Santa needs to import `Venison` to create it, and import `Eat` for trait method.
use food::Venison;
use tasks::Eat;

// Ho ho ho
Venison::new("rudolph").eat();
```

<footnotes>

<sup>*</sup> Para impedir que duas pessoas implementem `Eat` de formas diferentes, Rust restringe essa escolha a Alice ou Bob. Um `impl Eat for Venison` só pode estar na crate de `Venison` ou na de `Eat`. Veja as regras de coerência. {{todo()}}

</footnotes>


</description>
</generics-section>


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-types-2" name="tab-group-types">
<label for="tab-types-2"><b>Genéricos</b></label>
<panel><div>


<!-- Section -->
<generics-section>
<header>Construtores de tipos — <code>Vec&lt;&gt;</code></header>
<description>

<mini-zoo class="zoo">
    <entry>
        <type class="composed"><code>Vec&lt;u8&gt;</code></type>
    </entry>
    <entry>
        <type class="composed"><code>Vec&lt;char&gt;</code></type>
    </entry>
</mini-zoo>

- `Vec<u8>` é o tipo “vetor de bytes”; `Vec<char>` é o tipo “vetor de caracteres”. Mas o que é `Vec<>`?

<mini-table>

| Construção | Valores |
| --- | --- |
| `Vec<u8>`  |  `{ [], [1], [1, 2, 3], … }` |
| `Vec<char>`  |  `{ [], ['a'], ['x', 'y', 'z'], … }` |
| `Vec<>`  |  - |

<subtitle>Tipos e construtores de tipos.</subtitle>

</mini-table>



<mini-zoo class="zoo">
    <entry>
        <type class="generic dotted"><code>Vec&lt;&gt;</code></type>
    </entry>
</mini-zoo>

- `Vec<>` não é um tipo: não ocupa memória e nem pode ser traduzido em código.
- `Vec<>` é um **construtor de tipos**, um molde ou receita para criar tipos.
    - Permite que terceiros<sup> </sup> construam um tipo concreto usando um parâmetro.
    - Só então esse `Vec<UserType>` se torna um tipo propriamente dito.

</description>
</generics-section>


<!-- Section -->
<generics-section>
<header>Parâmetros genéricos — <code>&lt;T&gt;</code></header>
<description>

<mini-zoo class="zoo">
    <entry>
        <type class="generic dotted"><code>Vec&lt;T&gt;</code></type>
    </entry>
    <entry>
        <type class="generic dotted"><code>[T; 128]</code></type>
    </entry>
    <entry>
        <type class="generic dotted"><code>&T</code></type>
    </entry>
    <entry>
        <type class="generic dotted"><code>&mut T</code></type>
    </entry>
    <entry>
        <type class="generic dotted"><code>S&lt;T&gt;</code></type>
    </entry>
</mini-zoo>

- O parâmetro de `Vec<>` costuma se chamar `T`; daí `Vec<T>`.
- `T` é um “nome de variável para um tipo”, no qual o usuário coloca algo específico, como `Vec<f32>` ou `S<u8>`.


<mini-table>

| Construtor de tipos | Família produzida |
| --- | --- |
| `struct Vec<T> {}`  |  `Vec<u8>`, `Vec<f32>`, `Vec<Vec<u8>>`, … |
| `[T; 128]`  |  `[u8; 128]`, `[char; 128]`, `[Port; 128]` … |
| `&T`  |  `&u8`, `&u16`, `&str`,  … |

<subtitle>Tipos e construtores de tipos.</subtitle>

</mini-table>


```
// S<> is type constructor with parameter T; user can supply any concrete type for T.
struct S<T> {
    x: T
}

// Within 'concrete' code an existing type must be given for T.
fn f() {
    let x: S<f32> = S::new(0_f32);
}

```

</description>
</generics-section>


<!-- Section -->
<generics-section >
<header>Genéricos constantes — <code>[T; N]</code> e <code>S&lt;const N: usize&gt;</code></header>
<description>

<mini-zoo class="zoo">
    <entry>
        <type class="generic dotted"><code>[T; n]</code></type>
    </entry>
    <entry>
        <type class="generic dotted"><code>S&lt;const N&gt;</code></type>
    </entry>
</mini-zoo>

- Alguns construtores aceitam não só um tipo específico, mas também uma **constante específica**.
- `[T; n]` constrói um tipo de array com o tipo `T` repetido `n` vezes.
- Para tipos personalizados, a declaração é `MyArray<T, const N: usize>`.

<mini-table>

| Construtor de tipos | Família produzida |
| --- | --- |
| `[u8; N]`  |  `[u8; 0]`, `[u8; 1]`, `[u8; 2]`, … |
| `struct S<const N: usize> {}`  |  `S<1>`, `S<6>`, `S<123>`,  … |

<subtitle>Construtores de tipos baseados em constantes.</subtitle>

</mini-table>


```
let x: [u8; 4]; // "array of 4 bytes"
let y: [f32; 16]; // "array of 16 floats"

// `MyArray` is type constructor requiring concrete type `T` and
// concrete usize `N` to construct specific type.
struct MyArray<T, const N: usize> {
    data: [T; N],
}
```

</description>
</generics-section>


<!-- Section -->
<!-- <generics-section >
<header>Generics in Types</header>
<description>

</description>
</generics-section> -->




<!-- Section -->
<generics-section >
<header>Limites simples — <code>where T: X</code></header>
<description>

<mini-zoo class="zoo">
    <person>🧔</person>
    <entry>
        <type class="generic dotted"><code>Num&lt;T&gt;</code></type>
    </entry>
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
    <person>🎅</person>
    <entry>
        <type class="composed"><code>Num&lt;u8&gt;</code></type>
    </entry>
    <entry>
        <type class="composed"><code>Num&lt;f32&gt;</code></type>
    </entry>
    <entry>
        <type class="composed"><code>Num&lt;Cmplx&gt;</code></type>
    </entry>
    <narrow-entry>
        <code style="text-align:center; width: 50px;">&nbsp;</code>
    </narrow-entry>
    <entry class="">
        <type class="primitive"><code>u8</code></type>
        <trait-impl>⌾ <code>Absolute</code></trait-impl>
        <trait-impl>⌾ <code>Dim</code></trait-impl>
        <trait-impl>⌾ <code>Mul</code></trait-impl>
    </entry>
    <entry class="grayed">
        <type class="composed"><code>Port</code></type>
        <trait-impl>⌾ <code>Clone</code></trait-impl>
        <trait-impl>⌾ <code>ShowHex</code></trait-impl>
    </entry>
</mini-zoo>

- Se `T` pode ser qualquer tipo, como podemos raciocinar e escrever código para esse `Num<T>`?
- **Limites** de parâmetros:
    - restringem os tipos, por **limites de traits**, ou os valores, por **limites de constantes** {{ todo() }};
    - permitem que o código aproveite essas restrições.
- Limites de traits funcionam como verificações de participação:

<mini-table>

<div style="display: inline-block;">

```
// Type can only be constructed for some `T` if that
// T is part of `Absolute` membership list.
struct Num<T> where T: Absolute {
    …
}

```

</div>


<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th>Trait Absolute</th></tr>
        <tr class="subheader"><th><code>Self</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>u8</code></td></tr>
        <tr><td><code>u16</code></td></tr>
        <tr><td><code>…</code></td></tr>
    </tbody>
</table>

</mini-table>
</mini-table>


<!--
// Constant `N` must be `usize`
struct Arrayf32<const N: usize> {
    data: [f32; N],
} -->

<footnotes>

Aqui, adicionamos limites à struct. Na prática, é melhor adicioná-los aos blocos impl correspondentes, como veremos adiante.

</footnotes>

<!-- > Note to self, is `const N: usize` a "const bound"? It seemingly acts as one, limiting the choice of values for N (albeit to specific types only). -->

</description>
</generics-section>


<!-- Section -->
<generics-section>
<header>Limites compostos — <code>where T: X + Y</code></header>
<description>

<mini-zoo class="zoo">
    <entry class="grayed">
        <type class="primitive"><code>u8</code></type>
        <trait-impl>⌾ <code>Absolute</code></trait-impl>
        <trait-impl>⌾ <code>Dim</code></trait-impl>
        <trait-impl>⌾ <code>Mul</code></trait-impl>
    </entry>
    <entry class="grayed">
        <type class="primitive"><code>f32</code></type>
        <trait-impl>⌾ <code>Absolute</code></trait-impl>
        <trait-impl>⌾ <code>Mul</code></trait-impl>
    </entry>
    <entry class="grayed">
        <type class="primitive"><code>char</code></type>
    </entry>
    <entry>
        <type class="composed"><code>Cmplx</code></type>
        <trait-impl>⌾ <code>Absolute</code></trait-impl>
        <trait-impl>⌾ <code>Dim</code></trait-impl>
        <trait-impl>⌾ <code>Mul</code></trait-impl>
        <trait-impl>⌾ <code>DirName</code></trait-impl>
        <trait-impl>⌾ <code>TwoD</code></trait-impl>
    </entry>
    <entry class="grayed">
        <type class="composed"><code>Car</code></type>
        <trait-impl>⌾ <code>DirName</code></trait-impl>
    </entry>
</mini-zoo>



```
struct S<T>
where
    T: Absolute + Dim + Mul + DirName + TwoD
{ … }
```

- Limites longos de traits podem parecer intimidantes.
- Na prática, cada `+ X` acrescentado apenas reduz o conjunto de tipos elegíveis.

</description>
</generics-section>



<!-- Section -->
<generics-section>
<header>Implementação de famílias — <code>impl&lt;&gt;</code></header>
<description>

{{ tablesep() }}

Quando escrevemos:
```
impl<T> S<T> where T: Absolute + Dim + Mul {
    fn f(&self, x: T) { … };
}
```
Podemos ler assim:
- há uma receita de implementação para qualquer tipo `T`, representada pela parte `impl <T>`;
- esse tipo deve<!--sup>*</sup--> ser membro das traits `Absolute + Dim + Mul`;
- pode-se acrescentar um bloco de implementação à família de tipos `S<>`;
- contendo os métodos…

Pense nesse código `impl<T> … {} ` como uma **implementação abstrata de uma família de comportamentos**. {{ ref(page="items/implementations.html#generic-implementations") }} Ele permite que terceiros<sup> </sup> materializem implementações, assim como construtores materializam tipos.

```
// If compiler encounters this, it will
// - check `0` and `x` fulfill the membership requirements of `T`
// - create two new version of `f`, one for `char`, another one for `u32`.
// - based on "family implementation" provided
s.f(0_u32);
s.f('x');
```


</description>
</generics-section>


<!-- Section -->
<generics-section>
<header>Implementações abrangentes — <code>impl&lt;T&gt X for T { … }</code></header>
<description>

{{ tablesep() }}

Também é possível escrever implementações de famílias que apliquem uma trait a muitos tipos:

```
// Also implements Serialize for any type if that type already implements ToHex
impl<T> Serialize for T where T: ToHex { … }
```

Elas são chamadas de **implementações abrangentes**, ou blanket implementations.

<mini-table>

<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th>ToHex</th></tr>
        <tr class="subheader"><th><code>Self</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>Port</code></td></tr>
        <tr><td><code>Device</code></td></tr>
        <tr><td><code>…</code></td></tr>
    </tbody>
</table>

</mini-table>

<div style="display: inline-block; width: 100px;">

→ Qualquer tipo da tabela esquerda pode ser adicionado à direita conforme esta receita (`impl`). →

</div>

<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th>Trait Serialize</th></tr>
        <tr class="subheader"><th><code>Self</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>u8</code></td></tr>
        <tr><td><code>Port</code></td></tr>
        <tr><td><code>…</code></td></tr>
    </tbody>
</table>

</mini-table>

</mini-table>


É uma forma modular de oferecer funcionalidades a tipos externos, desde que implementem outra interface.

</description>
</generics-section>


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-types-3" name="tab-group-types">
<label for="tab-types-3"><b>Conceitos avançados</b>{{ esoteric() }}</label>
<panel><div>


<!-- Section -->
<!-- <generics-section >
<header>Pseudo-Specialization</header>
<description>

</description>
</generics-section> -->




<!-- Section -->
<generics-section>
<header>Parâmetros de traits — <code>Trait&lt;In&gt; { type Out; } </code></header>
<description>

{{ tablesep() }}

Percebeu que algumas traits podem ser associadas várias vezes, enquanto outras apenas uma?

<mini-zoo class="zoo">
    <entry style="left:300px; top: 25px;">
        <type class="composed"><code>Port</code></type>
        <trait-impl class="">⌾ <code>From&lt;u8&gt;</code></trait-impl>
        <trait-impl class="">⌾ <code>From&lt;u16&gt;</code></trait-impl>
    </entry>
    <entry style="left:400px; top: 25px;">
        <type class="composed"><code>Port</code></type>
        <trait-impl class="">⌾ <code>Deref</code></trait-impl>
        <associated-type class="grayed"><code>type u8;</code></associated-type>
    </entry>
</mini-zoo>

<!--
<mini-zoo class="zoo">
    <entry>
        <trait-impl class="">⌾ <code>A&lt;T&gt;</code></trait-impl>
    </entry>
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
    <entry>
        <trait-impl class="">⌾ <code>A&lt;u8&gt;</code></trait-impl>
    </entry>
    <entry>
        <trait-impl class="">⌾ <code>A&lt;f32&gt;</code></trait-impl>
    </entry>
    <entry>
        <trait-impl class="">⌾ <code>A&lt;str&gt;</code></trait-impl>
    </entry>
</mini-zoo>

<br>

<mini-zoo class="zoo">
    <entry>
        <trait-impl class="">⌾ <code>B</code></trait-impl>
        <associated-type class=""><code>type T;</code></associated-type>
    </entry>
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
    <entry>
        <trait-impl class="">⌾ <code>B</code></trait-impl>
        <associated-type class=""><code>T = u8;</code></associated-type>
    </entry>
</mini-zoo> -->

<br>

{{ tablesep() }}

Por quê?

- As próprias traits podem ser genéricas sobre dois **tipos de parâmetros**.
    - `trait From<I> {}`
    - `trait Deref { type O; }`
- Lembra que traits são listas de membros e que chamamos o tipo listado de `Self`?
- Os parâmetros `I` de **entrada** e `O` de **saída** são outras _colunas_ nessa lista:

```
impl From<u8> for u16 {}
impl From<u16> for u32 {}
impl Deref for Port { type O = u8; }
impl Deref for String { type O = str; }
```


<mini-table>

<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th colspan="2">From</th></tr>
        <tr class="subheader"><th><code>Self</code></th><th><code>I</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>u16</code></td><td><code>u8</code></td></tr>
        <tr><td><code>u32</code></td><td><code>u16</code></td></tr>
        <tr><td colspan="2"><code>…</code></td></tr>
    </tbody>
</table>

</mini-table>


<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th colspan="2">Deref</th></tr>
        <tr class="subheader"><th><code>Self</code></th><th><code>O</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>Port</code></td><td><code>u8</code></td></tr>
        <tr><td><code>String</code></td><td><code>str</code></td></tr>
        <tr><td colspan="2"><code>…</code></td></tr>
    </tbody>
</table>

</mini-table>

<subtitle>Parâmetros de entrada e saída.</subtitle>

</mini-table>


A diferença essencial é:
- **Os parâmetros de saída `O` devem ser determinados de forma única pelos parâmetros de entrada `I`**.
- É o mesmo princípio pelo qual uma relação `X Y` representa uma função.
- `Self` conta como entrada.

Um exemplo mais complexo:

```
trait Complex<I1, I2> {
    type O1;
    type O2;
}
```

- cria uma relação entre tipos chamada `Complex`;
- com três entradas, sendo `Self` sempre uma delas, e duas saídas; vale a relação `(Self, I1, I2) => (O1, O2)`.

<mini-table>

<table>
    <thead>
        <tr style=""><th colspan="5">Complex</th></tr>
        <tr class="subheader"><th><code>Self [I]</code></th><th><code>I1</code></th><th><code>I2</code></th><th><code>O1</code></th><th><code>O2</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>Player</code></td><td><code>u8</code></td><td><code>char</code></td><td><code>f32</code></td><td><code>f32</code></td></tr>
        <tr><td><code>EvilMonster</code></td><td><code>u16</code></td><td><code>str</code></td><td><code>u8</code></td><td><code>u8</code></td></tr>
        <tr><td><code>EvilMonster</code></td><td><code>u16</code></td><td><code>String</code></td><td><code>u8</code></td><td><code>u8</code></td></tr>
        <tr><td><code>NiceMonster</code></td><td><code>u16</code></td><td><code>String</code></td><td><code>u8</code></td><td><code>u8</code></td></tr>
        <tr><td><code>NiceMonster</code><sup>{{ bad() }}</sup></td><td><code>u16</code></td><td><code>String</code></td><td><code>u8</code></td><td><code>u16</code></td></tr>
    </tbody>
</table>

<subtitle>Várias implementações de uma trait. A última é inválida porque `(NiceMonster, u16, String)` já determinou <br> as saídas de forma única.</subtitle>

</mini-table>

</description>
</generics-section>



<!-- Section -->
<generics-section>
<header>Considerações ao criar traits: abstração</header>
<description>

<mini-zoo class="zoo">
    <person>👩‍🦰</person>
    <entry>
        <trait-impl class="dotted">⌾ <code>A&lt;I&gt;</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>🧔</person>
    <entry>
        <type class="composed"><code>Car</code></type>
    </entry>
</mini-zoo>


<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>👩‍🦰</person> / <person>🧔</person>
    <entry>
        <type class="composed"><code>Car</code></type>
        <trait-impl class="dotted">⌾ <code>A&lt;I&gt;</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>🎅</person>
    <entry>
        <code>car.a(0_u8)</code>
        <code>car.a(0_f32)</code>
    </entry>
</mini-zoo>

<br>

<mini-zoo class="zoo">
    <person>👩‍🦰</person>
    <entry>
        <trait-impl class="">⌾ <code>B</code></trait-impl>
        <associated-type class=""><code>type O;</code></associated-type>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>🧔</person>
    <entry>
        <type class="composed"><code>Car</code></type>
    </entry>
</mini-zoo>


<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>👩‍🦰</person> / <person>🧔</person>
    <entry>
        <type class="composed"><code>Car</code></type>
        <trait-impl class="">⌾ <code>B</code></trait-impl>
        <associated-type class=""><code>T = u8;</code></associated-type>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-left: 10px;">
    <person>🎅</person>
    <entry>
        <code>car.b(0_u8)</code>
        <code style="text-decoration: line-through;">car.b(0_f32)</code>
    </entry>
</mini-zoo>

- A escolha entre entradas e saídas também determina quem pode adicionar membros:
    - parâmetros `I` permitem transferir famílias de implementações ao usuário, Santa;
    - parâmetros `O` devem ser determinados por quem implementa a trait, Alice ou Bob.

```
trait A<I> { }
trait B { type O; }

// Implementor adds (X, u32) to A.
impl A<u32> for X { }

// Implementor adds family impl. (X, …) to A, user can materialze.
impl<T> A<T> for Y { }

// Implementor must decide specific entry (X, O) added to B.
impl B for X { type O = u32; }
```



<mini-table>

<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th colspan="2">A</th></tr>
        <tr class="subheader"><th><code>Self</code></th><th><code>I</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>X</code></td><td><code>u32</code></td></tr>
        <tr><td><code>Y</code></td><td><code>…</code></td></tr>
    </tbody>
</table>

<subtitle>Santa pode adicionar membros fornecendo seu próprio tipo para <code>T</code>.</subtitle>

</mini-table>


<mini-table style="width: 200px; display:inline-block;">

<table>
    <thead>
        <tr style=""><th colspan="2">B</th></tr>
        <tr class="subheader"><th><code>Self</code></th><th><code>O</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>Player</code></td><td><code>String</code></td></tr>
        <tr><td><code>X</code></td><td><code>u32</code></td></tr>
    </tbody>
</table>

<subtitle>Para um conjunto de entradas, aqui <code>Self</code>, quem implementa precisa escolher <code>O</code> previamente.</subtitle>

</mini-table>

</mini-table>


</description>
</generics-section>


<!-- Section -->
<generics-section id="trait-authoring-examples">
<header>Considerações ao criar traits: exemplos</header>
<description>

<mini-zoo class="zoo">
    <entry>
        <trait-impl class="">⌾ <code>Query</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <narrow-entry>
        <code style="text-align:center; width: 100%;">vs.</code>
    </narrow-entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry>
        <trait-impl class="dotted">⌾ <code>Query&lt;I&gt;</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <narrow-entry>
        <code style="text-align:center; width: 100%;">vs.</code>
    </narrow-entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry>
        <trait-impl class="">⌾ <code>Query</code></trait-impl>
        <associated-type class=""><code>type O;</code></associated-type>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <narrow-entry>
        <code style="text-align:center; width: 100%;">vs.</code>
    </narrow-entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry>
        <trait-impl class="dotted">⌾ <code>Query&lt;I&gt;</code></trait-impl>
        <associated-type class=""><code>type O;</code></associated-type>
    </entry>
</mini-zoo>



{{ tablesep() }}

A escolha dos parâmetros acompanha o propósito da trait.

<hr>


**Sem parâmetros adicionais**

```
trait Query {
    fn search(&self, needle: &str);
}

impl Query for PostgreSQL { … }
impl Query for Sled { … }

postgres.search("SELECT …");
```

<mini-zoo class="zoo">
    <person>👩‍🦰</person>
    <entry>
        <trait-impl class="">⌾ <code>Query</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
</mini-zoo>

<mini-zoo class="zoo">
    <person>🧔</person>
    <entry>
        <type class="composed"><code>PostgreSQL</code></type>
        <trait-impl class="">⌾ <code>Query</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry>
        <type class="composed"><code>Sled</code></type>
        <trait-impl class="">⌾ <code>Query</code></trait-impl>
    </entry>
</mini-zoo>

{{ tablesep() }}

O autor da trait pressupõe que:
- nem quem implementa nem quem usa precisa personalizar a API.

{{ tablesep() }}

<hr>

**Parâmetros de entrada**

```
trait Query<I> {
    fn search(&self, needle: I);
}

impl Query<&str> for PostgreSQL { … }
impl Query<String> for PostgreSQL { … }
impl<T> Query<T> for Sled where T: ToU8Slice { … }

postgres.search("SELECT …");
postgres.search(input.to_string());
sled.search(file);
```

<mini-zoo class="zoo">
    <person>👩‍🦰</person>
    <entry>
        <trait-impl class="dotted">⌾ <code>Query&lt;I&gt;</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
</mini-zoo>

<mini-zoo class="zoo">
    <person>🧔</person>
    <entry>
        <type class="composed"><code>PostgreSQL</code></type>
        <trait-impl class="">⌾ <code>Query&lt;&str&gt;</code></trait-impl>
        <trait-impl class="">⌾ <code>Query&lt;String&gt;</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry>
        <type class="composed"><code>Sled</code></type>
        <trait-impl class="dotted">⌾ <code>Query&lt;T&gt;</code></trait-impl>
        <note><span style="margin-left: 10px; display: inline-block; transform: rotate(90deg); font-size: 100%">↲</span> em que <code>T</code> é <code>ToU8Slice</code>.</note>
    </entry>
</mini-zoo>


{{ tablesep() }}

O autor da trait pressupõe que:
- quem implementa pode personalizar a API de várias formas para o mesmo tipo `Self`;
- usuários podem querer decidir para quais tipos `I` o comportamento estará disponível.

{{ tablesep() }}


<hr>


**Parâmetros de saída**

```
trait Query {
    type O;
    fn search(&self, needle: Self::O);
}

impl Query for PostgreSQL { type O = String; …}
impl Query for Sled { type O = Vec<u8>; … }

postgres.search("SELECT …".to_string());
sled.search(vec![0, 1, 2, 4]);
```

<mini-zoo class="zoo">
    <person>👩‍🦰</person>
    <entry>
        <trait-impl class="">⌾ <code>Query</code></trait-impl>
        <associated-type class=""><code>type O;</code></associated-type>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
</mini-zoo>

<mini-zoo class="zoo">
    <person>🧔</person>
    <entry>
        <type class="composed"><code>PostgreSQL</code></type>
        <trait-impl class="">⌾ <code>Query</code></trait-impl>
        <associated-type class=""><code>O = String;</code></associated-type>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry>
        <type class="composed"><code>Sled</code></type>
        <trait-impl class="">⌾ <code>Query</code></trait-impl>
        <associated-type class=""><code>O = Vec&lt;u8&gt;;</code></associated-type>
    </entry>
</mini-zoo>


{{ tablesep() }}

O autor da trait pressupõe que:
- quem implementa personaliza a API para o tipo `Self`, mas de uma única forma;
- usuários não precisam, ou não devem poder, influenciar a personalização de um `Self` específico.

> Portanto, **entrada** e **saída** _não_ se referem necessariamente a `I` ou `O` serem entradas ou saídas de uma função!

{{ tablesep() }}

<hr>

**Vários parâmetros de entrada e saída**

```
trait Query<I> {
    type O;
    fn search(&self, needle: I) -> Self::O;
}

impl Query<&str> for PostgreSQL { type O = String; … }
impl Query<CString> for PostgreSQL { type O = CString; … }
impl<T> Query<T> for Sled where T: ToU8Slice { type O = Vec<u8>; … }

postgres.search("SELECT …").to_uppercase();
sled.search(&[1, 2, 3, 4]).pop();
```

<mini-zoo class="zoo">
    <person>👩‍🦰</person>
    <entry>
        <trait-impl class="dotted">⌾ <code>Query&lt;I&gt;</code></trait-impl>
        <associated-type class=""><code>type O;</code></associated-type>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
</mini-zoo>

<mini-zoo class="zoo">
    <person>🧔</person>
    <entry>
        <type class="composed"><code>PostgreSQL</code></type>
        <trait-impl class="">⌾ <code>Query&lt;&str&gt;</code></trait-impl>
        <associated-type class=""><code>O = String;</code></associated-type>
        <trait-impl class="">⌾ <code>Query&lt;CString&gt;</code></trait-impl>
        <associated-type class=""><code>O = CString;</code></associated-type>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry>
        <type class="composed"><code>Sled</code></type>
        <trait-impl class="dotted">⌾ <code>Query&lt;T&gt;</code></trait-impl>
        <associated-type class=""><code>O = Vec&lt;u8&gt;;</code></associated-type>
        <note><span style="margin-left: 10px; display: inline-block; transform: rotate(90deg); font-size: 100%">↲</span> em que <code>T</code> é <code>ToU8Slice</code>.</note>
    </entry>
</mini-zoo>


{{ tablesep() }}

Como nos exemplos anteriores, o autor pressupõe que:
- usuários podem querer decidir para quais tipos `I` o comportamento estará disponível;
- para determinadas entradas, quem implementa deve determinar o tipo de saída.


</description>
</generics-section>



<!-- Section -->
<generics-section>
<header>Tipos de tamanho dinâmico ou zero</header>
<description>

<mini-zoo class="zoo" style="">
    <entry>
        <type class="composed"><code>MostTypes</code></type>
        <trait-impl>⌾ <code>Sized</code></trait-impl>
        <note>Tipos comuns.</note>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <narrow-entry style="width: 60px;">
        <code style="text-align:center; width: 100%;">vs.</code>
    </narrow-entry>
</mini-zoo>

<mini-zoo class="zoo" style="">
    <entry>
        <type class="zero"><code>Z</code></type>
        <trait-impl>⌾ <code>Sized</code></trait-impl>
        <note>Tamanho zero.</note>
    </entry>
</mini-zoo>


<mini-zoo class="zoo">
    <narrow-entry style="width: 60px;">
        <code style="text-align:center; width: 100%;">vs.</code>
    </narrow-entry>
</mini-zoo>

<mini-zoo class="zoo" style="">
    <entry>
        <type class="primitive"><code>str</code></type>
        <trait-impl class="grayed">⌾ <code style="text-decoration: line-through">Sized</code></trait-impl>
        <note>Tamanho dinâmico.</note>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="">
    <entry>
        <type class="primitive"><code>[u8]</code></type>
        <trait-impl class="grayed">⌾ <code style="text-decoration: line-through">Sized</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="">
    <entry>
        <type class="primitive"><code>dyn Trait</code></type>
        <trait-impl class="grayed">⌾ <code style="text-decoration: line-through">Sized</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="">
    <entry>
        <type class="primitive"><code>…</code></type>
        <trait-impl class="grayed">⌾ <code style="text-decoration: line-through">Sized</code></trait-impl>
    </entry>
</mini-zoo>


- Um tipo `T` é **`Sized`** {{ std(page="std/marker/trait.Sized.html") }} se seu tamanho em bytes é conhecido durante a compilação. `u8` e `&[u8]` têm essa propriedade; `[u8]` não.
- Ser `Sized` significa que `impl Sized for T {}` vale. Isso ocorre automaticamente e não pode ser implementado pelo usuário.
- Tipos que não são `Sized` são **tipos de tamanho dinâmico** {{ book(page="ch19-04-advanced-types.html#dynamically-sized-types-and-the-sized-trait") }} {{ nom(page="exotic-sizes.html#dynamically-sized-types-dsts") }} {{ ref(page="dynamically-sized-types.html#dynamically-sized-types") }} (DSTs), também chamados de unsized.
- Tipos sem dados são **tipos de tamanho zero** {{ nom(page="exotic-sizes.html#zero-sized-types-zsts") }} (ZSTs) e não ocupam espaço.

<div class="color-header sized cheats">

| Exemplo | Explicação |
|---------|-------------|
| `struct A { x: u8 }` | O tipo `A` tem tamanho conhecido: `impl Sized for A` vale. É um tipo comum. |
| `struct B { x: [u8] }` | Como `[u8]` é um DST, `B` também se torna um DST e não implementa `impl Sized`. |
| `struct C<T> { x: T }` | Parâmetros de tipo **têm** um limite `T: Sized` implícito; `C<A>` é válido, mas `C<B>` não. |
| `struct D<T: ?Sized> { x: T }` | **`?Sized`** {{ ref(page="trait-bounds.html#sized") }} remove esse limite, permitindo também `D<B>`. |
| `struct E;` | O tipo `E` tem tamanho zero e conhecido e não consome memória. |
| `trait F { fn f(&self); }` | Traits **não têm** um limite `Sized` implícito; portanto, `impl F for B {}` é válido. |
| {{ tab() }} `trait F: Sized {}` | Porém, traits podem exigir `Sized` por meio de supertraits.{{ above(target="/language-constructs/functions-behavior/#functions-behavior") }} |
| `trait G { fn g(self); }` | Para parâmetros do tipo `Self`, um DST `impl` ainda pode falhar porque não pode ficar diretamente na pilha. |

</div>


</description>
</generics-section>


<!-- Section -->
<generics-section>
<header><code>?Sized</code></header>
<description>


<mini-zoo class="zoo">
    <entry>
        <type class="generic dotted"><code>S&lt;T&gt;</code></type>
    </entry>
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
    <entry>
        <type class="composed"><code>S&lt;u8&gt;</code></type>
    </entry>
    <entry>
        <type class="composed"><code>S&lt;char&gt;</code></type>
    </entry>
    <entry>
        <type class="composed grayed"><code>S&lt;str&gt;</code></type>
    </entry>
</mini-zoo>

```
struct S<T> { … }
```

- `T` pode ser qualquer tipo concreto.
- Porém, existe o limite padrão implícito `T: Sized`; portanto, `S<str>` não é permitido por padrão.
- É preciso adicionar `T : ?Sized` para remover esse limite:

<mini-zoo class="zoo">
    <entry>
        <type class="generic dotted"><code>S&lt;T&gt;</code></type>
    </entry>
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
    <entry>
        <type class="composed"><code>S&lt;u8&gt;</code></type>
    </entry>
    <entry>
        <type class="composed"><code>S&lt;char&gt;</code></type>
    </entry>
    <entry>
        <type class="composed"><code>S&lt;str&gt;</code></type>
    </entry>
</mini-zoo>

```
struct S<T> where T: ?Sized { … }
```



</description>
</generics-section>


<!-- Section -->
<generics-section>
<header>Genéricos e lifetimes — <code>&lt;'a&gt;</code></header>
<description>

<mini-zoo class="zoo">
    <entry>
        <type class="generic dotted"><code>S&lt;'a&gt;</code></type>
    </entry>
    <entry>
        <type class="generic dotted"><code>&'a f32</code></type>
    </entry>
    <entry>
        <type class="generic dotted"><code>&'a mut u8</code></type>
    </entry>
</mini-zoo>

- Lifetimes funcionam<sup>*</sup> como parâmetros de tipo:
    - o usuário fornece um `'a` específico para instanciar o tipo; o compilador ajuda dentro dos métodos;
    - `S<'p>` e `S<'q>` são tipos distintos, assim como `Vec<f32>` e `Vec<u8>`;
    - não se pode atribuir um valor `S<'a>` a uma variável que exige `S<'b>`, exceto pela subtipagem de lifetimes, quando `'a` dura mais que `'b`.


<mini-zoo class="zoo">
    <entry>
        <type class="generic dotted"><code>S&lt;'a&gt;</code></type>
    </entry>
    <narrow-entry>
        <code style="text-align:center; width: 100%;">→</code>
    </narrow-entry>
    <entry>
        <type class="composed"><code>S&lt;'auto&gt;</code></type>
    </entry>
    <entry>
        <type class="composed"><code>S&lt;'static&gt;</code></type>
    </entry>
</mini-zoo>


- `'static` é o único valor da categoria de lifetimes disponível globalmente.

```
// `'a is free parameter here (user can pass any specific lifetime)
struct S<'a> {
    x: &'a u32
}

// In non-generic code, 'static is the only nameable lifetime we can explicitly put in here.
let a: S<'static>;

// Alternatively, in non-generic code we can (often must) omit 'a and have Rust determine
// the right value for 'a automatically.
let b: S;
```

<footnotes>

<sup>*</sup> Há diferenças sutis: é possível criar uma instância explícita `0` de um tipo `u32`, mas, exceto por `'static`, não se cria diretamente um lifetime como “linhas 80 a 100”. O compilador faz isso. {{ link(url="https://medium.com/nearprotocol/understanding-rust-lifetimes-e813bcd405fa" )}}

</footnotes>

</description>
</generics-section>


<!-- Section -->
<!-- <generics-section>
<header>Types of types: kinds</header>
<description>

Rust does not support higher-kinded types or even mention kinds, but knowing a
bit of theory can shed some light on how generics work. Note that the following
usa uma sintaxe semelhante à de Rust nas explicações, mas não é código Rust válido.

- Values have types, e.g. `true` has type `bool`, written `true: bool`.
- Types have _kinds_, e.g. `bool` has kind `*`, also written `bool: *`. (`*` is
  pronounced _star_ or, sometimes a bit confusingly, _type_.)
- (Kinds have _sorts_, which is beyond scope here. Type theories ran out of
  English synonyms for _type_ afterwards, but luckily value/type/kind is enough
  for most type systems anyway.)

Rust conceptually uses three kinds: `*`, `kind1 -> kind2` (type constructors),
and `lifetime`.

- All values have a type of kind `*`.
- The opposite is not true: there are types of kind `*` that have no values,
  e.g. `!` (the empty type).
- Type constructors such as `Vec` take a type of kind `*`, e.g. `bool`, to a
  new type of kind `*`, in this case `Vec<bool>`. We can say `Vec: * -> *`.
- `lifetime` is the kind of lifetimes, e.g. `'static: lifetime`. Since
  `lifetime` is not `*`, types of kind `lifetime` cannot have values. They can
  however be used as parameters to create types. For example in

  ```rust
  struct S<'a> {
      x: &'a u32
  }
  ```

  the kind of `S` is `lifetime -> *`.
- Note that `Vec<'static>` is a kind error, because `Vec: * -> *`, not
  `lifetime -> *`.

</description>
</generics-section> -->


<!-- Section -->
<!-- <generics-section >
<header>Another <code>?X</code></header>
<description>

- `Sized` is trait, automatically implemented **and** automatically used as default bound
- Could there (ever) be another trait `T` so that:
    - `S<T>` means `S<T> where T: Sized + X` by default and
    - you'd have to opt out with `S<T> where T: ?X` ?
- Issue:
    - Any `S<T>` written today does not know `X`, so can't opt into supporting it
    - If `X` were introduced and not implemented for any existing type, `S<T>` would stop working on that type

</description>
</generics-section> -->


<!-- Section -->
<!-- <generics-section >
<header>GAT {{ experimental() }}</header>
<description>


</description>
</generics-section> -->



<!-- Section -->
<!-- <generics-section >
<header>(Co-/Contra-) Variance </header>
<description>


</description>
</generics-section>
 -->

<!-- Section -->
<!-- <generics-section id="zoo_todo">
<header>Todo</header>
<description>


</description>
</generics-section>
 -->


</div></panel></tab>

</tabs>

<footnotes>

Clique para expandir os exemplos.

</footnotes>
