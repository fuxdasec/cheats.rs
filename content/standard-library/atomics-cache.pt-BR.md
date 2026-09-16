+++
title = "Operações atômicas e cache"
description = "Comportamento das operações atômicas de Rust, ordenação de memória, coerência de cache e sincronização."
weight = 25
template = "topic.html"

[extra]
seo_title = "Operações atômicas e cache"
anchor = "atomics-cache"
print = true
translation_of = "standard-library/atomics-cache.md"
source_hash = "d5c6ec08ed84f580165009159f179837d49ebad8a5cba7d171fbbb82f782eded"
+++

cache de CPU, a memória escreve, e como a atômica o afeta.

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">


<lifetime-section>
<lifetime-example>
    <memory-row style="cursor: default;">
        <memory-backdrop>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">S</byte>
            <byte class="t">O</byte>
            <byte class="t">M</byte>
            <byte class="t">E</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">D</byte>
            <byte class="t">R</byte>
            <byte class="t">A</byte>
            <byte class="t">M</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">D</byte>
            <byte class="t">A</byte>
            <byte class="t">T</byte>
            <byte class="t">A</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <line-comment>Memória principal</line-comment>
        </memory-backdrop>
    </memory-row>
</lifetime-example>
</lifetime-section>

<lifetime-section>
<lifetime-example>
    <memory-row style="cursor: default;">
        <memory-backdrop>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">S</byte>
            <byte class="cpu1">O</byte>
            <byte class="cpu1">M</byte>
            <byte class="cpu1">E</byte>
            <container><tag>(E)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">D</byte>
            <byte class="cpu1">A</byte>
            <byte class="cpu1">T</byte>
            <byte class="cpu1">A</byte>
            <container><tag>(S)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>CPU1 Cache</line-comment>
        </memory-backdrop>
    </memory-row>
    <memory-row style="cursor: default;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2 borrowed">S</byte>
            <byte class="cpu2">R</byte>
            <byte class="cpu2">A</byte>
            <byte class="cpu2">M</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2">D</byte>
            <byte class="cpu2">A</byte>
            <byte class="cpu2">T</byte>
            <byte class="cpu2">A</byte>
            <container><tag>(S)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>CPU2 Cache</line-comment>
        </memory-backdrop>
    </memory-row>
</lifetime-example>
</lifetime-section>

<!-- end overflow -->
</div>
</div>

<footnotes>

As CPUs modernas não acessam a memória diretamente, apenas sua cache. Cada CPU tem seu próprio cache, 100x mais rápido que a RAM, mas muito menor. Ele vem em ** linhas de cache**,{{ link(url="https://stackoverflow.com/questions/3928995/how-do-cache-lines-work") }} algumas _sliced_ janela de bytes, que rastreiam se for um exclusivo (E), compartilhado (S) ou modificado (M) {{ link(url="https://en.wikipedia.org/wiki/MESI_protocol") }} vista da memória principal. Caches conversam entre si para garantir ** coerência**,{{ link(url="https://gfxcourses.stanford.edu/cs149/fall20content/media/cachecoherence/10_coherence.pdf")}}
ou seja, os dados 'pequenos-suficientes' serão 'imediatamente' vistos por todas as outras CPUs, mas isso pode atrasar a CPU.

</footnotes>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

<lifetime-section>
<lifetime-example class="not-first">
    <memory-row style="cursor: default;">
        <memory-backdrop>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">S</byte>
            <byte class="cpu1">O</byte>
            <byte class="cpu1">M</byte>
            <byte class="cpu1">E</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">D</byte>
            <byte class="cpu1 borrowed">X</byte>
            <byte class="cpu1">T</byte>
            <byte class="cpu1">A</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Cícle 1</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="t byte2 maybe-borrowed" style="left: 96px;">O3</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1">S</byte>
            <byte class="cpu1">O</byte>
            <byte class="cpu1">M</byte>
            <byte class="cpu1 borrowed">4</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2">D</byte>
            <byte class="cpu2">X</byte>
            <byte class="cpu2">T</byte>
            <byte class="cpu2">A</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Cícle 2</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="t byte2 borrowed" style="left: 96px;">23</value>
            <value class="stalled" style="left: 350px;">STALLED</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu1 borrowed">1</byte>
            <byte class="cpu1"></byte>
            <byte class="cpu1"></byte>
            <byte class="cpu1 borrowed">4</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2">D</byte>
            <byte class="cpu2">X</byte>
            <byte class="cpu2">T</byte>
            <byte class="cpu2 borrowed">Y</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Ciclo 3</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="t byte2 borrowed" style="left: 96px;">23</value>
        </values>
    </memory-row>
</lifetime-example>
</lifetime-section>

<!-- end overflow -->
</div>
</div>


<footnotes>

Esquerda: Ambos os compiladores _and_ CPUs são livres para **re-order** {{ link(url="https://en.wikipedia.org/wiki/Memory_ordering")}} e dividir o acesso de memória R/W. Mesmo se você disse explicitamente `write(1); write(23); write(4)`, seu compilador pode pensar que é uma boa idéia para escrever `23` primeiro; além disso, sua CPU pode insistir em dividir a escrita, fazendo `3` antes `2`. Cada uma dessas etapas poderia ser observável (até mesmo o _impossível_ `O3`) por CPU2 através de uma `unsafe` _data race_. A reordenação também é fatal para fechaduras.

