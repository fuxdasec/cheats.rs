+++
title = "Tipos da biblioteca padrão"
description = "Organização da memória dos tipos comuns da biblioteca padrão de Rust, coleções, strings e ponteiros inteligentes."
weight = 22
template = "topic.html"

[extra]
seo_title = "Tipos da biblioteca padrão"
anchor = "standard-library-types"
print = true
translation_of = "memory-layout/standard-library-types.md"
source_hash = "a7d03a501d23a268d9155880d889ede75fb5be977ed6d15a2025617b63ec776a"
+++
A biblioteca padrão de Rust combina os tipos primitivos acima em tipos úteis com semânticas específicas, por exemplo:



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>Option&lt;T&gt;</code> {{ std(page="std/option/enum.Option.html") }}</name>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
    </visual>
    <andor>ou</andor>
    <visual class="enum">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 100px;">
            <code>T</code>
        </framed>
    </visual>
    <description>A etiqueta pode ser omitida para <br> certos T, como <code>NonNull</code>.{{ std(page="std/ptr/struct.NonNull.html") }}</description>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>Result&lt;T, E&gt;</code> {{ std(page="std/result/enum.Result.html") }}</name>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 50px;">
            <code>E</code>
        </framed>
    </visual>
    <andor>ou</andor>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 100px;">
            <code>T</code>
        </framed>
    </visual>
    <description>Contém um erro <code>E</code> ou um valor<br>de <code>T</code>.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>ManuallyDrop&lt;T&gt;</code> {{ std(page="std/mem/struct.ManuallyDrop.html") }}</name>
    <visual>
           <framed class="any unsized"  style="width: 100px;"><code>T</code></framed>
    </visual>
    <description>Impede a chamada<code>T::drop()</code>de <br>.</description>
</datum>

<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>AtomicUsize</code> {{ std(page="std/sync/atomic/index.html") }}</name>
    <visual class="atomic">
        <ptr class="atomic">
            <code>usize</code><sub>2/4/8</sub>
        </ptr>
    </visual>
    <description>Outros tipos atômicos são semelhantes.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>MaybeUninit&lt;T&gt;</code><span style="position: absolute;"> {{ std(page="std/mem/union.MaybeUninit.html") }}</span></name>
    <visual class="enum">
        <framed class="uninit" style="width: 100px;">
            <code>U̼̟̔͛n̥͕͐͞d̛̲͔̦̳̑̓̐e̱͎͒̌fị̱͕̈̉͋ne̻̅ḓ̓</code>
        </framed>
    </visual>
    <andor>ou inseguro</andor>
    <visual class="enum">
        <framed class="any" style="width: 100px;">
            <code>T</code>
        </framed>
    </visual>
    <description>Memória não inicializada ou<br>algum <code>T</code>. Única forma válida<br>de trabalhar com dados não inicializados.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>PhantomData&lt;T&gt;</code> {{ std(page="std/marker/struct.PhantomData.html") }}</name>
    <visual style="width: 15px;" class="zst">
        <code></code>
    </visual>
    <description>Auxiliar de tamanho zero para conter<br>lifetimes que não seriam utilizadas.</description>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>Pin&lt;P&gt;</code> {{ std(page="std/pin/struct.Pin.html") }}</name>
    <visual style="width: 90px;">
        <framed class="any" style="width: 80px;">
           <code>P</code>
        </framed>
    </visual>
    <memory-entry class="double">
        <memory-link style="left:24%;">|</memory-link>
        <memory class="anymem pinned" style="opacity: 0.8; font-size: 11pt;">
            <span style="position:absolute; right: -14px; top: -16px;">📌</span>
            <framed class="any" style="width: 130px;"><code>P::Deref</code></framed>
        </memory>
    </memory-entry>
    <!-- <description>Signals <code>*p</code> this <code>P</code> pins<br>will never(!) move again<br> unless it's <code>Unpin</code>.{{ std(page="std/marker/trait.Unpin.html") }}</description> -->
    <description>Indica que o destino de <code>P</code> está fixado para sempre,<br>mesmo após a lifetime de <code>Pin</code>. O valor interno<br> não pode ser movido para fora (mas pode ser<br> substituído), a menos que seja <code>Unpin</code>.{{ std(page="std/marker/trait.Unpin.html") }}</description>
