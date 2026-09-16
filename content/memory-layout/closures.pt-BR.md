+++
title = "Closures"
description = "Como closures de Rust capturam seu ambiente e são representadas na memória."
weight = 21
template = "topic.html"

[extra]
seo_title = "Closures"
anchor = "closures-data"
print = true
translation_of = "memory-layout/closures.md"
source_hash = "60a30376ef68b3507ec2eab9c860505cc94617aa83ae0bc53ce187b7b50f3fd3"
+++
Funções ad hoc com um bloco de dados gerenciado automaticamente que **captura** {{ ref(page="types/closure.html#capture-modes") }}<sup>, 1</sup>
o ambiente em que a closure foi definida. Por exemplo:

```rust
let y = ...;
let z = ...;

with_closure(move |x| x + y.f() + z); // y and z are moved into closure instance (of type C1)
with_closure(     |x| x + y.f() + z); // y and z are pointed at from closure instance (of type C2)
```

Os tipos anônimos de closure `C1` e `C2` gerados e passados a `with_closure()` teriam esta aparência:

<!-- NEW ENTRY -->
<datum class="doublespaced">
    <name><code>move |x| x + y.f() + z</code></name>
    <visual>
       <framed class="any" style="width: 100px;"><code>Y</code></framed>
       <framed class="any" style="width: 50px;"><code>Z</code></framed>
    </visual>
    <zoom>Tipo anônimo de closure C1</zoom>
    <!-- <description>Also produces anonymous <br><code>f<sub>c1</sub> (c: C1, x: T)</code>. Details depend<br> which <code>FnOnce</code>, <code>FnMut</code>, <code>Fn</code> is allowed.</description> -->
</datum>


<!-- NEW ENTRY -->
<datum class="">
    <name><code>|x| x + y.f() + z</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
    </visual>
    <zoom>Tipo anônimo de closure C2</zoom>
    <memory-entry>
        <memory-link style="left:44%;">|</memory-link>
        <memory class="anymem">
            <framed class="any" style="width: 30px;"><code>Y</code></framed>
        </memory>
    </memory-entry>
    <memory-entry>
        <memory-link style="left:44%;">|</memory-link>
        <memory class="anymem">
            <framed class="any" style="width: 30px;"><code>Z</code></framed>
        </memory>
    </memory-entry>
    <!-- <description>Similar, but captured context by<br> reference. Details might differ <br> depending on types involved.</description> -->
</datum>

<!-- Little hack as description below was too cluttered. -->
<!-- <datum>
    <name>&nbsp;</name>
    <description>
    Also produces anonymous <code>fn</code> such as <code>f_c1 (C1, X)</code> or <br>
    <code>f_c2 (&C2, X)</code>. Details depend which <code>FnOnce</code>, <code>FnMut</code>, <code>Fn</code> ...<br>
    is supported, based on properties of captured types.
    </description>
</datum> -->

<blockquote>
<footnotes>

Também produz <code>fn</code> anônimos, como <code>f<sub>c1</sub>(C1, X)</code> ou <code>f<sub>c2</sub>(&C2, X)</code>. Os detalhes dependem de quais traits <code>FnOnce</code>, <code>FnMut</code>, <code>Fn</code> ... são implementadas, conforme as propriedades dos tipos capturados.

</footnotes>
</blockquote>


<footnotes>

<sup>1</sup> Simplificando, uma closure é uma pequena função fácil de escrever que aceita parâmetros, _mas também_ precisa de variáveis locais para trabalhar. Portanto, ela é um tipo (que contém essas variáveis) e uma função. _Capturar o ambiente_ significa que o tipo da closure retém essas variáveis, seja _movendo o valor_, seja _por ponteiro_. Veja **Closures em APIs** {{ below(target="/coding-guides/closures-in-apis/#closures-in-apis") }} para entender as implicações.

</footnotes>
