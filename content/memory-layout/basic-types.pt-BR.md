+++
title = "Tipos básicos"
description = "Organização da memória de booleanos, números, texto, tuplas, arrays, slices, structs, enums e ponteiros em Rust."
weight = 18
template = "topic.html"

[extra]
seo_title = "Tipos básicos"
anchor = "basic-types"
print = true
translation_of = "memory-layout/basic-types.md"
source_hash = "b9b22f0bbc2bf064cce6eddc4a784191caf12ec9ae286f4bf3aa91843dca8db9"
+++
Tipos essenciais integrados ao núcleo da linguagem.



### Tipos booleanos {{ ref(page="types/boolean.html") }} e numéricos {{ ref(page="types/numeric.html") }} {#boolean-and-numeric-types}

<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>bool</code></name>
    <visual class="bool">
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>u8</code>, <code>i8</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced" >
    <name><code>u16</code>, <code>i16</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum  class="spaced">
    <name><code>u32</code>, <code>i32</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum  class="spaced">
    <name><code>u64</code>, <code>i64</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum  class="spaced">
    <name><code>u128</code>, <code>i128</code></name>
    <visual class="bytes">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>usize</code>, <code>isize</code></name>
    <visual class="sized">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte style="border-color: #888;"><code></code></byte>
        <byte style="border-color: #888;"><code></code></byte>
        <byte style="border-color: #aaa;"><code></code></byte>
        <byte style="border-color: #aaa;"><code></code></byte>
        <byte style="border-color: #aaa;"><code></code></byte>
        <byte style="border-color: #aaa;"><code></code></byte>
    </visual>
    <zoom>
        Igual a <code>ptr</code> na plataforma.
    </zoom>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>f16</code> {{ experimental() }} </name>
    <visual class="float">
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>f32</code></name>
    <visual class="float">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>f64</code></name>
    <visual class="float">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>f128</code> {{ experimental() }} </name>
    <visual class="float">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
</datum>



<br/>


{{ tablesep() }}


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-1" name="tab-group-numeric" checked>
<label for="tab-numeric-1"><b>Tipos sem sinal</b></label>
<panel><div>



|Tipo|Valor máximo|
|---|---|
|`u8`| `255` |
|`u16` | `65_535` |
|`u32`| `4_294_967_295` |
|`u64`| `18_446_744_073_709_551_615` |
|`u128`| `340_282_366_920_938_463_463_374_607_431_768_211_455` |
|`usize`| Conforme o tamanho do ponteiro na plataforma, equivale a `u16`, `u32` ou `u64`. |


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-3" name="tab-group-numeric">
<label for="tab-numeric-3"><b>Tipos com sinal</b></label>
<panel><div>



|Tipo |Valor máximo|
|---|---|
|`i8`| `127` |
|`i16` | `32_767` |
|`i32`| `2_147_483_647` |
|`i64`| `9_223_372_036_854_775_807` |
|`i128`| `170_141_183_460_469_231_731_687_303_715_884_105_727` |
|`isize`| Conforme o tamanho do ponteiro na plataforma, equivale a `i16`, `i32` ou `i64`. |

{{ tablesep() }}

|Tipo |Valor mínimo|
|---|---|
|`i8`| `-128` |
|`i16` | `-32_768` |
|`i32`| `-2_147_483_648` |
|`i64`| `-9_223_372_036_854_775_808` |
|`i128`| `-170_141_183_460_469_231_731_687_303_715_884_105_728` |
|`isize`| Conforme o tamanho do ponteiro na plataforma, equivale a `i16`, `i32` ou `i64`. |


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-6" name="tab-group-numeric">
<label for="tab-numeric-6"><b>Tipos de ponto flutuante</b></label>
<panel><div>


