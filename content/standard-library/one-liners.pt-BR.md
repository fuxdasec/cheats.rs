+++
title = "Soluções em uma linha"
description = "Trechos úteis da biblioteca padrão de Rust para operações comuns que são fáceis de esquecer."
weight = 23
template = "topic.html"

[extra]
seo_title = "Soluções em uma linha"
anchor = "one-liners"
print = true
translation_of = "standard-library/one-liners.md"
source_hash = "ea77684418c2f037ef0ca52381630fa2ef79d7d8fe744b93e66b223e9bb9a008"
+++

Excertos que são comuns, mas ainda fáceis de esquecer. Veja **Rust Cookbook** {{ link(url="https://rust-lang-nursery.github.io/rust-cookbook/") }} para mais.


<!--
Pull requests para esta seção são muito bem-vindos. A ideia é reunir soluções em que:
- Should be `std` only for now, no 3rd party libs (maybe exception for `rand`?)
- “A maioria das pessoas” já tenha encontrado o problema
- A solução não seja apenas um método trivial de uma struct “óbvia” (por exemplo, ordenar um slice com `x.sort()` provavelmente é óbvio demais.)
-->

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">


<tabs>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-2" name="tab-api-sized" checked>
<label for="tab-api-2"><b>Cordas</b></label>
<panel><div class="color-header one-liners cheats">

| Intenção | Excerto |
|---------|-------------|
| Concatenar strings (qualquer `Display`{{ below(target="/standard-library/string-output/#string-output") }} Ou seja, sim.  {{ std(page="std/fmt/index.html") }}  <sup>1</sup>    {{ edition(ed="'21") }} | `format!("{x}{y}")` |
| Adicionar texto (qualquer `Display` a qualquer `Write`).  {{ edition(ed="'21") }} {{ std(page="std/fmt/index.html#write") }} | `write!(x, "{y}")` |
| Dividido por padrão separador. {{ std(page="std/str/pattern/trait.Pattern.html") }} {{ link(url="https://stackoverflow.com/a/38138985") }} | `s.split(pattern)` |
| {{ tab() }} ... com `&str` | `s.split("abc")` |
| {{ tab() }} ... com `char` | `s.split('/')` |
| {{ tab() }} ... com encerramento | `s.split(char::is_numeric)`|
| Dividir por espaço em branco. {{ std(page="std/primitive.str.html#method.split_whitespace") }} | `s.split_whitespace()` |
| Dividido por linhas novas. {{ std(page="std/primitive.str.html#method.lines") }}  | `s.lines()` |
| Dividido por expressão regular. {{ link(url="https://docs.rs/regex/latest/regex/struct.Regex.html#method.split") }} <sup>2</sup> | ` Regex::new(r"\s")?.split("one two three")` |

<footnotes>

<sup>1</sup>Aloca; se `x` ou `y` não serão utilizados posteriormente considerar a utilização `write!` ou `std::ops::Add`.<br>
<sup>2</sup> Requer [regex](https://crates.io/crates/regex)  crate.

</footnotes>


</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-1" name="tab-api-sized">
<label for="tab-api-1"><b>I/O</b></label>
<panel><div class="color-header one-liners cheats">

| Intenção | Excerto |
|---------|-------------|
| Criar um novo arquivo {{ std(page="std/fs/struct.File.html#method.open") }} | `File::create(PATH)?`  |
| {{ tab() }}  O mesmo, via OpenOptions | `OpenOptions::new().create(true).write(true).truncate(true).open(PATH)?` |
| Ler o arquivo como `String` {{ std(page="std/fs/fn.read_to_string.html") }} | `read_to_string(path)?` |

<!-- <footnotes>

<sup>*</sup> We're a bit short on space here, <code>t</code> means true.

</footnotes> -->

</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-4" name="tab-api-sized">
<label for="tab-api-4"><b>Macros</b></label>
<panel><div class="color-header one-liners cheats">

| Intenção | Excerto |
|---------|-------------|
| Argumentos de variáveis macro w. | `macro_rules! var_args { ($($args:expr),*) => {{ }} }` |
| {{ tab() }} `args`, por exemplo, chamando `f` várias vezes. | {{ tab() }} ` $( f($args); )*` |

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-5" name="tab-api-sized">
<label for="tab-api-5"><b>Transformações {{ hot() }}</b></label>
<panel><div class="color-header one-liners cheats">

| Tipo de Início | Recurso |
|---------|-------------|
| `Option<T> -> …` | Veja o [guia de referência baseado em tipos](https://upsuper.github.io/rust-cheatsheet/) |
| `Result<T, R> -> …` | Veja o [guia de referência baseado em tipos](https://upsuper.github.io/rust-cheatsheet/) |
| `Iterator<Item=T> -> …` | Veja o [guia de referência baseado em tipos](https://upsuper.github.io/rust-cheatsheet/) |
| `&[T] -> …` | Veja o [guia de referência baseado em tipos](https://upsuper.github.io/rust-cheatsheet/) |
| `Future<T> -> …` | Ver o [Futures Cheat Sheet](https://rufflewind.com/img/rust-futures-cheatsheet.html) |

<!-- <footnotes>

<sup>*</sup> We're a bit short on space here, <code>t</code> means true.

</footnotes> -->

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-api-3" name="tab-api-sized">
<label for="tab-api-3"><b>Esotéricos</b>{{ esoteric() }}</label>
<panel><div class="color-header one-liners cheats">

| Intenção | Excerto |
|---------|-------------|
| Capturas de fecho mais limpas | <code>wants_closure({ let c = outer.clone(); move &vert;&vert; use_clone(c) })</code> |
| Corrigir a inferência em '`try`« encerramentos | <code>iter.try_for_each(&vert;x&vert; { Ok::<(), Error>(()) })?;</code> |
| Iterar _e_ editar `&mut [T]` se `T` Copy. | `Cell::from_mut(mut_slice).as_slice_of_cells()` |
| Obter subslice com comprimento. | `&original_slice[offset..][..length]` |
| Canário assim trait `T` é compatível com **dyn**. {{ ref(page="items/traits.html#dyn-compatibility")}} | `const _: Option<&dyn T> = None;` |
| _Sever trick_ para unificar os tipos. {{ link(url="https://github.com/dtolnay/semver-trick") }} | `my_crate = "next.version"` em `Cargo.toml` + tipos de reexportação. |
| Usar macro dentro do próprio crate. {{ link(url="https://users.rust-lang.org/t/use-macro-inside-proc-macro-crate/61095/4") }} | `macro_rules! internal_macro {}` com `pub(crate) use internal_macro;` |


</div></panel></tab>


</tabs>


</div></div>
