+++
title = "Tipos personalizados"
description = "Organização da memória de structs, enums e unions personalizados em Rust e seus atributos de representação."
weight = 19
template = "topic.html"

[extra]
seo_title = "Tipos personalizados"
anchor = "custom-types"
print = true
translation_of = "memory-layout/custom-types.md"
source_hash = "c7b837a6bb8b24f9033329952f53d33969ac571682f0b6a73fcb97681a6d0447"
+++
Tipos básicos que podem ser definidos pelo usuário. O <b>layout</b> {{ ref(page="type-layout.html") }} efetivo depende da <b>representação</b>; {{ ref(page="type-layout.html#representations") }} pode haver bytes de preenchimento.


<!-- NEW ENTRY -->
<datum class="spaced">
    <name class="nogrow"><code>T</code></name>
    <name class="hidden">x</name>
    <visual>
       <framed class="any t"><code>T</code></framed>
    </visual>
    <description>Tipo com tamanho conhecido.</description>
</datum>

<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>T: ?Sized</code></name>
    <visual>
       <framed class="any unsized"><code>T</code></framed>
    </visual>
    <description>Pode ter tamanho conhecido.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>[T; n]</code></name>
    <visual>
       <framed class="any t"><code>T</code></framed>
       <framed class="any t"><code>T</code></framed>
       <framed class="any t"><code>T</code></framed>
       <note>… n vezes</note>
    </visual>
    <description>Array fixo de <code>n</code> elementos.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>[T]</code></name>
    <visual>
       <note>…</note>
       <framed class="any t"><code>T</code></framed>
       <framed class="any t"><code>T</code></framed>
       <framed class="any t"><code>T</code></framed>
       <note>… quantidade indefinida</note>
    </visual>
    <description><b>Tipo slice</b> com quantidade desconhecida de elementos. Não é <br> <code>Sized</code> (nem contém a informação <code>len</code>) e, na<br> maioria das vezes, é usado por referência como <code>&[T]</code>. {{ below(target="/memory-layout/references-pointers/#references-pointers-ui") }}</description>
</datum>

<!-- NEW ENTRY -->
<datum style="margin-right:70px; position: relative; width: 70px;">
    <name class="nogrow"><code>struct S;</code></name>
    <name class="hidden"><code>;</code></name>
    <visual style="width: 15px;" class="zst">
        <code></code>
    </visual>
    <description>Tipo de tamanho zero. </description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>(A, B, C)</code></name>
    <visual style="width: 182px;">
       <framed class="any"><code>A</code></framed>
       <framed class="any" style="width: 100px;"><code>B</code></framed>
       <framed class="any" style="width: 50px;"><code>C</code></framed>
    </visual>
    <andor>ou talvez</andor>
    <visual style="width: 182px;">
       <framed class="any" style="width: 100px;"><code>B</code></framed>
       <framed class="any"><code>A</code></framed>
       <framed class="any" style="width: 50px;"><code>C</code></framed>
    </visual>
    <description>A menos que uma representação seja imposta <br>(por exemplo, por <code>#[repr(C)]</code>), o layout<br> do tipo não é especificado.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>struct S { b: B, c: C } </code></name>
    <visual style="width: 166px;">
       <framed class="any" style="width: 100px;"><code>B</code></framed>
       <framed class="any" style="width: 50px;"><code>C</code></framed>
    </visual>
    <andor>ou talvez</andor>
    <visual>
       <framed class="any" style="width: 50px;"><code>C</code></framed>
       <pad><code style="">↦</code></pad>
       <framed class="any" style="width: 100px;"><code>B</code></framed>
    </visual>
    <description>O compilador também pode inserir preenchimento.</description>
</datum>



<blockquote>
<footnotes>

Observe que dois tipos `A(X, Y)` e `B(X, Y)` com exatamente os mesmos campos ainda podem ter layouts diferentes; nunca use `transmute()` {{ std(page="std/mem/fn.transmute.html") }} sem garantias de representação.

</footnotes>
</blockquote>



{{ tablesep() }}

Esses **tipos soma** contêm um valor de um de seus subtipos:

<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>enum E { A, B, C }</code></name>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
        <framed class="any">
            <code>A</code>
        </framed>
    </visual>
    <andor>ou exclusivo</andor>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 100px;">
            <code>B</code>
        </framed>
    </visual>
    <andor>ou exclusivo</andor>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 50px;">
            <code>C</code>
        </framed>
    </visual>
    <description>
        Contém A, B ou C com segurança; também <br> chamado de união etiquetada, embora <br> o compilador possa encaixar a etiqueta<br> em bits não utilizados.
    </description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>union { … }</code></name>
    <visual style="text-align: left;">
        <framed class="any">
            <code>A</code>
        </framed>
    </visual>
    <andor>ou inseguro</andor>
    <visual style="text-align: left;">
        <framed class="any" style="width: 100px;">
            <code>B</code>
        </framed>
    </visual>
    <andor>ou inseguro</andor>
    <visual style="text-align: left;">
        <framed class="any" style="width: 50px;">
            <code>C</code>
        </framed>
    </visual>
    <description>
        Pode reinterpretar a <br>memória de forma insegura. O resultado <br> pode ser indefinido.
    </description>
</datum>