| Tipo | Valor máximo | Menor valor positivo | Maior inteiro sem perda<sup>1</sup> |
|---|---|---| ---|
| `f16` {{ experimental() }} | 65504.0 | 6.10 ⋅ 10 <sup>-5</sup> | `2048`  |
| `f32` | 3.40 ⋅ 10 <sup>38</sup> | 3.40 ⋅ 10 <sup>-38</sup> | `16_777_216` |
| `f64` | 1.79 ⋅ 10 <sup>308</sup> | 2.23 ⋅ 10 <sup>-308</sup> | `9_007_199_254_740_992` |
| `f128` {{ experimental() }} | 1.19 ⋅ 10 <sup>4932</sup>  |  3.36 ⋅ 10 <sup>-4932</sup> | 2.07 ⋅ 10 <sup>34</sup> |

<footnotes>

<sup>1</sup> O maior inteiro `M` tal que todos os outros inteiros `0 <= X <= M` possam ser
representados sem perda nesse tipo. Ou seja, pode haver inteiros maiores
que também possam ser representados sem perda (por exemplo, `65504` para `f16`), mas até esse
valor a representação sem perda é garantida.

</footnotes>

{{ tablesep() }}

> Valores de ponto flutuante aproximados para facilitar a leitura. Os limites negativos são esses valores multiplicados por -1.

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-2" name="tab-group-numeric">
<label for="tab-numeric-2"><b>Representação interna de ponto flutuante</b>{{ esoteric() }}</label>
<panel><div>


Exemplo de representação em bits<sup>*</sup> de um `f32`:

<!-- NEW ENTRY -->
<datum style="opacity:0.7; margin-bottom:10px;">
    <visual class="float">
    <bitgroup>
        <bit><code>S</code></bit>
    </bitgroup>
    <bitgroup>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
        <bit><code>E</code></bit>
    </bitgroup>
    <bitgroup>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
        <bit><code>F</code></bit>
    </bitgroup>
    </visual>
</datum>

{{ tablesep() }}

Explicação:

| f32 | S (1) | E (8) | F (23) | Valor |
|------| ---------| ---------| ---------| ---------|
| Número normalizado | ± | 1 a 254 | qualquer | ±(1.F)<sub>2</sub> * 2<sup>E-127</sup>  |
| Número subnormal | ± | 0 | diferente de zero | ±(0.F)<sub>2</sub> * 2<sup>-126</sup>  |
| Zero | ± | 0 | 0 | ±0  |
| Infinito | ± | 255 | 0 | ±∞  |
| NaN | ± | 255 | diferente de zero | NaN  |

{{ tablesep() }}

De forma semelhante, para tipos <code>f64</code>:

| f64 | S (1) | E (11) | F (52) | Valor |
|------| ---------| ---------| ---------| ---------|
| Número normalizado | ± | 1 a 2046 | qualquer | ±(1.F)<sub>2</sub> * 2<sup>E-1023</sup>  |
| Número subnormal | ± | 0 | diferente de zero | ±(0.F)<sub>2</sub> * 2<sup>-1022</sup>  |
| Zero | ± | 0 | 0 | ±0  |
| Infinito | ± | 2047 | 0 | ±∞  |
| NaN | ± | 2047 | diferente de zero | NaN  |

<footnotes>
    <sup>*</sup> Tipos de ponto flutuante seguem o padrão <a href="https://en.wikipedia.org/wiki/IEEE_754-2008_revision">IEEE 754-2008</a> e dependem da ordem de bytes da plataforma.
</footnotes>

</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-4" name="tab-group-numeric">
<label for="tab-numeric-4"><b>Armadilhas de conversão</b> {{ bad() }}</label>
<panel><div class="">


| Conversão<sup>1</sup> | Resultado | Observação |
| --- | --- | --- |
| `3.9_f32 as u8` | `3` | Trunca; considere usar `x.round()` primeiro. |
| `314_f32 as u8` | `255` | Usa o número representável mais próximo. |
| `f32::INFINITY as u8` | `255` | Idem; trata `INFINITY` como um número _muito_ grande.|
| `f32::NAN as u8` | `0` | - |
| `_314 as u8` | `58` | Descarta os bits excedentes. |
| `_257 as i8` | `1` | Descarta os bits excedentes. |
| `_200 as i8` | `-56` | Descarta os bits excedentes; o bit mais significativo pode indicar um valor negativo. |

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-numeric-5" name="tab-group-numeric">
<label for="tab-numeric-5"><b>Armadilhas aritméticas</b> {{ bad() }}</label>
<panel><div class="">