</datum>

> {{bad()}} Todas as representações são apenas **ilustrativas**.
> Os campos devem existir na versão mais recente de `stable`, mas Rust não garante seus layouts. Você não deve
> tentar acessá-los de forma _insegura_, a menos que a documentação permita.

{{ tablesep() }}


### Células {#cells}


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>UnsafeCell&lt;T&gt;</code> {{ std(page="std/cell/struct.UnsafeCell.html") }}</name>
    <visual class="cell">
           <framed class="any unsized"><code>T</code></framed>
    </visual>
    <description>Tipo especial que permite <br>mutabilidade com aliases.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>Cell&lt;T&gt;</code> {{ std(page="std/cell/struct.Cell.html") }}</name>
    <visual>
           <framed class="any unsized celled"><code>T</code></framed>
    </visual>
    <description>Permite mover valores de <code>T</code><br> para dentro<br> e para fora.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>RefCell&lt;T&gt;</code> {{ std(page="std/cell/struct.RefCell.html") }}</name>
    <visual>
        <sized class="celled"><code>borrowed</code></sized>
        <framed class="any unsized celled"><code>T</code></framed>
    </visual>
    <description>Também permite empréstimos<br>
    dinâmicos de <code>T</code>. Como <code>Cell</code>, é<br>
    <code>Send</code>, mas não <code>Sync</code>.</description>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>OnceCell&lt;T&gt;</code> {{ std(page="std/cell/struct.OnceCell.html") }}</name>
    <div class="celled" style="border-radius: 8px;">
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
    </visual>
    <andor>ou</andor>
    <visual class="enum">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 80px;">
            <code>T</code>
        </framed>
    </visual>
    </div>
    <description>Inicializada no máximo uma vez.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>LazyCell&lt;T, F&gt;</code> {{ std(page="std/cell/struct.LazyCell.html") }}</name>
    <div class="celled" style="border-radius: 8px;">
    <visual class="enum">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 80px;">
            <code>Uninit&lt;F&gt;</code>
        </framed>
    </visual>
    <andor>ou</andor>
    <visual class="enum">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 80px;">
            <code>Init&lt;T&gt;</code>
        </framed>
    </visual>
    <andor>ou</andor>
    <visual class="enum">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 80px;">
            <code>Poisoned</code>
        </framed>
    </visual>
    </div>
    <description>Inicializada no primeiro acesso.</description>
</datum>



{{ tablesep() }}


### Coleções que preservam a ordem {#order-preserving-collections}



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>Box&lt;T&gt;</code> {{ std(page="std/boxed/struct.Box.html") }}</name>
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <payload>
            <code>meta</code><sub>2/4/8</sub>
        </payload>
    </visual>
    <memory-entry>
        <memory-link style="left:49%;">|</memory-link>
        <memory class="heap">
        <framed class="any unsized"><code>T</code></framed>
        </memory>
    </memory-entry>
    <description>Para alguns <code>T</code>, o representante na stack pode conter <br>metadados{{ above (target="/memory-layout/custom-types/#custom-types") }} (como <code>Box<[T]></code>).</description>
</datum>

<spacer>
</spacer>

<!-- NEW ENTRY -->
<datum>
    <name><code>Vec&lt;T&gt;</code> {{ std(page="std/vec/struct.Vec.html") }}</name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
        <sized>
            <code>capacity</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry class="double">
        <memory-link style="left:25%;">|</memory-link>
        <memory class="heap capacity">
            <div>
                <framed class="any t"><code>T</code></framed>
                <framed class="any t"><code>T</code></framed>
                <note>… len</note>
            </div>
            <capacity>← <note>capacity</note> →</capacity>
        </memory>
    </memory-entry>
    <description>Vetor comum, um <i>array expansível</i> de um único tipo.</description>
</datum>

<spacer>
</spacer>


