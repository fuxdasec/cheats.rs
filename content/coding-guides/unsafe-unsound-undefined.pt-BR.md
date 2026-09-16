+++
title = "Unsafe, unsound e comportamento indefinido"
description = "As diferenças entre Rust unsafe, APIs unsound, comportamento indefinido e abstrações seguras."
weight = 41
template = "topic.html"

[extra]
seo_title = "Unsafe, unsound e comportamento indefinido"
anchor = "unsafe-unsound-undefined"
print = true
translation_of = "coding-guides/unsafe-unsound-undefined.md"
source_hash = "03a74a4ce42446a6b3e573f0338e3ca97ce5c93c5eff9b9b09f0a4a95157cd07"
+++
Unsafe leva a unsound. Unsound leva ao comportamento indefinido. O comportamento indefinido leva ao lado sombrio da força.



<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-unsafe-0" name="tab-unsafe" checked>
<label for="tab-unsafe-0"><b>Código seguro</b></label>
<panel><div>


**Código seguro**

- _Seguro_ tem um sentido restrito em Rust: aproximadamente, a prevenção _intrínseca_ de comportamento indefinido (UB).
- Intrínseco significa que a linguagem não permite usar _seus próprios recursos seguros_ para causar UB.
- Derrubar um avião ou apagar um banco de dados não é UB; portanto, essas ações são “seguras” no sentido específico usado por Rust.
- Escrever em `/proc/[pid]/mem` para modificar o próprio código também é “seguro” nesse sentido: o UB resultante não é causado _intrinsecamente_ pela linguagem.

<!-- In other words, _safe_ only means the language will produce binary code that, when reasonably invoked, executes in a manner consistent with what was written in source code. -->

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```rust
let y = x + x;  // Safe Rust only guarantees the execution of this code is consistent with
print(y);       // 'specification' (long story …). It does not guarantee that y is 2x
                // (X::add might be implemented badly) nor that y is printed (Y::fmt may panic).
```
</div></div>


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-unsafe-1" name="tab-unsafe">
<label for="tab-unsafe-1"><b>Código unsafe</b></label>
<panel><div>


**Código unsafe**

- Código marcado como `unsafe` tem permissões especiais, como desreferenciar ponteiros brutos ou chamar outras funções `unsafe`.
- Essas permissões vêm acompanhadas de **garantias que o autor _deve_ fornecer ao compilador**, e o compilador _vai_ confiar nelas.
- Código `unsafe` não é ruim por si só, mas é perigoso e necessário para FFI ou estruturas de dados incomuns.

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```rust
// `x` must always point to race-free, valid, aligned, initialized u8 memory.
unsafe fn unsafe_f(x: *mut u8) {
    my_native_lib(x);
}
```
</div></div></div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-unsafe-2" name="tab-unsafe" >
<label for="tab-unsafe-2"><b>Comportamento indefinido</b></label>
<panel><div>


**Comportamento indefinido (UB)**
- Como mencionado, código `unsafe` envolve [garantias especiais](https://doc.rust-lang.org/stable/reference/behavior-considered-undefined.html) dadas ao compilador; caso contrário, não precisaria ser `unsafe`.
- Descumprir qualquer uma dessas garantias permite ao compilador produzir código incorreto, cuja execução leva a UB.
- Depois de provocar comportamento indefinido, _qualquer coisa_ pode acontecer. Os efeitos podem ser 1) sutis, 2) aparecer longe do ponto da violação ou 3) se manifestar apenas em certas condições.
- Um programa que parece _funcionar_, mesmo com muitos testes unitários, não prova que código com UB não possa falhar de forma inesperada.
- Código com UB é objetivamente perigoso e inválido e não deve existir.

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">


```rust
if maybe_true() {
    let r: &u8 = unsafe { &*ptr::null() };   // Once this runs, ENTIRE app is undefined. Even if
} else {                                     // line seemingly didn't do anything, app might now run
    println!("the spanish inquisition");     // both paths, corrupt database, or anything else.
}
```
</div></div></div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-unsafe-3" name="tab-unsafe" >
<label for="tab-unsafe-3"><b>Código unsound</b></label>
<panel><div>


**Código unsound**
- Qualquer código Rust apresentado como _seguro_ que possa produzir UB para alguma entrada do usuário, mesmo apenas em teoria, é **unsound**: sua garantia de segurança é inválida.
- O mesmo vale para código `unsafe` que possa causar UB por conta própria ao violar as garantias mencionadas acima.
- Código unsound representa um risco à estabilidade e à segurança e viola uma premissa básica de muitos usuários de Rust.

<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```rust
fn unsound_ref<T>(x: &T) -> &u128 {      // Signature looks safe to users. Happens to be
    unsafe { mem::transmute(x) }         // ok if invoked with an &u128, UB for practically
}                                        // everything else.
```

</div></div></div></panel></tab>

</tabs>

{{ tablesep() }}

>
> **Uso responsável de unsafe** {{ opinionated() }}
>
> - Não use `unsafe` a menos que seja indispensável.
> - Siga o [Nomicon](https://doc.rust-lang.org/nightly/nomicon/) e as [diretrizes para código unsafe](https://rust-lang.github.io/unsafe-code-guidelines/). Respeite **sempre todas** as regras de segurança e **nunca** provoque [UB](https://doc.rust-lang.org/stable/reference/behavior-considered-undefined.html).
> - Minimize o uso de `unsafe` e encapsule-o em módulos pequenos, corretos quanto à segurança e fáceis de revisar.
> - Nunca crie abstrações unsound; se não puder encapsular `unsafe` corretamente, não o faça.
> - Cada unidade de código `unsafe` deve vir acompanhada de uma explicação em texto que justifique sua segurança.


{{ tablesep() }}