| Operação<sup>1</sup> | Resultado | Observação |
| --- | --- | --- |
| `200_u8 / 0_u8` | Erro de compilação. | - |
| `200_u8 / _0` <sup>d, r</sup> | Panic. | Operações aritméticas comuns podem causar panic; aqui, por divisão por zero. |
| `200_u8 + 200_u8` | Erro de compilação. | - |
| `200_u8 + _200` <sup>d</sup> | Panic. | Considere usar `checked_`, `wrapping_`, … {{ std(page="std/primitive.isize.html#method.checked_add") }}|
| `200_u8 + _200` <sup>r</sup> | `144` | No modo release, ocorre overflow. |
| `-128_i8 * -1` | Erro de compilação. | Causaria overflow (`128_i8` não existe). |
| `-128_i8 * _1neg` <sup>d</sup> | Panic. | - |
| `-128_i8 * _1neg` <sup>r</sup> | `-128` | O overflow retorna a `-128` no modo release. |
| `1_u8 / 2_u8` | `0` | As demais divisões entre inteiros truncam o resultado. |
| `0.8_f32 + 0.1_f32` | `0.90000004` | - |
| `1.0_f32 / 0.0_f32` | `f32::INFINITY` | - |
| `0.0_f32 / 0.0_f32` | `f32::NAN` | - |
| `x < f32::NAN` | `false` | Comparações com `NAN` sempre retornam falso. |
| `x > f32::NAN` | `false` | Comparações com `NAN` sempre retornam falso. |
| `f32::NAN == f32::NAN` | `false` | Use `f32::is_nan()` {{ std(page="std/primitive.f32.html#method.is_nan") }}. |

</div></panel></tab>


<!-- End tabs -->
</tabs>

<!-- End overflow prevention -->
</div></div>


<footnotes>

<sup>1</sup> A expressão `_100` representa qualquer expressão que possa conter o valor `100`, como `100_i32`, mas cujo valor não seja conhecido pelo compilador.<br/>
<sup>d</sup> Compilação em modo debug.<br/>
<sup>r</sup> Compilação em modo release.<br/>

</footnotes>


{{ tablesep() }}



### Tipos textuais {{ ref(page="types/textual.html") }} {#textual-types}


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>char</code></name>
    <visual class="char">
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
        <byte><code></code></byte>
    </visual>
    <description>Qualquer valor escalar Unicode.</description>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>str</code></name>
    <visual>
        <note>…</note>
        <byte class="bytes"><code>U</code></byte>
        <byte class="bytes"><code>T</code></byte>
        <byte class="bytes"><code>F</code></byte>
        <byte class="bytes"><code>-</code></byte>
        <byte class="bytes"><code>8</code></byte>
        <note>… quantidade indefinida</note>
    </visual>
    <description>Raramente aparece sozinho; normalmente se usa <code>&str</code>.</description>
</datum>


{{ tablesep() }}

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-textual-3" name="tab-group-textual" checked>
<label for="tab-textual-3"><b>Fundamentos</b></label>
<panel><div>

| Tipo | Descrição |
|---------|-------------|
| `char` | Sempre ocupa 4 bytes e contém apenas um **valor escalar** Unicode {{ link(url="https://www.unicode.org/glossary/#unicode_scalar_value") }}. |
| `str` | Um array de `u8` de tamanho desconhecido que contém **pontos de código codificados em UTF-8**. |

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-textual-1" name="tab-group-textual">
<label for="tab-textual-1"><b>Uso</b></label>
<panel><div>



<!-- Notice how:

- `char` is always 4 bytes and only holds a single Unicode **scalar value** {{ link(url="https://www.unicode.org/glossary/#unicode_scalar_value") }}, thus possibly wasting space.
- `str` is a byte-array of unknown length guaranteed to hold **UTF-8 encoded code points** (but harder to index).
 -->

