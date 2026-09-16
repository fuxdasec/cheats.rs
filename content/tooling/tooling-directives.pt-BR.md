+++
title = "Diretivas de ferramentas"
description = "Atributos e diretivas de Rust para lints, compilação condicional, vinculação, testes, documentação e otimização."
weight = 33
template = "topic.html"

[extra]
seo_title = "Diretivas de ferramentas"
anchor = "tooling-directives"
print = true
translation_of = "tooling/tooling-directives.md"
source_hash = "8b549bc5739ad881d0b14d51c9427bc1a1eb6f5acb4fadb1127dbef4d9c9a2c8"
+++

Tokens especiais incorporados no código-fonte usado por ferramentas ou pré-processamento.

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-1" name="tab-group-preprocessing" checked>
<label for="tab-preprocessing-1"><b>Fragmentos de Macro</b></label>
<panel><div class="color-header undefined-color-3">

<fixed-2-column class="color-header special_example">

<!-- Tool: **Preprocessor (Automatic)** -->


<!-- ```
macro_rules! my_macro {
    ($x:ty) => { ... }
}
``` -->

Dentro de um **declarativo** {{ book(page="ch19-06-macros.html#declarative-macros-with-macro_rules-for-general-metaprogramming") }} **Macro por exemplo** {{book(page="ch19-06-macros.html")}}  {{ex(page="macros.html#macro_rules")}}  {{ref(page="macros-by-example.html")}} `macro_rules!` implementação destes **especificadores de fragmentos ** {{ ref(page="macros-by-example.html#metavariables") }} trabalho:

| Dentro de Macros |  Explicação |
|---------|---------|
| `$x:ty`  | Captação de macros (aqui a `$x` é a captura e `ty` meios `x` deve ser tipo). |
| {{ tab() }} `$x:block`   | Um bloco `{}` de declarações ou expressões, por exemplo, `{ let x = 5; }` |
| {{ tab() }} `$x:expr`    | Uma expressão, por exemplo, `x`, `1 + 1`, `String::new()` ou `vec![]` |
| {{ tab() }} `$x:expr_2021` | Uma expressão que corresponde ao comportamento de Rust '21 {{ rfc(page="3531-macro-fragment-policy.html") }} |
| {{ tab() }} `$x:ident`   | Um identificador, por exemplo em `let x = 0;` o identificador é `x`. |
| {{ tab() }} `$x:item`    | Um item, como uma função, struct, módulo, etc. |
| {{ tab() }} `$x:lifetime` | A lifetime (e.g., `'a`, `'static`, etc.). |
| {{ tab() }} `$x:literal` | Um literal (por exemplo, `3`, `"foo"`, `b"bar"`, etc.). |
| {{ tab() }} `$x:meta`    | Um meta- item; as coisas que entram `#[…]` e `#![…]` atributos. |
| {{ tab() }} `$x:pat`     | Um padrão, por exemplo, `Some(x)`, `(17, 'a')` ou <code>x&vert;x</code>. |
| {{ tab() }} `$x:pat_param`| Subconjunto de padrões sem nível superior &vert;, e.g., `Some(x)` ou `x`. |
| {{ tab() }} `$x:path`    | Um caminho (por exemplo, `foo`, `::std::mem::replace`, `transmute::<_, int>`). |
| {{ tab() }} `$x:stmt`    | Uma declaração, por exemplo, `let x = 1 + 1;`, `String::new();` ou `vec![];` |
| {{ tab() }} `$x:tt`      | Uma única árvore de símbolos, [Veja aqui](https://stackoverflow.com/a/40303308) para mais detalhes. |
| {{ tab() }} `$x:ty`      | Um tipo, por exemplo, `String`, `usize` ou `Vec<u8>`. |
| {{ tab() }} `$x:vis`    | Um modificador de visibilidade;  `pub`, `pub(crate)`, etc. |
| `$crate` | Variável especial de higiene, crate em que são definidas macros. {{ todo() }} |

</fixed-2-column>

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-2" name="tab-group-preprocessing">
<label for="tab-preprocessing-2"><b>Documentação</b></label>
<panel><div class="color-header undefined-color-2">

<fixed-2-column  class="color-header special_example">

<!-- ```
/// Accepts an [`S`].
///
/// ```rust
///     f(s);
/// ```
``` -->

Dentro de um comentário **doc {{ book(page="ch14-02-publishing-to-crates-io.html#making-useful-documentation-comments") }}  {{ ex(page="meta/doc.html#documentation") }}  {{ ref(page="comments.html#doc-comments")}} estes trabalhos:

| Dentro dos comentários do Doc | Explicação |
|--------|-------------|
| ` ```…``` ` | Include a [** teste de doc **](https://doc.rust-lang.org/rustdoc/documentation-tests.html) (doc code running on `cargo test`). |
| ` ```X,Y …``` ` | Igual ao anterior, incluindo configurações opcionais; `X`, `Y` podem ser … |
| {{ tab() }} <code style="color: gray;">rust</code> | Explicita que o teste está escrito em Rust; implícito nas ferramentas de Rust. |
| {{ tab() }} <code style="color: gray; opacity: 0.3;">-</code> | Compila e executa o teste. Falha em caso de panic. **Comportamento padrão**. |
| {{ tab() }} <code style="color: gray;">should_panic</code> | Compila e executa o teste. A execução deve causar panic; caso contrário, o teste falha. |
| {{ tab() }} <code style="color: gray;">no_run</code> | Compila o teste e falha se o código não compilar, mas não o executa. |
| {{ tab() }} <code style="color: gray;">compile_fail</code> | Compila o teste, mas falha se o código _puder_ ser compilado. |
| {{ tab() }} <code style="color: gray;">ignore</code> | Não compila nem executa. Prefira a opção anterior. |
| {{ tab() }} <code style="color: gray;">edition2018</code> | Executa o código como Rust 2018; o padrão é 2015. |
| `#` | Oculta a linha da documentação (` ```   # use x::hidden; ``` `). |
| <code>[&#96;S&#96;]</code> | Cria um link para a struct, enum, trait, função, &hellip; `S`. |
| <code>[&#96;S&#96;]&#40;crate::S&#41;</code> | Caminhos também podem ser usados na forma de links Markdown. |


</fixed-2-column>


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-7" name="tab-group-preprocessing">
<label for="tab-preprocessing-7"><b><code>#![globals]</code></b></label>
<panel><div class="color-header undefined-color-3">

<!-- ```
// Attributes usually found in toplevel project file.
#![no_std]
#![feature(xxx)]
``` -->
<fixed-3-column  class="color-header special_example">

Atributos que afetam todo o crate ou aplicativo:

| Opt-Out   | Ligado | Explicação |
|--------|---| ----------|
| `#![no_std]` | `C` | Não importar (automaticamente) **`std`**{{ std(page="std/") }}; use **`core`**{{ std(page="core/") }}. {{ ref(page="names/preludes.html#the-no_std-attribute") }} |
| `#![no_implicit_prelude]` | `CM` | Não adicionar **`prelude`**{{ std(page="std/prelude/index.html") }}, precisa importar manualmente `None`, `Vec`, … {{ ref(page="names/preludes.html#the-no_implicit_prelude-attribute") }} |
| `#![no_main]` |  `C` | Não emites `main()` em aplicativos se você mesmo fizer isso. {{ ref(page="crates-and-source-files.html#the-no_main-attribute") }}|

<!-- | `#![no_builtins]` | `C` | Does ... something ... probably important. {{ todo() }} {{ ref(page="attributes/codegen.html#the-no_builtins-attribute") }}| -->

{{ tablesep() }}

| Opt-In's   | Ligado | Explicação |
|--------|---| ----------|
| `#![feature(a, b, c)]` | `C` | Confiar em f. que pode não ficar estabilizado, _c._ [** Livro Instável](https://doc.rust-lang.org/unstable-book/the-unstable-book.html). {{ experimental() }} |

{{ tablesep() }}

| Compila | Ligado | Explicação |
|--------|---| ----------|
| `#![crate_name = "x"]` | `C`  | Especificar o nome crate atual, por exemplo, quando não utilizar `cargo`. {{ todo() }} {{ ref(page="crates-and-source-files.html#the-crate_name-attribute") }} {{ esoteric() }} |
| `#![crate_type = "bin"]` | `C`  | Especificar o tipo crate atual (`bin`, `lib`, `dylib`, `cdylib`, …). {{ ref(page="linkage.html") }} {{ esoteric() }} |
| `#![recursion_limit = "123"]` | `C` | Definir _compile-time_ limite de recursão para deref, macros, ... {{ ref(page="attributes/limits.html#the-recursion_limit-attribute") }} {{ esoteric() }} |
| `#![type_length_limit = "456"]` | `C` | Limita o número máximo de substituições de tipo. {{ ref(page="attributes/limits.html#the-type_length_limit-attribute") }} {{ esoteric() }} |
| `#![windows_subsystem = "x"]` | `C` | No Windows, faça um `console` ou `windows` app. {{ ref(page="runtime.html#the-windows_subsystem-attribute") }}  {{ esoteric() }} |


{{ tablesep() }}

| Manipuladores | Ligado | Explicação |
|--------|---|----------|
| `#[alloc_error_handler]` | `F` | Fazer alguns `fn(Layout) -> !` a ** falha na alocação. manipulador**. {{ link(url="https://github.com/rust-lang/rust/issues/51540") }}  {{ experimental() }} |
| `#[global_allocator]` | `S` | Marca static item impl. `GlobalAlloc` {{ std(page="alloc/alloc/trait.GlobalAlloc.html") }} **Alocador global**. {{ ref(page="runtime.html#the-global_allocator-attribute") }}|
| `#[panic_handler]` | `F` | Fazer alguns `fn(&PanicInfo) -> !` A aplicação é ** manipulador de pânico**. {{ ref(page="runtime.html#the-panic_handler-attribute") }} |


</fixed-3-column>


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-4" name="tab-group-preprocessing">
<label for="tab-preprocessing-4"><b><code>#[code]</code></b></label>
<panel><div class="color-header undefined-color-3">

Atributos que regem principalmente o código emitido:

<fixed-3-column  class="color-header special_example">

| Desenvolvedor UX | Ligado | Explicação |
|-------|---|-------------|
| `#[non_exhaustive]` | `T` | À prova do futuro `struct` ou `enum`; dica que pode crescer no futuro. {{ ref(page="attributes/type_system.html#the-non_exhaustive-attribute") }}|
| `#[path = "x.rs"]` | `M` | Obter módulo de arquivo não padrão. {{ ref(page="items/modules.html#the-path-attribute") }}|
| `#[diagnostic::on_unimplemented]` | `X` | Dê mensagens de erro melhores quando trait não implementado. {{ rfc(page="3368-diagnostic-attribute-namespace.html") }}|

{{ tablesep() }}

| Codegen | Ligado | Explicação |
|-------|---|-------------|
| `#[cold]` | `F` | Dica essa função provavelmente não vai ser chamada. {{ ref(page="attributes/codegen.html#the-cold-attribute") }}|
| `#[inline]` | `F` | Sugere ao compilador que expanda a função nos locais de chamada. {{ ref(page="attributes/codegen.html#the-inline-attribute") }}|
| `#[inline(always)]` | `F` | Sugere enfaticamente que o compilador sempre expanda a chamada da função. {{ ref(page="attributes/codegen.html#the-inline-attribute") }}|
| `#[inline(never)]` | `F` | Instrui o compilador a não expandir a função no local da chamada. {{ ref(page="attributes/codegen.html#the-inline-attribute") }} |
| `#[repr(X)]`<sup>1</sup>  | `T`  | Usa outra representação em vez da representação **`rust`** padrão {{ ref(page="type-layout.html#the-default-representation") }}: |
| `#[target_feature(enable="x")]` | `F` | Ativa um recurso da CPU, como `avx2`, para o código da `unsafe fn`. {{ ref(page="attributes/codegen.html#the-target_feature-attribute") }}|
| `#[track_caller]` | `F` | Permite que a `fn` encontre o **local da chamada** com `caller`{{ std(page="core/panic/struct.Location.html#method.caller") }}, produzindo mensagens de panic melhores. {{ ref(page="attributes/codegen.html#the-track_caller-attribute") }}|
| {{ tab() }} `#[repr(C)]` | `T`  | Usa um layout compatível com C (para FFI) e previsível (para `transmute`). {{ ref(page="type-layout.html#the-c-representation") }}|
| {{ tab() }} `#[repr(C, u8)]` | `enum`  | Dá ao discriminante do `enum` o tipo especificado. {{ ref(page="type-layout.html#the-c-representation") }}|
| {{ tab() }} `#[repr(transparent)]` | `T`  | Dá ao tipo de um único elemento o mesmo layout do campo contido. {{ ref(page="type-layout.html#the-transparent-representation") }}|
| {{ tab() }} `#[repr(packed(1))]` | `T`  | Reduz o alinhamento da struct e dos campos; pode facilitar comportamento indefinido. {{ ref(page="type-layout.html#the-alignment-modifiers") }}|
| {{ tab() }} `#[repr(align(8))]` | `T`  | Aumenta o alinhamento da struct para o valor informado, por exemplo em tipos SIMD. {{ ref(page="type-layout.html#the-alignment-modifiers") }}|

<!-- {{ tablesep() }}

| Representation | On | Explanation |
|-------|---|-------------|
| `-` | `T`  | Na ausência de `#[repr]`, usa a **representação `rust`** {{ ref(page="type-layout.html#the-default-representation") }} |
| `#[repr(C)]` | `T`  | Use a predictable, C-compatible representation. {{ ref(page="type-layout.html#the-c-representation") }}|
| `#[repr(C, u8)]` | `enum`  | Define o tipo indicado para o discriminante do `enum`. {{ ref(page="type-layout.html#the-c-representation") }}|
| `#[repr(transparent)]` | `T`  | Dá ao tipo de um único elemento o mesmo layout do campo contido. {{ ref(page="type-layout.html#the-transparent-representation") }}|
| `#[repr(packed(1))]` | `T`  | Reduz o alinhamento da struct e de seus campos; pode facilitar comportamento indefinido. {{ ref(page="type-layout.html#the-alignment-modifiers") }}|
| `#[repr(align(8))]` | `T`  | Raise alignment of struct to given value, e.g., for SIMD types. {{ ref(page="type-layout.html#the-alignment-modifiers") }}| -->

<footnotes>

<sup>1</sup> Alguns modificadores de representação podem ser combinados, por exemplo, `#[repr(C, packed(1))]`.

</footnotes>

{{ tablesep() }}

| Ligação | Ligado | Explicação |
|-------|---|-------------|
| `#[unsafe(no_mangle)]` | `*` | Use o nome do item diretamente como nome do símbolo, em vez de fazer a dobragem. {{ ref(page="abi.html#the-no_mangle-attribute") }}|
| `#[unsafe(export_name = "foo")]` | `FS` | Exportar a `fn` ou `static` sob um nome diferente. {{ ref(page="abi.html#the-export_name-attribute") }}|
| `#[unsafe(link_section = ".x")]` | `FS`  | Nome da seção do arquivo de objeto onde o item deve ser colocado. {{ ref(page="abi.html#the-link_section-attribute") }}|
| `#[link(name="x", kind="y")]` | `X`  | Lib nativa para ligar ao procurar o símbolo. {{ ref(page="items/external-blocks.html#the-link-attribute") }}|
| `#[link_name = "foo"]` | `F`  | Nome do símbolo a procurar para resolver `extern fn`. {{ ref(page="items/external-blocks.html#the-link_name-attribute") }}|
| `#[no_link]` | `X` | Não vincular `extern crate` quando só quer macros. {{ ref(page="items/extern-crates.html#the-no_link-attribute") }}|
| `#[used]` | `S`  | Não optimize `static` variável apesar de parecer não utilizada. {{ ref(page="abi.html#the-used-attribute") }}|



</fixed-3-column>

</div></panel></tab>




<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-3" name="tab-group-preprocessing">
<label for="tab-preprocessing-3"><b><code>#[quality]</code></b></label>
<panel><div class="color-header undefined-color-3">

Atributos usados por Rust para melhorar a qualidade do código:

<fixed-3-column  class="color-header special_example">

| Padrões de Código | Ligado | Explicação |
|-------|---|-------------|
| `#[allow(X)]` | `*` | Instrução `rustc` / `clippy` para a classe ign. `X` de possíveis problemas. {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[expect(X)]` <sup>1</sup> | `*` | Avisa se um fio não disparar. {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[warn(X)]` <sup>1</sup> | `*` |  ... emitir um aviso, mistura-se bem com `clippy` Lints. {{ hot() }}  {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[deny(X)]` <sup>1</sup> | `*` |  ... falha na compilação. {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[forbid(X)]` <sup>1</sup> | `*` | ... falha na compilação e evitar subsequente `allow` substitui. {{ ref(page="attributes/diagnostics.html#lint-check-attributes") }} |
| `#[deprecated = "msg"]` | `*` | Deixe seus usuários saber que você cometeu um erro de design. {{ ref(page="diagnostics.html#the-deprecated-attribute") }}|
| `#[must_use = "msg"]` | `FTX` |  Torna o valor de retorno da verificação do compilador _processado_ pelo chamador. {{ hot() }} {{ ref(page="attributes/diagnostics.html#the-must_use-attribute") }}|

<footnotes>

<sup>1</sup> {{ opinionated() }} Há algum debate que é o _melhor_ para garantir caixas de alta qualidade. Caixas multi-dev mantida ativa provavelmente beneficiar de mais agressivo `deny` ou `forbid` lints; os menos regularmente actualizados, provavelmente mais devido ao uso conservador de `warn` (como compilador futuro ou `clippy` as atualizações podem de repente quebrar código de trabalho de outra forma com problemas menores).

</footnotes>

{{ tablesep() }}

</fixed-3-column>

<fixed-3-column  class="color-header special_example">

| Ensaios | Ligado | Explicação |
|-------|---|-------------|
| `#[test]` | `F` | Marca a função como um teste, executar com `cargo test`. {{ hot() }} {{ ref(page="attributes/testing.html#the-test-attribute") }}|
| `#[ignore = "msg"]` | `F` | Compila, mas não executa alguns `#[test]` por agora. {{ ref(page="attributes/testing.html#the-ignore-attribute") }}|
| `#[should_panic]` | `F` | O ensaio deve ser efectuado `panic!()` para realmente ter sucesso. {{ ref(page="attributes/testing.html#the-ignore-attribute") }}|
| `#[bench]` | `F` | Marcar a função em `bench/` como parâmetro de referência para `cargo bench`. {{ experimental() }} {{ ref(page="") }}|

{{ tablesep() }}


| Formatação | Ligado | Explicação |
|-------|---|-------------|
| `#[rustfmt::skip]` |  `*` | Prevenir `cargo fmt` de limpar o item. {{ link(url="https://github.com/rust-lang/rustfmt") }}|
| `#![rustfmt::skip::macros(x)]` |  `CM` | ... da limpeza da macro `x`. {{ link(url="https://github.com/rust-lang/rustfmt") }}|
| `#![rustfmt::skip::attributes(x)]` |  `CM` | ... do atributo de limpeza `x`. {{ link(url="https://github.com/rust-lang/rustfmt") }}|

</fixed-3-column>

{{ tablesep() }}

<fixed-3-column class="color-header special_example extra-wide">


| Documentação | Ligado | Explicação |
|-------|---|-------------|
| `#[doc = "Explanation"]` | `*` | O mesmo que adicionar um `///` Comentário do documento. {{ link(url="https://doc.rust-lang.org/rustdoc/the-doc-attribute.html") }} |
| `#[doc(alias = "other")]` | `*` | Indique outro nome para pesquisa em documentos. {{ link(url="https://github.com/rust-lang/rust/issues/50146") }} |
| `#[doc(hidden)]` | `*` | Evite que o item apareça nos documentos. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#hidden") }} |
| `#![doc(html_favicon_url = "")]` | `C` | Define o `favicon` para os documentos. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_favicon_url") }}|
| `#![doc(html_logo_url  = "")]` | `C` | O logótipo utilizado nos documentos. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_logo_url") }}|
| `#![doc(html_playground_url  = "")]` | `C` | Gera `Run` botões e usa determinado serviço. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_playground_url") }}|
| `#![doc(html_root_url  = "")]` | `C` | URL base para links para caixas externas. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_root_url") }}|
| `#![doc(html_no_source)]` | `C` | Evita que a fonte seja incluída nos documentos. {{ link(url="https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html#html_no_source") }}|

<!-- | `#![doc(issue_tracker_base_url  = "")]` | `C` | Mostly for `std::`, where issue numbers link. {{ link(url="https://doc.rust-lang.org/rustdoc/the-doc-attribute.html#issue_tracker_base_url") }}| -->

</fixed-3-column>




</div></panel></tab>




<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-8" name="tab-group-preprocessing">
<label for="tab-preprocessing-8"><b><code>#[macros]</code></b></label>
<panel><div class="color-header undefined-color-3">

<fixed-3-column  class="color-header special_example">

Atributos relacionados à criação e utilização de macros:

| Macros por Exemplo | Ligado | Explicação |
|-------|---|-------------|
| `#[macro_export]` |  `!` | Exportar `macro_rules!` como `pub` ligado crate nível {{ ref(page="macros-by-example.html#path-based-scope") }}|
| `#[macro_use]` | `MX` | Deixar as macros persistirem no passado mod.; ou importar de `extern crate`. {{ ref(page="macros-by-example.html#the-macro_use-attribute") }}|

{{ tablesep() }}

| Macros Proc | Ligado | Explicação |
|-------|---|-------------|
| `#[proc_macro]` | `F`  | Marcar `fn` como **function-like** procedimental _m._ callable as `m!()`. {{ ref(page="procedural-macros.html#function-like-procedural-macros") }}|
| `#[proc_macro_derive(Foo)]` | `F`  | Marcar `fn` como ** macro derivada ** que pode `#[derive(Foo)]`. {{ ref(page="procedural-macros.html#derive-macros") }}|
| `#[proc_macro_attribute]` | `F`  | Marcar `fn` como **atributo macro** para novo `#[x]`. {{ ref(page="procedural-macros.html#attribute-macros") }}|

{{ tablesep() }}

| Derivados | Ligado | Explicação |
|-------|---|-------------|
| `#[derive(X)]` | `T` | Deixe alguma macro proc fornecer um goodish `impl` de `trait X`. {{ hot() }} {{ ref(page="") }}|

<!-- | `#[derive(Eq)]` |  | xxx{{ ref(page="") }}|
| `#[derive(PartialEq)]` | |  xxx|
| `#[derive(Ord)]` | |  xxx|
| `#[derive(PartialOrd)]` | |  xxx|
| `#[derive(Clone)]` | |  xxx|
| `#[derive(Copy)]` | |  xxx|
| `#[derive(Hash)]` | |  xxx|
| `#[derive(Default)]` | |  xxx|
| `#[derive(Debug)]` | |  xxx| -->


</fixed-3-column>


</div></panel></tab>






<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-5" name="tab-group-preprocessing">
<label for="tab-preprocessing-5"><b><code>#[cfg]</code></b></label>
<panel><div class="color-header undefined-color-3">

Atributos que regem a compilação condicional:

<fixed-3-column class="color-header special_example extra-wide">

| Atributos de Configuração | Ligado | Explicação |
|-------|---|-------------|
| `#[cfg(X)]` | `*` | Incluir o item se a configuração `X` {{ ref(page="conditional-compilation.html#the-cfg-attribute") }}|
| `#[cfg(all(X, Y, Z))]` | `*` | Incluir o item se todas as opções forem mantidas. {{ ref(page="conditional-compilation.html#conditional-compilation") }}|
| `#[cfg(any(X, Y, Z))]` | `*` | Incluir o item se pelo menos uma opção for mantida. {{ ref(page="conditional-compilation.html#conditional-compilation") }}|
| `#[cfg(not(X))]` | `*` | Incluir o item se `X` não se mantém. {{ ref(page="conditional-compilation.html#conditional-compilation") }}|
| `#[cfg_attr(X, foo = "msg")]` | `*` | Aplicar `#[foo = "msg"]` se configuração `X` {{ ref(page="conditional-compilation.html#the-cfg_attr-attribute") }}|

{{ tablesep() }}

> Nota, as opções podem ser definidas várias vezes, ou seja, a mesma chave pode aparecer com vários valores. `#[cfg(target_feature = "avx")]` **e ** `#[cfg(target_feature = "avx2")]` para ser verdade ao mesmo tempo.

{{ tablesep() }}

| Opções Conhecidas | Ligado | Explicação |
|-------|---|-------------|
| `#[cfg(debug_assertions)]` | `*` | Se `debug_assert!()` O & co. entraria em pânico. {{ ref(page="conditional-compilation.html#debug_assertions") }}|
| `#[cfg(feature = "foo")]` | `*` | Quando seu crate foi compilado com _f._ `foo`. {{ hot() }} {{ ref(page="conditional-compilation.html#conditional-compilation") }}|
| `#[cfg(target_arch = "x86_64")]` | `*` | A arquitectura da CPU crate é compilado para. {{ ref(page="conditional-compilation.html#target_arch") }}|
| `#[cfg(target_env = "msvc")]` | `*` | Como DLLs e funções são interf. com em OS. {{ ref(page="conditional-compilation.html#target_env") }}|
| `#[cfg(target_endian = "little")]` | `*` | Razão principal da falha do seu novo prot de custo zero. {{ ref(page="conditional-compilation.html#target_endian") }}|
| `#[cfg(target_family = "unix")]` | `*` | O sistema operacional familiar pertence a. {{ ref(page="conditional-compilation.html#target_family") }}|
| `#[cfg(target_feature = "avx")]` | `*` | Se uma determinada classe de instruções está disponível. {{ ref(page="conditional-compilation.html#target_feature") }}|
| `#[cfg(target_os = "macos")]` | `*` | Sistema operacional, o seu código será executado. {{ ref(page="conditional-compilation.html#target_os") }}|
| `#[cfg(target_pointer_width = "64")]` | `*` | Quantos bits de ptrs, `usize` e as palavras têm. {{ ref(page="conditional-compilation.html#target_pointer_width") }}|
| `#[cfg(target_vendor = "apple")]` | `*` |  Fabricante do alvo. {{ ref(page="conditional-compilation.html#target_vendor") }}|
| `#[cfg(panic = "unwind")]` | `*` | Se `unwind` ou `abort` Vai acontecer no pânico. {{ todo() }}|
| `#[cfg(proc_macro)]` | `*` | Se crate compilado como macro proc. {{ ref(page="conditional-compilation.html#proc_macro") }}|
| `#[cfg(test)]` | `*` | Se compilado com `cargo test`. {{ hot() }} {{ ref(page="conditional-compilation.html#test") }}|

</fixed-3-column>



</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-preprocessing-6" name="tab-group-preprocessing">
<label for="tab-preprocessing-6"><b><code>build.rs</code></b></label>
<panel><div class="color-header undefined-color-3">

Variáveis de ambiente e saídas relacionadas com o programa pré- compilação. Considere ** build- rs**{{ link(url="https://docs.rs/build-rs/0.1.2/build/") }} Em vez disso.

<fixed-2-column class="color-header special_example extra-wide">

| Ambiente de Entrada | Explicação {{ link(url="https://doc.rust-lang.org/cargo/reference/environment-variables.html") }} |
|-------|-------------|
| `CARGO_FEATURE_X` |  Variável de ambiente definida para cada recurso `x` activado.  |
| {{ tab() }} `CARGO_FEATURE_SOMETHING` |  Se a funcionalidade `something` foram ativados. |
| {{ tab() }} `CARGO_FEATURE_SOME_FEATURE` | Se _f._ `some-feature` foram ativados; traço `-` convertido para `_`. |
| `CARGO_CFG_X` | Expo cfg's; une-se a mult. opt. por `,` e converte `-` para `_`.|
| {{ tab() }} `CARGO_CFG_TARGET_OS=macos` |  Se `target_os` foram ajustados para `macos`. |
| {{ tab() }} `CARGO_CFG_TARGET_FEATURE=avx,avx2` |  Se `target_feature` foram ajustados para `avx` e `avx2`. |
| `OUT_DIR` |  Onde a saída deve ser colocada. |
| `TARGET` |  Alvo triplo a ser compilado. |
| `HOST` |  Máquina tripla (executando este script de compilação). |
| `PROFILE` |  Pode ser `debug` ou `release`. |

<footnotes>

Disponível em `build.rs` via `env::var()?`. Lista não exaustiva.

</footnotes>

</fixed-2-column>

<fixed-2-column class="color-header special_example extra-wide">

{{ tablesep() }}

| Saída String | Explicação {{ link(url="https://doc.rust-lang.org/cargo/reference/build-scripts.html") }} |
|-------|-------------|
| `cargo::rerun-if-changed=PATH` | (Apenas) execute isto `build.rs` outra vez se `PATH` Mudou. |
| `cargo::rerun-if-env-changed=VAR` | (Apenas) execute isto `build.rs` novamente se o ambiente `VAR` Mudou. |
| `cargo::rustc-cfg=KEY[="VALUE"]` | Emit administrado `cfg` opção a ser usada para compilação posterior. |
| `cargo::rustc-cdylib-link-arg=FLAG ` | Ao construir um `cdylib`, passar a bandeira do linker. |
| `cargo::rustc-env=VAR=VALUE ` | Emit var acessível via `env!()` em crate durante a compilação. |
| `cargo::rustc-flags=FLAGS` | Adicionar sinalizadores especiais ao compilador. {{ todo() }} |
| `cargo::rustc-link-lib=[KIND=]NAME` | Vincular a biblioteca nativa como se fosse via `-l` Opção. |
| `cargo::rustc-link-search=[KIND=]PATH` | Procurar o caminho para a biblioteca nativa como se fosse via `-L` Opção. |
| `cargo::warning=MESSAGE` | Aviso do compilador de emissão. |

<footnotes>

Emitido de `build.rs` via `println!()`. Lista não exaustiva.

</footnotes>

</fixed-2-column>

</div></panel></tab>


</tabs>


<footnotes>

Para a coluna _On_ nos atributos: <br>
`C` significa no nível crate (normalmente dado como `#![my_attr]` no arquivo de nível superior). <br>
`M` significa nos módulos. <br>
`F` significa em funções. <br>
`S` significa em static. <br>
`T` significa nos tipos. <br>
`X` significa algo especial. <br>
`!` significa em macros. <br>
`*` significa em quase qualquer item. <br>

</footnotes>
