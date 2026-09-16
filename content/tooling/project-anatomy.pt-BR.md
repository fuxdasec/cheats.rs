+++
title = "Anatomia de um projeto"
description = "Arquivos e pastas comuns de projetos Rust e Cargo, configuração, testes, exemplos e resultados da compilação."
weight = 30
template = "topic.html"

[extra]
seo_title = "Anatomia de um projeto"
anchor = "project-anatomy"
print = true
translation_of = "tooling/project-anatomy.md"
source_hash = "b6548f3370ce2b3eded09daaa6a2adf89dfe7223447b3f89fa3d108022134c30"
+++

layout básico do projeto, e arquivos e pastas comuns, como usado por `cargo`. {{ below(target="/tooling/cargo/#cargo") }}

<div class="color-header red">

| Entrada | Código |
|--------| ---- |
| 📁 `.cargo/` | **Configuração do projeto-carga local**, pode conter **`config.toml`**. {{ link( url="https://doc.rust-lang.org/cargo/reference/config.html") }} {{ esoteric() }} |
| 📁 `benches/` | Benchmarks para o seu crate, execute através de **`cargo bench`**, requer por padrão por noite. <sup>*</sup> {{ experimental() }} |
| 📁 `examples/` | Exemplos como usar seu crate, eles veem seu crate como o usuário externo faria.  |
| {{ tab() }} {{ tab() }} `my_example.rs` | Exemplos individuais são executados como **`cargo run --example my_example`**. |
| 📁 `src/` | Código fonte real para o seu projeto. |
| {{ tab() }} {{ tab() }} `main.rs` | Ponto de entrada padrão para aplicativos, isto é o que **`cargo run`** usa. |
| {{ tab() }} {{ tab() }} `lib.rs` | Ponto de entrada padrão para bibliotecas. Aqui é onde procurar `my_crate::f()` Começa. |
| 📁 `src/bin/` | Local para binários adicionais, mesmo em projetos de biblioteca. |
| {{ tab() }} {{ tab() }} `extra.rs` | binário adicional, executar com `cargo run --bin extra`. |
| 📁 `tests/` | Testes de integração vão aqui, invocados através de **`cargo test`**. Testes de unidade muitas vezes ficar em `src/` Arquivo. |
| `.rustfmt.toml` | No caso de você querer [** Personalizar **](https://rust-lang.github.io/rustfmt/) como **`cargo fmt`** funciona. |
| `.clippy.toml` | Configuração especial para certo [** Lints de clippy **](https://rust-lang.github.io/rust-clippy/master/index.html), utilizado através de **`cargo clippy`**  {{ esoteric() }} |
| `build.rs` |  ** Pré-build script**, {{ link(url="https://doc.rust-lang.org/cargo/reference/build-scripts.html") }} útil ao compilar C / FFI, ... |
| <code class="ignore-auto language-bash">Cargo.toml</code> | Principal **projeto manifesto**, {{ link(url="https://doc.rust-lang.org/cargo/reference/manifest.html") }} Define dependências, artefatos ... |
| <code class="ignore-auto language-bash">Cargo.lock</code> | Para compilações reprodutíveis. Adicionar ao git para aplicativos, considere não para libs. {{ opinionated() }} {{ link(url="https://blog.rust-lang.org/2023/08/29/committing-lockfiles.html" )}} {{ link(url="https://web.archive.org/web/20240108203227/https://old.reddit.com/r/rust/comments/164qfjm/change_in_guidance_on_committing_lockfiles_rust/jya8ouf/" )}} |
| `rust-toolchain.toml` |  Define ** sobreposição da ferramenta **{{ link(url="https://rust-lang.github.io/rustup/overrides.html" )}} (canal, componentes, alvos) para este projeto. |
</div>

<footnotes>

<sup>*</sup> Em consideração estável [Critério](https://github.com/bheisler/criterion.rs).

</footnotes>


{{ tablesep() }}


** Exemplos mínimos** para vários pontos de entrada podem parecer:

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-1" name="tab-group-anatomy" checked>
<label for="tab-anatomy-1"><b>Pedidos</b></label>
<panel><div>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// src/main.rs (default application entry point)

fn main() {
    println!("Hello, world!");
}
```

</div></div></div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-2" name="tab-group-anatomy" >
<label for="tab-anatomy-2"><b>Bibliotecas</b></label>
<panel><div>

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// src/lib.rs (default library entry point)

pub fn f() {}      // Is a public item in root, so it's accessible from the outside.

mod m {
    pub fn g() {}  // No public path (`m` not public) from root, so `g`
}                  // is not accessible from the outside of the crate.
```
</div></div></div></panel></tab>





<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-3" name="tab-group-anatomy" >
<label for="tab-anatomy-3"><b>Testes unitários</b></label>
<panel><div>

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// src/my_module.rs (any file of your project)

fn f() -> u32 { 0 }

#[cfg(test)]
mod test {
    use super::f;           // Need to import items from parent module. Has
                            // access to non-public members.
    #[test]
    fn ff() {
        assert_eq!(f(), 0);
    }
}
```
</div></div></div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-4" name="tab-group-anatomy" >
<label for="tab-anatomy-4"><b>Testes de Integração</b></label>
<panel><div>

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// tests/sample.rs (sample integration test)

#[test]
fn my_sample() {
    assert_eq!(my_crate::f(), 123); // Integration tests (and benchmarks) 'depend' to the crate like
}                                   // a 3rd party would. Hence, they only see public items.
```
</div></div></div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-5" name="tab-group-anatomy" >
<label for="tab-anatomy-5"><b>Benchmarks</b>{{ experimental() }}</label>
<panel><div>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// benches/sample.rs (sample benchmark)

#![feature(test)]   // #[bench] is still experimental

extern crate test;  // Even in '18 this is needed for … reasons.
                    // Normally you don't need this in '18 code.

use test::{black_box, Bencher};

#[bench]
fn my_algo(b: &mut Bencher) {
    b.iter(|| black_box(my_crate::f())); // `black_box` prevents `f` from being optimized away.
}
```
</div></div></div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-6" name="tab-group-anatomy" >
<label for="tab-anatomy-6"><b>Compilar scripts</b></label>
<panel><div>

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// build.rs (sample pre-build script)

fn main() {
    // You need to rely on env. vars for target; `#[cfg(…)]` are for host.
    let target_os = env::var("CARGO_CFG_TARGET_OS");
}
```

<sup>*</sup>[Veja aqui a lista](https://doc.rust-lang.org/cargo/reference/environment-variables.html#environment-variables-cargo-sets-for-build-scripts) de variáveis de ambiente definidas.

</div></div></div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-anatomy-25" name="tab-group-anatomy" >
<label for="tab-anatomy-25"><b>Macros Proc</b>{{ esoteric() }}</label>
<panel><div>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

```
// src/lib.rs (default entry point for proc macros)

extern crate proc_macro;  // Apparently needed to be imported like this.

use proc_macro::TokenStream;

#[proc_macro_attribute]   // Crates can now use `#[my_attribute]`
pub fn my_attribute(_attr: TokenStream, item: TokenStream) -> TokenStream {
    item
}
```


```
// Cargo.toml

[package]
name = "my_crate"
version = "0.1.0"

[lib]
proc-macro = true
```


</div></div></div></panel></tab>


</tabs>



{{ tablesep() }}


Árvores de módulos e importações:

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-module-import-1" name="tab-group-module-import" checked>
<label for="tab-module-import-1"><b>Árvores de Módulos</b></label>
<panel><div>


<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

**Módulos** {{ book(page="ch07-02-defining-modules-to-control-scope-and-privacy.html") }} {{ ex(page="mod.html#modules") }} {{ ref(page="items/modules.html#modules") }} e **arquivos de código** funcionam da seguinte forma:

- ** Árvore do módulo** precisa ser explicitamente definida, é **não** implicitamente construída a partir de ** árvore do sistema de arquivos**. {{ link(url="http://www.sheshbabu.com/posts/rust-module-system/") }}
- **Module tree root** é igual a biblioteca, app, &hellip; ponto de entrada (por exemplo, `lib.rs`).

As definições reais de **módulo** funcionam da seguinte forma:
- A **`mod m {}`** define o módulo no arquivo, enquanto **`mod m;`** lerá `m.rs` ou `m/mod.rs`.
- Localização de `.rs` com base em **nesting**, por exemplo, `mod a { mod b { mod c; }}}` é um `a/b/c.rs` ou `a/b/c/mod.rs`.
- Arquivos não localizados a partir da raiz da árvore do módulo através de alguns `mod m;` não será tocado pelo compilador! {{ bad() }}

<!-- - **Visibility** of items (e.g., functions, fields) between modules governed by: "Is there visible path to item?"
    - Visibility like `pub fn f() {}` does not mean "`f` is public", but "`f` at most public if all parents public`. -->


</div></div></div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-module-import-2" name="tab-group-module-import">
<label for="tab-module-import-2"><b>Espaços de nomes</b>{{ esoteric() }}</label>
<panel><div>


Rust tem três tipos de **namespaces**:

<table>
    <thead>
        <tr>
            <th>Espaço de nomes <i>Tipos</i></th>
            <th>Espaço de nomes <i>Funções</i></th>
            <th>Espaço de nomes <i>Macros</i></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>mod X {}</code></td>
            <td><code>fn X() {}</code></td>
            <td><code>macro_rules! X { … }</code></td>
        </tr>
        <tr>
            <td><code>X</code> (crate)</td>
            <td><code>const X: u8 = 1;</code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td><code>trait X {}</code></td>
            <td><code>static X: u8 = 1;</code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td><code>enum X {}</code></td>
            <td><code></code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td><code>union X {}</code></td>
            <td><code></code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td><code>struct X {}</code></td>
            <td><code></code></td>
            <td><code></code></td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center; padding-right: 50px;"> <span style="opacity: 50%">←</span> <code>struct X;</code><sup>1</sup> <span style="opacity: 50%">→</span> </td>
            <td></td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: center; padding-right: 50px;"> <span style="opacity: 50%">←</span> <code>struct X();</code><sup>2</sup> <span style="opacity: 50%">→</span> </td>
            <td></td>
        </tr>
    </tbody>
</table>

<footnotes>

<sup>1</sup> Contagem em <i>Tipos</i> e in <i>Funções</i>, define o tipo `X` _e_ constante `X`. <br>
<sup>2</sup> Contagem em <i>Tipos</i> e in <i>Funções</i>, define o tipo `X` _e_ função `X`.

</footnotes>

- Em qualquer escopo, por exemplo, dentro de um módulo, apenas um item por espaço de nomes pode existir, por exemplo,
    - `enum X {}` e `fn X() {}` pode coexistir
    - `struct X;` e `const X` não pode coexistir
- Com uma `use my_mod::X;` todos os itens chamados `X` será importado.

> Devido à nomeação de convenções (por exemplo, `fn` e `mod` são minúsculas por convenção) e _common sense_ (a maioria dos desenvolvedores simplesmente não nomeiam todas as coisas `X`) você não terá que se preocupar com estes _kinds_ na maioria dos casos. Eles podem, no entanto, ser um fator ao projetar macros.


</div></panel></tab>


</tabs>


{{ tablesep() }}
