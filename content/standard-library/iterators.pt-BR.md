+++
title = "Iteradores"
description = "Métodos de Rust para criar, transformar, inspecionar e consumir iteradores, além de coletar seus resultados."
weight = 26
template = "topic.html"

[extra]
seo_title = "Iteradores"
anchor = "iterators"
print = true
translation_of = "standard-library/iterators.md"
source_hash = "42b5a021fcebb190dd31aecf6f6051411b4afd01ffe8ece51cd9d124f15ebd5b"
+++

Processando elementos em uma coleção.

<tabs class="color-header iterators">

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-p0" name="tab-group-trait-iter" checked>
<label for="tab-trait-iter-p0"><b>Básicos</b></label>
<panel><div>


Existem, em geral, quatro _estilos_ de iteração de coleção:

| Estilo | Designação das mercadorias |
| --- | --- |
| `for x in c { ... }` | _Imperativa_, efeitos colaterais úteis w., interdependência., ou necessidade de quebrar o fluxo mais cedo.  |
| `c.iter().map().filter()` | _Funcional_, muitas vezes muito mais limpo quando apenas resultados de interesse. |
| `c_iter.next()` | _Baixo nível_, via explícita `Iterator::next()` {{ std(page="std/iter/trait.Iterator.html#tymethod.next") }} invocação. {{ esoteric() }} |
| `c.get(n)` | _Manual_, ignorando máquinas oficiais de iteração. |

{{ tablesep() }}

> **Opinião** {{ opinionated() }} &mdash; O estilo funcional é frequentemente mais fácil de seguir, mas não hesite em usar  `for` e a sua `.iter()` cadeia torna-se confuso. Ao implementar contêineres iterator suporte seria ideal, mas quando com pressa pode às vezes ser mais prático apenas implementar `.len()` e `.get()` e seguir em frente com a tua vida.


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-1" name="tab-group-trait-iter">
<label for="tab-trait-iter-1"><b>Obtenção</b></label>
<panel><div>



**Basics**

Assumir que você tem uma coleção `c` de tipo `C` você deseja usar:

* **`c.into_iter()`**<sup>1</sup>    &mdash; Retorna a colecção `c` para um **`Iterator`** {{ std(page="std/iter/trait.Iterator.html") }} `i` e **consumos**<sup>2</sup> `c`. _Std._ maneira de obter iterator.
* **`c.iter()`** &mdash; Método de cortesia **algumas coleções** fornecem, retornam **emprestando** Iterator, não consome `c`.
* **`c.iter_mut()`** &mdash; Mesmo, mas ** Mutualmente emprestado** Iterador que permite que a coleção seja alterada.


** O Iterador**

Uma vez que você tem um `i`:

* **`i.next()`** &mdash;Retornos `Some(x)` próximo elemento `c` fornece, ou `None` Se já terminámos.


** Para Loops**

* **`for x in c {}`** &mdash; açúcar sintático, chamadas `c.into_iter()` e loops `i` até `None`.



<footnotes>

<sup>1</sup> Requer **`IntoIterator`** {{ std(page="std/iter/trait.IntoIterator.html") }} `C` a ser implementado. O tipo de item depende do que `C` Era.

<sup>2</sup> Se parece que não consome `c` Isso é porque o tipo era `Copy`. Por exemplo, se você ligar `(&c).into_iter()` que invocará `.into_iter()` ligado `&c` (que irá consumir um _copy_ da referência e transformá-lo em um iterador), mas o original `c` permanece intocado.

</footnotes>

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-2" name="tab-group-trait-iter">
<label for="tab-trait-iter-2"><b>Criando</b></label>
<panel><div>

**Essentials **

Vamos assumir que você tem um `struct Collection<T> {}` você foi o autor. Você também deve implementar:


* **`struct IntoIter<T> {}`** &mdash; Criar um struct para manter o seu estado de iteração (por exemplo, um índice) para iteração de valor.
* **`impl Iterator for IntoIter<T> {}`** &mdash; Implemento `Iterator::next()` para que possa produzir elementos.

<mini-zoo class="zoo" style="">
    <entry class="wide">
        <type class="generic dotted"><code>Collection&lt;T&gt;</code></type>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="margin-right: 20px;">
    <entry class="wide">
        <type class="generic dotted"><code>IntoIter&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">Iterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = T;</code></associated-type>
    </entry>
</mini-zoo>

{{ tablesep() }}

> Neste ponto você tem algo que pode se comportar como um **Iterator**, {{ std(page="std/iter/trait.Iterator.html") }} mas não tem como realmente obtê-lo. Veja a próxima aba para como isso normalmente funciona.


</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-3" name="tab-group-trait-iter">
<label for="tab-trait-iter-3"><b>Para Loops</b></label>
<panel><div>

** Suporte de laço nativo **

Muitos usuários esperariam que sua coleção _just work_ in `for` loops. Você precisa implementar:

* **`impl IntoIterator for Collection<T> {}`** &mdash; Agora `for x in c {}` Funciona.
* **`impl IntoIterator for &Collection<T> {}`** &mdash; Agora `for x in &c {}` Funciona.
* **`impl IntoIterator for &mut Collection<T> {}`** &mdash; Agora `for x in &mut c {}` Funciona.