Direito: Semi-relacionado, mesmo quando duas CPUs não tentam acessar dados um do outro (por exemplo, atualizar 2 variáveis independentes), eles ainda podem experimentar uma perda de desempenho significativa se a memória subjacente é mapeada por 2 linhas de cache (** compartilhamento falso**).{{ link(url="https://docs.kernel.org/kernel-hacking/false-sharing.html")}}

</footnotes>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

<lifetime-section>
<lifetime-example class="not-first">
    <memory-row style="cursor: default;">
        <memory-backdrop>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">1</byte>
            <byte class="t">2</byte>
            <byte class="t">3</byte>
            <byte class="t">4</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">S</byte>
            <byte class="t">R</byte>
            <byte class="t">A</byte>
            <byte class="t">M</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte class="t">D</byte>
            <byte class="t">X</byte>
            <byte class="t">T</byte>
            <byte class="t">Y</byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <byte></byte>
            <line-comment>Memória principal</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="atomic byte2" style="left: 246px;">RA</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default; margin-top: 40px;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2 borrowed">1</byte>
            <byte class="cpu2">R</byte>
            <byte class="cpu2">A</byte>
            <byte class="cpu2">M</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Ciclo 4</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="atomic byte2" style="left: 246px;">RA</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default; margin-top: 40px;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2 borrowed">1</byte>
            <byte class="cpu2">2</byte>
            <byte class="cpu2"></byte>
            <byte class="cpu2">M</byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Ciclo 5</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="atomic byte2 borrowed" style="left: 246px;">23</value>
        </values>
    </memory-row>
    <memory-row style="cursor: default; margin-top: 40px;">
        <memory-backdrop style="margin-top: 4px;">
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="cpu2 borrowed">1</byte>
            <byte class="cpu2">2</byte>
            <byte class="cpu2">3</byte>
            <byte class="cpu2 borrowed">4</byte>
            <container><tag>(M)</tag></container>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <byte class="hide"></byte>
            <line-comment>Ciclo 6</line-comment>
        </memory-backdrop>
        <values class="freestanding">
            <value class="atomic byte2 borrowed" style="left: 246px;">23</value>
        </values>
    </memory-row>
</lifetime-example>
</lifetime-section>

<!-- end overflow -->
</div>
</div>


<footnotes>

A Atomics aborda as questões acima, fazendo duas coisas, eles

- certificar-se de que uma leitura / gravação / atualização não é parcialmente observável, bloqueando temporariamente linhas de cache em outras CPUs,
- Forçar tanto o compilador quanto a CPU a não reordenar o acesso _'não relacionado'_ ao seu redor (i.e., atuar como uma **fence** {{ std(page="std/sync/atomic/fn.fence.html")}}). Garantir que várias CPUs concordem com a ordem relativa dessas outras ops é chamada de **consistência**. {{ link(url="https://gfxcourses.stanford.edu/cs149/winter19content/lectures/09_consistency/09_consistency_slides.pdf" )}} Isto também vem a um custo de otimizações de desempenho perdidas.

</footnotes>


{{ tablesep() }}

> **Nota** &mdash; A seção acima é muito simplificada. Enquanto as questões de coerência e consistência são universais, arquiteturas de CPU diferem muito em como eles implementam caching e atômicos, e em seu impacto de desempenho.





{{ tablesep() }}

<div class="color-header atomics">

| {{ tab() }} A. Ordenação  | Explicação |
| --- | --- |
| **`Relaxed`** {{ std(page="std/sync/atomic/enum.Ordering.html#variant.Relaxed") }} | Reordenamento completo. R/W não relacionado pode ser livremente embaralhado em torno do atômico. |
| **`Release`** {{ std(page="std/sync/atomic/enum.Ordering.html#variant.Release") }}<sup>, 1</sup> | Ao escrever, certifique-se de outros dados carregados por 3<sup>rd</sup> festa `Acquire` é visto depois desta escrita. |
| **`Acquire`** {{ std(page="std/sync/atomic/enum.Ordering.html#variant.Acquire") }}<sup>, 1</sup> | Ao ler, garante outros dados escritos antes de 3<sup>rd</sup> festa `Release` é visto depois desta leitura. |
| **`SeqCst`** {{ std(page="std/sync/atomic/enum.Ordering.html#variant.SeqCst") }} | Nada de reordenar ao redor do atômico. Todas as leituras e escritos não relacionados ficam do lado certo. |

</div>

<footnotes>

<sup>1</sup> Para ficar claro, ao sincronizar o acesso de memória com 2+ CPUs, _all_ deve usar `Acquire` ou `Release` (ou mais forte). O escritor deve garantir que todos os outros dados que deseja _release_ na memória sejam colocados antes do sinal atômico, enquanto os leitores que desejam _adquire_ estes dados devem garantir que suas outras leituras só sejam feitas após o sinal atômico.

</footnotes>