<!-- NEW ENTRY -->
<datum>
    <name><code>LinkedList&lt;T&gt;</code> {{ std(page="std/collections/struct.LinkedList.html") }}{{ esoteric() }} </name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual>
        <ptr>
           <code>head</code><sub>2/4/8</sub>
        </ptr>
        <ptr>
           <code>tail</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry style="width: 265px; left:0%; display: block;">
        <memory-link style="left:25%;">|</memory-link>
        <memory-link style="left:50%;">|</memory-link>
        <memory class="heap capacity">
            <ptr>
            <code>next</code><sub>2/4/8</sub>
            </ptr>
            <ptr>
            <code>prev</code><sub>2/4/8</sub>
            </ptr>
            <framed class="any t"><code>T</code></framed>
        </memory>
    </memory-entry>
    <description>Os elementos <code>head</code> e <code>tail</code> são <code>null</code> ou apontam para nós<br> na heap. Cada nó pode apontar para seus nós <code>prev</code> e <code>next</code>.<br>Prejudica o cache (basta olhar!); só use se houver<br> necessidade comprovada. {{ bad() }} </description>
</datum>


<spacer>
</spacer>



<!-- NEW ENTRY -->
<datum>
    <name><code>VecDeque&lt;T&gt;</code> {{ std(page="std/collections/struct.VecDeque.html") }}</name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual>
        <sized>
            <code>head</code><sub>2/4/8</sub>
        </sized>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>capacity</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry></memory-entry>
    <memory-entry></memory-entry>
    <memory-entry class="double">
        <memory-link style="left:25%;">|</memory-link>
        <memory class="heap capacity">
            <div>
                <!-- <framed class="any t"><code>T<sub>x</sub></code></framed> -->
                <framed class="any t"><code>T</code></framed>
                <!-- <framed class="any t"><code>T</code></framed> -->
                <note>… vazio …</note>
                <framed class="any t"><code>T&#x2063;<sup>H</sup></code></framed>
            </div>
            <capacity>← <note>capacity</note> →</capacity>
        </memory>
    </memory-entry>
    <description>O índice <code>head</code> seleciona uma posição no buffer circular. O conteúdo pode ser<br> descontínuo e ter espaços vazios no meio, como no exemplo acima.</description>
</datum>



{{ tablesep() }}

### Outras coleções {#other-collections}


<!-- NEW ENTRY -->
<datum>
    <name><code>HashMap&lt;K, V&gt;</code> {{ std(page="std/collections/struct.HashMap.html") }}</name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual>
        <sized>
            <code>bmask</code><sub>2/4/8</sub>
        </sized>
        <ptr>
           <code>ctrl</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>left</code><sub>2/4/8</sub>
        </sized>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry></memory-entry>
    <memory-entry style="width: 265px; left:-5%">
        <memory-link style="left:25%;">|</memory-link>
        <memory class="heap oversimplified">
            <framed class="any t"><code>K:V</code></framed>
            <framed class="any t"><code>K:V</code></framed>
            …
            <framed class="any t"><code>K:V</code></framed>
            …
            <framed class="any t"><code>K:V</code></framed>
            <capacity><note style="font-weight: bolder;">Representação simplificada!</note></capacity>
        </memory>
    </memory-entry>
    <description>Armazena chaves e valores na heap conforme seu hash; <a href="https://www.youtube.com/watch?v=ncHmEUmJZf4">SwissTable</a> <br> implementada via <a href="https://github.com/rust-lang/hashbrown">hashbrown</a>. <code>HashSet</code> {{ std(page="std/collections/struct.HashSet.html") }} é idêntico a <code>HashMap</code>; <br>apenas o tipo <code>V</code> desaparece. A visão da heap é muito simplificada. {{bad()}} </description>
</datum>


<spacer>
</spacer>