<mini-zoo class="zoo" style="">
    <entry class="wide">
        <type class="generic dotted"><code>Collection&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">IntoIterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = T;</code></associated-type>
        <associated-type class="grayed"><code>To = IntoIter&lt;T&gt;</code></associated-type>
        <note>Iterar sobre <code>T</code>.</note>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="">
    <entry class="wide">
        <type class="generic dotted grayed"><code>&Collection&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">IntoIterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = &T;</code></associated-type>
        <associated-type class="grayed"><code>To = Iter&lt;T&gt;</code></associated-type>
        <note>Iterar sobre <code>&T</code>.</note>
    </entry>
</mini-zoo>

<mini-zoo class="zoo" style="">
    <entry class="wide">
        <type class="generic dotted grayed"><code>&mut Collectn&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">IntoIterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = &mut T;</code></associated-type>
        <associated-type class="grayed"><code>To = IterMut&lt;T&gt;</code></associated-type>
        <note>Iterar sobre <code>&mut T</code>.</note>
    </entry>
</mini-zoo>

{{ tablesep() }}

> Como você pode ver, o **IntoIterator** {{ std(page="std/iter/trait.IntoIterator.html") }} trait é o que realmente conecta sua coleção com o **IntoIter** struct você criou na aba anterior. Os dois irmãos de **IntoIter** (**Iter** e **IterMut**) são discutidos na próxima aba.


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-2b" name="tab-group-trait-iter">
<label for="tab-trait-iter-2b"><b>Emprestação</b></label>
<panel><div>



**Iteradores compartilhados e mutáveis **

Além disso, se você quiser que sua coleção seja útil quando emprestada você deve implementar:

* **`struct Iter<T> {}`** &mdash; Criar struct Exploração `&Collection<T>` estado para iteração compartilhada.
* **`struct IterMut<T> {}`** &mdash; Similar, mas mantendo `&mut Collection<T>` estado para iteração mutável.
* **`impl Iterator for Iter<T> {}`** &mdash; Implementar iteração compartilhada.
* **`impl Iterator for IterMut<T> {}`** &mdash; Implementar iteração mutável.

Também pode querer adicionar métodos de conveniência:

- `Collection::iter(&self) -> Iter`,
- `Collection::iter_mut(&mut self) -> IterMut`.



<mini-zoo class="zoo" style="margin-right: 20px;">
    <entry class="wide">
        <type class="generic dotted"><code>Iter&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">Iterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = &T;</code></associated-type>
    </entry>
</mini-zoo>


<mini-zoo class="zoo" style="margin-right: 20px;">
    <entry class="wide">
        <type class="generic dotted"><code>IterMut&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">Iterator</code></trait-impl>
        <associated-type class="grayed"><code>Item = &mut T;</code></associated-type>
    </entry>
</mini-zoo>

{{ tablesep() }}

> O código para o apoio ao interator é basicamente apenas uma repetição das etapas anteriores com um tipo ligeiramente diferente, por exemplo, `&T` vs `T`.


</div></panel></tab>




<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-trait-iter-4" name="tab-group-trait-iter">
<label for="tab-trait-iter-4"><b>Interoperabilidade</b></label>
<panel><div>


** Iterador Interoperabilidade **

Para permitir ** 3<sup>rd</sup> iteradores de festa** para 'recolher' sua coleção implementar:

* **`impl FromIterator for Collection<T> {}`** &mdash; Agora `some_iter.collect::<Collection<_>>()` Funciona.
* **`impl Extend for Collection<T> {}`** &mdash; Agora `c.extend(other)` Funciona.

Além disso, também considere adicionar o extra traits de **`std::iter`** {{ std(page="std/iter/index.html#") }} para as suas estruturas anteriores:

<mini-zoo class="zoo" style="margin-right: 20px;">
    <entry class="wide">
        <type class="generic dotted"><code>Collection&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">FromIterator</code></trait-impl>
        <trait-impl class="">⌾ <code style="">Extend</code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry class="wide">
        <type class="generic dotted"><code>IntoIter&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">DoubleEndedIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">ExactSizeIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">FusedIterator </code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry class="wide">
        <type class="generic dotted"><code>Iter&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">DoubleEndedIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">ExactSizeIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">FusedIterator </code></trait-impl>
    </entry>
</mini-zoo>

<mini-zoo class="zoo">
    <entry class="wide">
        <type class="generic dotted"><code>IterMut&lt;T&gt;</code></type>
        <trait-impl class="">⌾ <code style="">DoubleEndedIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">ExactSizeIt… </code></trait-impl>
        <trait-impl class="">⌾ <code style="">FusedIterator </code></trait-impl>
    </entry>
</mini-zoo>



{{ tablesep() }}

> Escrever coleções pode ser trabalho. A boa notícia é, se você seguiu todos
> estas etapas suas coleções se sentirão como _cidadãos de primeira classe_.


</div></panel></tab>

</tabs>
