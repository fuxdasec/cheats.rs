+++
title = "Standard Library Types"
description = "Memory layouts of common Rust standard library types, collections, strings, and smart pointers."
weight = 22
template = "topic.html"

[extra]
seo_title = "Standard Library Types"
anchor = "standard-library-types"
previous = "/memory-layout/closures/"
previous_title = "Closures"
next = "/standard-library/one-liners/"
next_title = "One-Liners"
print = true
+++
Rust's standard library combines the above primitive types into useful types with special semantics, e.g.:



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>Option&lt;T&gt;</code> {{ std(page="std/option/enum.Option.html") }}</name>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
    </visual>
    <andor>or</andor>
    <visual class="enum">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 100px;">
            <code>T</code>
        </framed>
    </visual>
    <description>Tag may be omitted for <br> certain T, e.g., <code>NonNull</code>.{{ std(page="std/ptr/struct.NonNull.html") }}</description>
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
    <andor>or</andor>
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 100px;">
            <code>T</code>
        </framed>
    </visual>
    <description>Either some error <code>E</code> or value<br>of <code>T</code>.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>ManuallyDrop&lt;T&gt;</code> {{ std(page="std/mem/struct.ManuallyDrop.html") }}</name>
    <visual>
           <framed class="any unsized"  style="width: 100px;"><code>T</code></framed>
    </visual>
    <description>Prevents <code>T::drop()</code> from<br>being called.</description>
</datum>

<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>AtomicUsize</code> {{ std(page="std/sync/atomic/index.html") }}</name>
    <visual class="atomic">
        <ptr class="atomic">
            <code>usize</code><sub>2/4/8</sub>
        </ptr>
    </visual>
    <description>Other atomic similarly.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>MaybeUninit&lt;T&gt;</code><span style="position: absolute;"> {{ std(page="std/mem/union.MaybeUninit.html") }}</span></name>
    <visual class="enum">
        <framed class="uninit" style="width: 100px;">
            <code>U̼̟̔͛n̥͕͐͞d̛̲͔̦̳̑̓̐e̱͎͒̌fị̱͕̈̉͋ne̻̅ḓ̓</code>
        </framed>
    </visual>
    <andor>unsafe or</andor>
    <visual class="enum">
        <framed class="any" style="width: 100px;">
            <code>T</code>
        </framed>
    </visual>
    <description>Uninitialized memory or<br>some <code>T</code>. Only legal way<br>to work with uninit data.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>PhantomData&lt;T&gt;</code> {{ std(page="std/marker/struct.PhantomData.html") }}</name>
    <visual style="width: 15px;" class="zst">
        <code></code>
    </visual>
    <description>Zero-sized helper to hold<br>otherwise unused lifetimes.</description>
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
    <description>Signals tgt. of <code>P</code> is pinned 'forever'<br>even past lt. of <code>Pin</code>. Value within<br> may not be moved out (but new<br> one moved in), unless <code>Unpin</code>.{{ std(page="std/marker/trait.Unpin.html") }}</description>
</datum>

> {{bad()}} All depictions are for **illustrative** purposes only.
> The fields should exist in latest `stable`, but Rust makes no guarantees about their layouts, and you must not
> attempt to _unsafely_ access anything unless the docs allow it.

{{ tablesep() }}


### Cells


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>UnsafeCell&lt;T&gt;</code> {{ std(page="std/cell/struct.UnsafeCell.html") }}</name>
    <visual class="cell">
           <framed class="any unsized"><code>T</code></framed>
    </visual>
    <description>Magic type allowing <br>aliased mutability.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>Cell&lt;T&gt;</code> {{ std(page="std/cell/struct.Cell.html") }}</name>
    <visual>
           <framed class="any unsized celled"><code>T</code></framed>
    </visual>
    <description>Allows <code>T</code>'s<br> to move in<br> and out.</description>
</datum>


<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>RefCell&lt;T&gt;</code> {{ std(page="std/cell/struct.RefCell.html") }}</name>
    <visual>
        <sized class="celled"><code>borrowed</code></sized>
        <framed class="any unsized celled"><code>T</code></framed>
    </visual>
    <description>Also support dynamic<br>
    borrowing of <code>T</code>. Like <code>Cell</code> this<br>
    is <code>Send</code>, but not <code>Sync</code>.</description>
</datum>