<!-- NEW ENTRY -->
<datum>
    <name><code>BinaryHeap&lt;T&gt;</code> {{ std(page="std/collections/struct.BinaryHeap.html") }}</name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>capacity</code><sub>2/4/8</sub>
        </sized>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry style="width: 265px">
        <memory-link style="left:20%;">|</memory-link>
        <memory class="heap capacity">
            <div>
                <framed class="any t"><code>T&#x2063;<sup style="color:black; font-weight: bolder;">0</sup></code></framed>
                <framed class="any t" style="background-color: #f9b172;"><code>T&#x2063;<sup style="color:black; font-weight: bolder;">1</sup></code></framed>
                <framed class="any t" style="background-color: #f9b172;"><code>T&#x2063;<sup style="color:black; font-weight: bolder;">1</sup></code></framed>
                <framed class="any t" style="background-color: #f9d372;"><code>T&#x2063;<sup style="color:black; font-weight: bolder;">2</sup></code></framed>
                <framed class="any t" style="background-color: #f9d372;"><code>T&#x2063;<sup style="color:black; font-weight: bolder;">2</sup></code></framed>
                <note>… len</note>
            </div>
            <capacity>← <note>capacity</note> →</capacity>
        </memory>
    </memory-entry>
    <description>Heap armazenada como array, com <code>2<sup>N</sup></code> elementos por nível. Cada <code>T</code> <br>
    pode ter 2 filhos no nível abaixo. Cada <code>T</code> é maior que seus<br>
    filhos.</description>
</datum>



### Strings com propriedade {#owned-strings}


<!-- NEW ENTRY -->
<datum>
    <name><code>String</code> {{ std(page="std/string/struct.String.html") }}</name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>capacity</code><sub>2/4/8</sub>
        </sized>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry class="double">
        <memory-link style="left:25%;">|</memory-link>
        <memory class="heap">
            <div>
                <byte class="bytes"><code>U</code></byte>
                <byte class="bytes"><code>T</code></byte>
                <byte class="bytes"><code>F</code></byte>
                <byte class="bytes"><code>-</code></byte>
                <byte class="bytes"><code>8</code></byte>
                <note>… len</note>
            </div>
            <capacity>← <note>capacity</note> →</capacity>
        </memory>
    </memory-entry>
    <description>Observe como <code>String</code> difere de <code>&str</code> e <code>&[char]</code>.</description>
</datum>

<spacer>
</spacer>

<!-- NEW ENTRY -->
<datum>
    <name><code>CString</code> {{ std(page="std/ffi/struct.CString.html") }}</name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual>
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <sized>
            <code>len</code><sub>2/4/8</sub>
        </sized>
    </visual>
    <memory-entry class="double">
        <memory-link style="left:25%;">|</memory-link>
        <memory class="heap">
            <div>
                <byte class="bytes"><code>A</code></byte>
                <byte class="bytes"><code>B</code></byte>
                <byte class="bytes"><code>C</code></byte>
                <note>… len …</note>
                <byte class="bytes"><code>∅</code></byte>
            </div>
        </memory>
    </memory-entry>
    <description>Terminada em NUL, sem NUL no meio.</description>
</datum>


<spacer>
</spacer>

<!-- NEW ENTRY -->
<datum>
    <name><code>OsString</code> {{ std(page="std/ffi/struct.OsString.html") }}</name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual class="platformdefined">
        Definido pela plataforma
    </visual>
    <memory-entry class="double">
        <memory-link style="left:25%;">|</memory-link>
        <memory class="heap">
            <div>
                <byte class="bytes"><code> </code></byte>
                <byte class="bytes"><code> </code></byte>
                /
                <word class="bytes"><code> </code></word>
                <word class="bytes"><code> </code></word>
            </div>
        </memory>
    </memory-entry>
    <description>Encapsula como o sistema operacional<br> representa strings (como <a href="https://simonsapin.github.io/wtf-8/">WTF-8</a> no <br>Windows).</description>
</datum>

<spacer>
</spacer>

<!-- NEW ENTRY -->
<datum>
    <name><code>PathBuf</code> {{ std(page="std/path/struct.PathBuf.html") }}</name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual class="platformdefined" style="width: 100px;">
        <payload>
            <code>OsString</code>
        </payload>
    </visual>
    <memory-entry class="double">
        <memory-link style="left:40%;">|</memory-link>
        <memory class="heap">
            <div>
                <byte class="bytes"><code> </code></byte>
                <byte class="bytes"><code> </code></byte>
                /
                <word class="bytes"><code> </code></word>
                <word class="bytes"><code> </code></word>
            </div>
        </memory>
    </memory-entry>
    <description>Encapsula como o sistema operacional<br> representa caminhos.</description>
