+++
title = "Segurança entre threads"
description = "Comportamento de Send e Sync em Rust para valores comuns, referências, ponteiros e tipos da biblioteca padrão."
weight = 24
template = "topic.html"

[extra]
seo_title = "Segurança entre threads"
anchor = "thread-safety"
print = true
translation_of = "standard-library/thread-safety.md"
source_hash = "235e6f89a7ccfd3b99590b91fdb8568cd0a96e76400c1f6e9b4f7b4ce04eed28"
+++

Suponha que você tenha algumas variáveis no Thread 1, e queira quer **movê-las para o Thread 2, ou passar suas **referências** para o Thread 3.
Se isto é permitido é governado por **`Send`**{{ std(page="std/marker/trait.Send.html") }} e **`Sync`**{{ std(page="std/marker/trait.Sync.html") }} respetivamente:

{{ tablesep() }}

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto; padding-top: 10px;">
<div style="min-width: 100%; width: 650px; ">
<div class="color-header number">


<threading-section>
    <thread-row>
        <thread-backdrop><hr></thread-backdrop>
        <values>
            <value class="both" style="left: 57px;"><thread-link>|<br>|<br>|</thread-link>&nbsp;Mutex&lt;u32&gt;</value>
            <value class="one" style="left: 97.5px;"><thread-link>|<br>|<br>|</thread-link>&nbsp;Cell&lt;u32&gt;</value>
            <value class="one" style="left: 137.5px;"><thread-link>|<br>|<br>|</thread-link>&nbsp;MutexGuard&lt;u32&gt;</value>
            <value class="none" style="left: 177.5px;"><thread-link>|<br>|<br>|</thread-link>&nbsp;Rc&lt;u32&gt;</value>
        </values>
        <subtext><blank-background>Tópico 1</blank-background></subtext>
    </thread-row>
    <thread-row>
        <thread-backdrop><hr></thread-backdrop>
        <values>
            <value class="both" style="left: 77px;">&nbsp;Mutex&lt;u32&gt;</value>
            <value class="one" style="left: 117.5px;">&nbsp;Cell&lt;u32&gt;</value>
            <value class="disabled" style="left: 157.5px;">&nbsp;MutexGuard&lt;u32&gt;</value>
            <value class="disabled" style="left: 197.5px;">&nbsp;Rc&lt;u32&gt;</value>
        </values>
        <subtext><blank-background>Tópico 2</blank-background></subtext>
    </thread-row>
    <thread-row>
        <thread-backdrop><hr></thread-backdrop>
        <values>
            <value class="both" style="left: 77px;"><b>&</b>Mutex&lt;u32&gt;</value>
            <value class="disabled" style="left: 117.5px;"><b>&</b>Cell&lt;u32&gt;</value>
            <value class="one" style="left: 157.5px;"><b>&</b>MutexGuard&lt;u32&gt;</value>
            <value class="disabled" style="left: 197.5px;"><b>&</b>Rc&lt;u32&gt;</value>
        </values>
        <subtext><blank-background>Tópico 3</blank-background></subtext>
    </thread-row>
</threading-section>

</div>
</div>
</div>

{{ tablesep() }}

<div class="color-header sendsync">

| Exemplo | Explicação |
| --- | --- |
| **`Mutex<u32>`** | Ambos `Send` e `Sync`. Você pode seguramente passar ou emprestá-lo a outro fio. |
| **`Cell<u32>`** | `Send`, não `Sync`Movable, mas sua referência permitiria escrever simultaneamente não-atômico. |
| **`MutexGuard<u32>`** | `Sync`, mas não `Send`. Bloquear amarrado ao thread, mas o uso de referência não pôde permitir a corrida de dados. |
| **`Rc<u32>`** | Nem porque é facilmente clonable heap-proxy com contadores não-atômicos. |

</div>

{{ tablesep() }}

<!-- Shamelessly stolen from https://www.reddit.com/r/rust/comments/ctdkyr/understanding_sendsync/exk8grg/ -->
<table class="sendsync">
    <thead>
        <tr><th>Traço</th><th><code>Send</code></th><th><code>!Send</code></th></tr>
    </thead>
    <tbody>
        <tr><td><code>Sync</code></td><td><i>A maioria dos tipos</i> … <code>Arc&lt;T&gt;</code><sup>1,2</sup>, <code>Mutex&lt;T&gt;</code><sup>2</sup></td><td><code>MutexGuard&lt;T&gt;</code><sup>1</sup>, <code>RwLockReadGuard&lt;T&gt;</code><sup>1</sup></td></tr>
        <tr><td><code>!Sync</code></td><td><code>Cell&lt;T&gt;</code><sup>2</sup>, <code>RefCell&lt;T&gt;</code><sup>2</sup></td><td><code>Rc&lt;T&gt;</code>, <code>&dyn Trait</code>, <code>*const T</code><sup>3</sup></td></tr>
    </tbody>
</table>

<footnotes>

<sup>1</sup> Se `T` é `Sync`. <br>
<sup>2</sup> Se `T` é `Send`. <br>
<sup>3</sup> Se você precisar enviar um ponteiro bruto, crie um novo tipo `struct Ptr(*const u8)` e `unsafe impl Send for Ptr {}`Assegure-se de que pode enviá-lo.

</footnotes>

{{ tablesep() }}

<div class="color-header sendsync">

| Quando é que... | ... Send? |
| --- | --- |
| `T` | Todos os campos contidos são `Send`, ou `unsafe` impl'ed. |
| {{ tab() }}`struct S { ... }` | Todos os campos são `Send`, ou `unsafe` impl'ed. |
| {{ tab() }}`struct S<T> { ... }` | Todos os campos são `Send` e T é `Send`, ou `unsafe` impl'ed. |
| {{ tab() }}`enum E { ... }` | Todos os campos em todas as variantes são `Send`, ou `unsafe` impl'ed. |
| `&T` | Se `T` é `Sync`. |
| <code>&vert;&vert; {}</code> | Encerramentos são `Send` se todos os _captures_ são `Send`.  |
| {{ tab() }} <code>&vert;x&vert; { }</code> | `Send`, independentemente de `x`.  |
| {{ tab() }} <code>&vert;x&vert; { Rc::new(x) }</code> | `Send`, desde que ainda nada capturado, apesar `Rc` não ser `Send`.  |
| {{ tab() }} <code>&vert;x&vert; { x + y }</code> | Apenas `Send` se `y` é `Send`.  |
| <code>async { }</code> | Futuros são `Send` se não `!Send` é retido sobre `.await` pontos.  |
| {{ tab() }} <code>async { Rc::new() }</code> | `Future` é `Send`, desde o `!Send` tipo `Rc` não é retido `.await`.  |
| {{ tab() }} <code>async { rc; x.await; rc; }</code> <sup>1</sup> | `Future` é `!Send`, desde `Rc` utilizado em toda a `.await` Ponto. |
| <code>async &vert;&vert; { }</code> {{ experimental()}} | Assinc _cl_. `Send` Se todos os cpts. `Send`, res. `Future` e também não `!Send` Para dentro.   |
| {{ tab() }} <code>async &vert;x&vert; { x  + y }</code> {{ experimental()}} | Async encerramento `Send` se `y` é `Send`. Futuro `Send` se `x` e `y` `Send`. |

</div>

<footnotes>

<sup>1</sup> Este é um pouco de pseudo-código para passar o ponto, a idéia é ter um `Rc` antes de uma `.await` apontar e continuar a usá-lo além desse ponto.

</footnotes>