<!-- NEW ENTRY -->
<datum class="spaced">
    <name><code>OnceCell&lt;T&gt;</code> {{ std(page="std/cell/struct.OnceCell.html") }}</name>
    <div class="celled" style="border-radius: 8px;">
    <visual class="enum" style="text-align: left;">
        <pad><code>Tag</code></pad>
    </visual>
    <andor>or</andor>
    <visual class="enum">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 80px;">
            <code>T</code>
        </framed>
    </visual>
    </div>
    <description>Initialized at most once.</description>
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
    <andor>or</andor>
    <visual class="enum">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 80px;">
            <code>Init&lt;T&gt;</code>
        </framed>
    </visual>
    <andor>or</andor>
    <visual class="enum">
        <pad><code>Tag</code></pad>
        <framed class="any" style="width: 80px;">
            <code>Poisoned</code>
        </framed>
    </visual>
    </div>
    <description>Initialized on first access.</description>
</datum>



{{ tablesep() }}


### Order-Preserving Collections



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
    <description>For some <code>T</code> stack proxy may carry <br>meta{{ above (target="/memory-layout/custom-types/#custom-types") }} (e.g., <code>Box<[T]></code>).</description>
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
    <description>Regular <i>growable array</i> vector of single type.</description>
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
    <description>Elements <code>head</code> and <code>tail</code> both <code>null</code> or point to nodes on<br> the heap. Each node can point to its <code>prev</code> and <code>next</code> node.<br>Eats your cache (just look at the thing!); don't use unless<br> you evidently must. {{ bad() }} </description>
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
                <note>… empty …</note>
                <framed class="any t"><code>T&#x2063;<sup>H</sup></code></framed>
            </div>
            <capacity>← <note>capacity</note> →</capacity>
        </memory>
    </memory-entry>
    <description>Index <code>head</code> selects in array-as-ringbuffer. This means content may be<br> non-contiguous and empty in the middle, as exemplified above.</description>
</datum>



{{ tablesep() }}

### Other Collections


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
            <capacity><note style="font-weight: bolder;">Oversimplified!</note></capacity>
        </memory>
    </memory-entry>
    <description>Stores keys and values on heap according to hash value, <a href="https://www.youtube.com/watch?v=ncHmEUmJZf4">SwissTable</a> <br> implementation via <a href="https://github.com/rust-lang/hashbrown">hashbrown</a>. <code>HashSet</code> {{ std(page="std/collections/struct.HashSet.html") }} identical to <code>HashMap</code>, <br>just type <code>V</code> disappears. Heap view grossly oversimplified. {{bad()}} </description>
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
    <description>Heap stored as array with <code>2<sup>N</sup></code> elements per layer. Each <code>T</code> <br>
    can have 2 children in layer below. Each <code>T</code> larger than its<br>
    children.</description>
</datum>



### Owned Strings


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
    <description>Observe how <code>String</code> differs from <code>&str</code> and <code>&[char]</code>.</description>
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
    <description>NUL-terminated but w/o NUL in middle.</description>
</datum>


<spacer>
</spacer>

<!-- NEW ENTRY -->
<datum>
    <name><code>OsString</code> {{ std(page="std/ffi/struct.OsString.html") }}</name>
    <!-- For some reason we need the width for mobile not to line break -->
    <visual class="platformdefined">
        Platform Defined
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
    <description>Encapsulates how operating system<br> represents strings (e.g., <a href="https://simonsapin.github.io/wtf-8/">WTF-8</a> on <br>Windows).</description>
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
    <description>Encapsulates how operating system<br> represents paths.</description>
</datum>


{{ tablesep() }}

### Shared Ownership

If the type does not contain a `Cell` for `T`, these are often combined with one of the `Cell` types above to allow shared de-facto mutability.

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
    <description>Share ownership of <code>T</code> in same thread. Needs nested <code>Cell</code>
    <br>or <code>RefCell</code>to allow mutation. Is neither <code>Send</code> nor <code>Sync</code>.</description>
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
    <description>Same, but allow sharing between threads IF contained<br>
    <code>T</code> itself is <code>Send</code> and <code>Sync</code>.</description>
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
    <description>Inner fields depend on platform. Needs to be <br>held in <code>Arc</code> to be shared between decoupled<br>threads, or
    via <code>scope()</code> {{ std(page="std/thread/fn.scope.html") }} for scoped threads.
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
    <andor>or</andor>
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
    <description>Holds read-only reference to<br>some <code>T</code>, or owns its <code>ToOwned</code> {{ std( page = "std/borrow/trait.ToOwned.html") }} <br>analog.</description>
</datum>