</datum>


{{ tablesep() }}

### Propriedade compartilhada {#shared-ownership}

Se o tipo não contiver um `Cell` para `T`, ele costuma ser combinado com um dos tipos `Cell` acima para permitir mutabilidade compartilhada na prática.

<!-- NEW ENTRY -->
<datum>
    <name><code>Rc&lt;T&gt;</code> {{ std(page="std/rc/struct.Rc.html") }}</name>
    <visual style="width: 180px;">
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <payload>
            <code>meta</code><sub>2/4/8</sub>
        </payload>
    </visual>
    <div>
        <memory-entry class="quad">
            <memory-link style="left:15%;">|</memory-link>
            <memory class="heap">
                <sized class="celled"><code>strng</code><sub>2/4/8</sub></sized>
                <sized class="celled"><code>weak</code><sub>2/4/8</sub></sized>
                <framed class="any unsized"><code>T</code></framed>
            </memory>
        </memory-entry>
    </div>
    <description>Compartilha a propriedade de <code>T</code> na mesma thread. Precisa de <code>Cell</code>
    <br>ou <code>RefCell</code>interno para permitir mutação. Não é <code>Send</code> nem <code>Sync</code>.</description>
</datum>


<!-- NEW ENTRY -->
<datum>
    <name><code>Arc&lt;T&gt;</code> {{ std(page="std/sync/struct.Arc.html") }}</name>
    <visual style="width: 180px;">
        <ptr>
           <code>ptr</code><sub>2/4/8</sub>
        </ptr>
        <payload>
            <code>meta</code><sub>2/4/8</sub>
        </payload>
    </visual>
    <div style="width: 0px;">
        <memory-entry class="quad">
            <memory-link style="left:15%;">|</memory-link>
            <memory class="heap">
                <sized class="atomicx"><code>strng</code><sub>2/4/8</sub></sized>
                <sized class="atomicx"><code>weak</code><sub>2/4/8</sub></sized>
                <framed class="any unsized"><code>T</code></framed>
            </memory>
        </memory-entry>
    </div>
    <description>Idem, mas permite compartilhar entre threads SE o<br>
    <code>T</code> contido for <code>Send</code> e <code>Sync</code>.</description>
</datum>

<br>

<!-- NEW ENTRY -->
<datum>
    <name><code>Mutex&lt;T&gt;</code> {{ std(page="std/sync/struct.Mutex.html") }} / <code>RwLock&lt;T&gt;</code> {{ std(page="std/sync/struct.RwLock.html") }}</name>
    <visual style="width: 230px;">
        <payload><code>inner</code></payload>
        <sized class="atomicx"><code>poison</code><sub>2/4/8</sub></sized>
        <framed class="any unsized celled"><code>T</code></framed>
    </visual>
    <description>Os campos internos dependem da plataforma. Precisa <br>estar dentro de <code>Arc</code> para ser compartilhado entre<br>threads independentes, ou
    via <code>scope()</code> {{ std(page="std/thread/fn.scope.html") }} para threads com escopo.
    </description>
</datum>

<spacer>
</spacer>
<spacer>
</spacer>

<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>Cow&lt;'a, T&gt;</code> {{ std(page="std/borrow/enum.Cow.html") }}</name>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
        <framed class="any unsized" style="width: 100px; text-align: center;">
            <code>T::Owned</code>
        </framed>
    </visual>
    <andor>ou</andor>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
        <framed class="ptr" style="width: 50px;">
           <code>ptr</code><sub>2/4/8</sub>
        </framed>
    </visual>
    <div>
        <memory-entry style="width: 40px;"></memory-entry>
        <memory-entry>
            <memory-link style="left:15%;">|</memory-link>
            <memory class="anymem">
                <framed class="any unsized"><code>T</code></framed>
            </memory>
        </memory-entry>
    </div>
    <description>Contém uma referência somente leitura a<br>algum <code>T</code>, ou possui seu equivalente <code>ToOwned</code> {{ std( page = "std/borrow/trait.ToOwned.html") }} <br>.</description>
</datum>
