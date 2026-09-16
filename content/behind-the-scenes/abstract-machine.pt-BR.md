+++
title = "A máquina abstrata"
description = "Como a máquina abstrata de Rust define o comportamento válido dos programas e permite otimizações do compilador."
weight = 15
template = "topic.html"

[extra]
seo_title = "A máquina abstrata"
anchor = "the-abstract-machine"
print = true
translation_of = "behind-the-scenes/abstract-machine.md"
source_hash = "41fc7c02b2840c279e9ca2580301fb37f17fae741d859d99a0e3dfe3535b6ce5"
+++
Assim como `C` e `C++`, Rust se baseia em uma _máquina abstrata_.


<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-abstract-machine-1" name="tab-group-abstract-machine" checked>
<label for="tab-abstract-machine-1"><b>Visão geral</b></label>
<panel><div>


<div style="text-align: center;">

<mini-zoo class="zoo" style="text-align: center;">
    <entry>
        <machine class="bad">Rust</machine>
    </entry>
    <code style="text-align:center;">→</code>
    <entry>
        <machine class="bad">CPU</machine>
    </entry>
    <br/>
    <note>{{bad()}} Interpretação equivocada.</note>
</mini-zoo>

<mini-zoo class="zoo" style="text-align: center; margin-left: 80px;">
    <entry>
        <machine class="good">Rust</machine>
    </entry>
    <code style="text-align:center">→</code>
    <entry style="width: 120px;">
        <machine class="good">Máquina abstrata</machine>
    </entry>
    <code style="text-align:center">→</code>
    <entry>
        <machine class="good">CPU</machine>
    </entry>
    <br/>
    <note>Correto.</note>
</mini-zoo>

</div>

{{ tablesep() }}

Com raras exceções, não é válido basear seu raciocínio diretamente na CPU física. Você escreve código para uma CPU _abstrata_. Rust então interpreta o que você pretende e traduz isso em código de máquina real para RISC-V, x86 e outras arquiteturas.


{{ tablesep() }}


Essa _máquina abstrata_
- não é um ambiente de execução e não acrescenta custo de execução: é uma _abstração do modelo computacional_;
- inclui conceitos como regiões de memória (_stack_ etc.) e semântica de execução;
- _conhece_ e _observa_ aspectos que podem ser irrelevantes para sua CPU;
- é, na prática, um contrato entre você e o compilador;
- e **aproveita tudo isso para realizar otimizações**.


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-abstract-machine-2" name="tab-group-abstract-machine">
<label for="tab-abstract-machine-2"><b>Equívocos comuns</b></label>
<panel><div>

<div class="color-header abstract-machine">

À esquerda estão suposições incorretas sobre o que _deveria funcionar_ se Rust mirasse diretamente a CPU. À direita estão propriedades nas quais você interferiria ao violar o contrato da máquina abstrata (AM).

{{ tablesep() }}

| Sem AM | Com AM |
|---------|-------------|
| `0xffff_ffff` seria um `char` válido. {{ bad() }} | A AM pode aproveitar padrões de bits _“inválidos”_ para armazenar outros dados no mesmo espaço.  |
| `0xff` e `0xff` seriam o mesmo ponteiro. {{ bad() }} | Ponteiros da AM podem ter **proveniência** {{ std(page="std/ptr/index.html#provenance")}} para permitir otimizações.  |
| Qualquer leitura ou escrita pelo ponteiro `0xff` seria válida. {{ bad() }} | A AM pode gerar operações que favorecem o cache por saber que _“nenhuma leitura é possível”_.  |
| Ler memória não inicializada apenas retornaria um valor aleatório. {{ bad() }} | A AM _“sabe”_ que a leitura é impossível e pode remover todo o código relacionado.  |
| Uma corrida de dados apenas retornaria um valor aleatório. {{ bad() }} | A AM pode dividir leituras e escritas e produzir um valor _impossível_. {{ below(target="/pt-BR/standard-library/atomics-cache/#atomics-cache") }}  |
| Uma referência nula seria apenas `0x0` em algum registrador. {{ bad() }} | Armazenar `0x0` em uma referência invoca Cthulhu.  |

{{ tablesep() }}

> Esta tabela apenas esboça o papel da AM. Ao contrário de C e C++, Rust não permite esses erros a menos que você force a situação com `unsafe`. {{ below(target="/pt-BR/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined") }}

</div>
</div></panel></tab>


</tabs>

<!--  -->
<!-- > Practically this means: -->
<!-- > - before assuming your **CPU** will do `A` when writing `B` you need positive proof **via documentation**(!), -->
<!-- > - if you don't have that any physical behavior is _coincidental_, -->
<!-- > - violate the abtract machine's contract and the optimizer makes your CPU do something **entirely else** &mdash; **undefined behavior**.{{ below(target="/pt-BR/coding-guides/unsafe-unsound-undefined/#unsafe-unsound-undefined")}} -->
<!--  -->