| Caracteres | Descrição |
|---------|-------------|
| `let c = 'a';` | Muitas vezes, um `char` (valor escalar Unicode) corresponde à ideia intuitiva de _caractere_. |
| `let c = '❤';` | Também pode conter muitos símbolos Unicode. |
| `let c = '❤️';` | Mas nem sempre. Esse emoji contém **dois** `char` (veja Codificação) e **não pode** {{ bad() }} ser armazenado em um `c`.<sup>1</sup> |
| `c = 0xffff_ffff;` | Além disso, caracteres **não podem** {{ bad() }} conter padrões de bits arbitrários. |

<footnotes>
    <sup>1</sup> Curiosidade: devido ao <a href="https://en.wikipedia.org/wiki/Zero-width_joiner">Zero-width joiner</a> (⨝), aquilo que o usuário <i>percebe como um caractere</i> pode ser ainda mais imprevisível: 👨‍👩‍👧 é, na verdade, composto por 5 caracteres 👨⨝👩⨝👧. Conforme seus recursos, o mecanismo de renderização pode exibi-los unidos ou como três figuras separadas.
</footnotes>


{{ tablesep() }}

| Strings | Descrição |
|---------|-------------|
| `let s = "a";` | Normalmente, um `str` é usado por meio de `&str`, como `s` aqui, e nunca diretamente. |
| `let s = "❤❤️";` | Pode conter texto arbitrário, tem tamanho variável por _caractere_ e é difícil de indexar. |


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-textual-2" name="tab-group-textual">
<label for="tab-textual-2"><b>Codificação</b>{{ esoteric() }}</label>
<panel><div>


`let s = "I ❤ Rust"; ` <br>
`let t = "I ❤️ Rust";`

| Variante | Representação na memória<sup>2<sup> |
|---------|-------------|
| `s.as_bytes()` | `49` `20` <span class="force-code-color same-black"><b>`e2 9d a4`</b> </span> `20 52 75 73 74` <sup>3<sup> |
| `t.as_bytes()` | `49` `20` <span class="force-code-color same-black"><b>`e2 9d a4`</b> </span> <span class="force-code-color same-red"><b>`ef b8 8f`</b></span> `20 52 75 73 74` <sup>4<sup> |
| `s.chars()`<sup>1<sup> | `49 00 00 00 20 00 00 00` <span class="force-code-color same-black"><b>`64 27 00 00` </b></span> `20 00 00 00 52 00 00 00 75 00 00 00 73 00` &hellip; |
| `t.chars()`<sup>1<sup> | `49 00 00 00 20 00 00 00` <span class="force-code-color same-black"><b>`64 27 00 00`</b></span> <span class="force-code-color same-red"><b>`0f fe 00 00`</b></span> `20 00 00 00 52 00 00 00 75 00` &hellip; |

{{ tablesep() }}

<footnotes>
    <sup>1</sup> O resultado é coletado em um array e transmutado em bytes; <a href="https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=4303e6e40f3e971901409552bae88ac0">compare aqui</a>.<br>
    <sup>2</sup> Valores em hexadecimal, em x86.<br>
    <sup>3</sup> Observe que <code>❤</code>, com <a href="https://codepoints.net/U+2764">ponto de código Unicode (U+2764)</a>, é representado como <span class="force-code-color same-black"><b>64 27 00 00</b></span> dentro de <code>char</code>, mas é <a href="https://en.wikipedia.org/wiki/UTF-8#Description">codificado em UTF-8 como</a> <span class="force-code-color same-black"><b>e2 9d a4</b></span> em <code>str</code>.<br>
    <sup>4</sup> Observe também que o emoji <a href="https://emojipedia.org/red-heart/">coração vermelho <code>❤️</code></a> combina <code>❤</code> e o <a href="https://codepoints.net/U+FE0F">U+FE0F Variation Selector-16</a>; por isso, <code>t</code> contém mais caracteres que <code>s</code>.
</footnotes>

{{ tablesep() }}


<footnotes>

> <sup>⚠️</sup> Devido ao que parecem ser bugs dos navegadores, Safari e Edge renderizam incorretamente os corações nas notas 3 e 4, apesar de diferenciá-los corretamente em `s` e `t` acima.

</footnotes>

</div></panel></tab>


<!-- End tabs -->
</tabs>


{{ tablesep() }}
