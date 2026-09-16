+++
title = "Referências e ponteiros"
description = "Representações em memória de referências, ponteiros brutos, slices, objetos de trait e metadados de ponteiros em Rust."
weight = 20
template = "topic.html"

[extra]
seo_title = "Referências e ponteiros na memória"
anchor = "references-pointers-ui"
print = true
translation_of = "memory-layout/references-pointers.md"
source_hash = "bd4411d53ee00131427582814e6c92833dab30784214ea504c7de3c99a2175fd"
+++
Referências dão acesso seguro à memória de terceiros<sup></sup>; ponteiros brutos dão acesso `unsafe`.
Os tipos `mut` correspondentes têm o mesmo layout de dados que suas versões imutáveis.


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a T</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <payload>
            <code>meta</code><sub>2/4/8</sub>
        </payload>
    </visual>
    <memory-entry>
        <memory-link style="left:46%;">|</memory-link>
        <memory class="anymem">
            <framed class="any unsized"><code>T</code></framed>
        </memory>
    </memory-entry>
    <description>Deve apontar para um <code>t</code> válido de <code>T</code>, <br> e esse destino deve existir por <br> pelo menos <code>'a</code>.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>*const T</code></name>
    <visual class="unsafe">
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <payload>
            <code>meta</code><sub>2/4/8</sub>
        </payload>
    </visual>
    <zoom>
        Sem garantias.
    </zoom>
</datum>

<br/>


## Metadados de ponteiros {#pointer-meta} {# ponteiro- meta}

Muitos tipos de referência e ponteiro podem conter um campo adicional, os **metadados do ponteiro**. {{ std(page="nightly/std/ptr/trait.Pointee.html#pointer-metadata") }}
Ele pode indicar o tamanho do destino em elementos ou bytes, ou apontar para uma <i>vtable</i>. Ponteiros com metadados são chamados de **fat**; os demais, de **thin**.

<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a T</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
    </visual>
    <memory-entry>
        <memory-link style="left:46%;">|</memory-link>
        <memory class="anymem">
            <framed class="any t"><code>T</code></framed>
        </memory>
    </memory-entry>
    <description>Sem metadados para <br>destino de tamanho conhecido<br> (ponteiro thin).</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a T</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry>
        <memory-link style="left:46%;">|</memory-link>
        <memory class="anymem">
            <framed class="any unsized"><code>T</code></framed>
        </memory>
    </memory-entry>
    <description>Se <code>T</code> for um DST <code>struct</code> como<br> <code>S { x: [u8] }</code>
    o campo de metadados <code>len</code> indica a <br>quantidade de conteúdo de tamanho dinâmico.</description>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a [T]</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry class="double">
        <memory-link style="left:24%;">|</memory-link>
        <memory class="anymem">
            …
            <framed class="any" style="width: 30px;"><code>T</code></framed>
            <framed class="any" style="width: 30px;"><code>T</code></framed>
            …
        </memory>
    </memory-entry>
    <description><b>Referência a slice</b> comum (isto é, o <br>tipo de referência ao tipo slice <code>[T]</code>), {{ above (target="/memory-layout/custom-types/#custom-types") }} <br>normalmente escrita como <code>&[T]</code> quando <code>'a</code> é omitido.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>&'a str</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry class="double">
        <memory-link style="left:24%;">|</memory-link>
        <memory class="anymem">
            …
            <byte class="bytes"><code>U</code></byte>
            <byte class="bytes"><code>T</code></byte>
            <byte class="bytes"><code>F</code></byte>
            <byte class="bytes"><code>-</code></byte>
            <byte class="bytes"><code>8</code></byte>
            …
        </memory>
    </memory-entry>
    <description><b>Referência a string slice</b> (isto é, o <br>tipo de referência ao tipo string <code>str</code>),<br> em que o metadado <code>len</code> é o tamanho em bytes.</description>
</datum>

<br>

<!-- NEW ENTRY -->
<datum class="spaced" style="padding-bottom: 165px; position: relative;">
    <name><code>&'a dyn Trait</code></name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <ptr>
            <code>ptr</code><sub>2/4/8</sub>
        </ptr>
    </visual>
    <memory-entry>
        <memory-link style="left:49%;">|</memory-link>
        <memory class="anymem">
            <framed class="any unsized"><code>T</code></framed>
        </memory>
    </memory-entry>
    <memory-entry style="width:220px; position: absolute;">
        <memory-link style="left:22%;">|</memory-link>
        <memory class="static-vtable" style="width: 210px;">
            <table>
                <tr class="vtable"><td><code>*Drop::drop(&mut T)</code></td></tr>
                <tr class="vtable"><td><code>size</code></td></tr>
                <tr class="vtable"><td><code>align</code></td></tr>
                <tr class="vtable"><td><code>*Trait::f(&T, …)</code></td></tr>
                <tr class="vtable"><td><code>*Trait::g(&T, …)</code></td></tr>
            </table>
        </memory>
        <description>O metadado aponta para uma vtable, em que <code>*Drop::drop()</code>, <code>*Trait::f()</code>, … apontam para suas respectivas <code>impl</code> de <code>T</code>.</description>
    </memory-entry>

</datum>
