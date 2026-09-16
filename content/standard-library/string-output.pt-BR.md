+++
title = "Saída de strings"
description = "Formatação, impressão, depuração, exibição, argumentos de formato e APIs de saída de strings em Rust."
weight = 29
template = "topic.html"

[extra]
seo_title = "Saída de strings"
anchor = "string-output"
print = true
translation_of = "standard-library/string-output.md"
source_hash = "019df598fd73b85d804c0c8e89342c1f36d73fa521b05863da41adfbe5ca535f"
+++

Como converter tipos em um `String`, ou output-los.

<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-strop-1" name="tab-group-strop" checked>
<label for="tab-strop-1"><b>APIs</b></label>
<panel><div class="color-header undefined-color-3">

Rust tem, entre outros, essas APIs para converter tipos para saída stringified, coletivamente chamado _format_ macros:

| Macro | Saída | Notas |
| --- | --- | --- |
|`format!(fmt)` | `String` | Pão e manteiga "para `String`" conversor. |
|`print!(fmt)`| Consola | Escreve para a saída padrão. |
|`println!(fmt)`| Consola | Escreve para a saída padrão. |
| `eprint!(fmt)`| Consola | Escreve em erro padrão. |
|`eprintln!(fmt)`| Consola | Escreve em erro padrão. |
|`write!(dst, fmt)` | Buffer | Não te esqueças de também `use std::io::Write;` |
|`writeln!(dst, fmt)` | Buffer | Não te esqueças de também `use std::io::Write;` |

{{ tablesep() }}

| Método | Notas |
| --- | --- |
|`x.to_string()` {{ std(page="std/string/trait.ToString.html") }} | Produz `String`, implementado para qualquer `Display` Tipo. |

{{ tablesep() }}

Aqui. `fmt` é uma string literal como `"hello {}"`, que especifica saída (compare "Formating" tab) e parâmetros adicionais.


</div></panel></tab>



<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-strop-2" name="tab-group-strop">
<label for="tab-strop-2"><b>Tipos Imprimíveis</b></label>
<panel><div class="color-header undefined-color-3">

In `format!` e amigos, tipos converter via trait `Display` `"{}"` {{ std(page="std/fmt/trait.Display.html") }} ou `Debug` `"{:?}"` {{ std(page="std/fmt/trait.Debug.html") }} , lista não exaustiva:

| Tipo | Implementos |  |
| --- | --- | --- |
|`String`| `Debug, Display` | |
|`CString`| `Debug` | |
|`OsString`| `Debug` | |
|`PathBuf`| `Debug` |  |
|`Vec<u8>` | `Debug` | |
|`&str`|`Debug, Display` | |
|`&CStr`|`Debug` | |
|`&OsStr`| `Debug` | |
|`&Path`| `Debug` | |
|`&[u8]` |`Debug` | |
|`bool` |`Debug, Display` | |
|`char` |`Debug, Display` | |
|`u8` &hellip; `i128` |`Debug, Display` | |
|`f32`, `f64` |`Debug, Display` | |
|`!` |`Debug, Display` | |
|`()` |`Debug` | |

{{ tablesep() }}

Em suma, praticamente tudo é `Debug`; mais _especial_ tipos podem precisar de manipulação especial ou conversão {{ above(target="/standard-library/string-conversions/#string-conversions" ) }} para `Display`.

</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-strop-3" name="tab-group-strop">
<label for="tab-strop-3"><b>Formatação</b></label>
<panel><div>

Cada designador de argumentos no formato macro está em branco `{}`, `{argument}`, ou segue um [** Syntax **](https://doc.rust-lang.org/std/fmt/index.html#syntax) básico:


```
{ [argument] ':' [[fill] align] [sign] ['#'] [width [$]] ['.' precision [$]] [type] }
```

<div class="color-header undefined-color-3">

| Elemento |  Significado |
|---------| ---------|
| `argument` |  Número (`0`, `1`, ...), variável {{ edition(ed="'21") }} ou nome,{{ edition(ed="'18") }}, por exemplo, `print!("{x}")`. |
| `fill` | O caractere com o qual preencher espaços vazios (por exemplo, `0`), se `width` é especificado. |
| `align` | Esquerda (`<`), centro (`^`), ou direito (`>`), se a largura for especificada. |
| `sign` | Pode ser `+` para que o sinal seja sempre impresso. |
| `#` | [Formatação alternativa](https://doc.rust-lang.org/std/fmt/index.html#sign0), p. ex., pretificar `Debug`{{ std(page="std/fmt/trait.Debug.html") }} formatação `?` ou prefixo hex com `0x`. |
| `width` | Largura mínima (&geq;), enchimento com `fill` (por omissão no espaço). Se começar com `0`, zero acolchoado. |
| `precision` | Dígitos decimais (&geq;) para numéricos, ou largura máxima para não numéricos. |
| `$` | Interpretar `width` ou `precision` como identificador de argumento em vez de permitir a formatação dinâmica. |
| **`type`** | `Debug`{{ std(page="std/fmt/trait.Debug.html") }} (`?`) formatação, hex (`x`), binário (`b`), octal (`o`), ponteiro (`p`), exp (`e`) … [ver mais](https://doc.rust-lang.org/std/fmt/index.html#traits). |

</div>


{{ tablesep() }}


<div class="color-header undefined-color-3">

| Exemplo de Formato | Explicação |
|---------|-------------|
| `{}` | Imprimir o argumento seguinte usando `Display`.{{ std(page="std/fmt/trait.Display.html") }} |
| `{x}` | Mesmo, mas use variável `x` A partir do âmbito. {{ edition(ed="'21") }} |
| `{:?}` | Imprimir o argumento seguinte usando `Debug`.{{ std(page="std/fmt/trait.Debug.html") }} |
| `{2:#?}` | Pretty-print o 3<sup>rd</sup> argumento com `Debug`{{ std(page="std/fmt/trait.Debug.html") }} formatação. |
| `{val:^2$}` | Centralizar o `val` argumento nomeado, largura especificada pelo 3<sup>rd</sup> argumento. |
| `{:<10.3}` | Alinhar à esquerda com largura 10 e uma precisão de 3.|
| `{val:#x}` | Formato `val` argumento como hex, com um líder `0x` (formato alterado para `x`). |

</div>

{{ tablesep() }}


<div class="color-header undefined-color-3">

| Exemplo completo | Explicação |
|---------|-------------|
| `println!("{}", x)` | Imprimir `x` usando `Display`{{ std(page="std/fmt/trait.Display.html") }} ligado std. sair e adicionar nova linha. {{ edition(ed="'15") }}  {{ deprecated() }} |
| `println!("{x}")` | Mesmo, mas use variável `x` A partir do âmbito. {{ edition(ed="'21") }}  |
| `format!("{a:.3} {b:?}")` | Converter `a` com 3 dígitos, adicionar espaço, `b` com `Debug` {{ std(page="std/fmt/trait.Debug.html") }}, retorno `String`.  {{ edition(ed="'21") }} |

</div>


</div></panel></tab>


</tabs>

{{ tablesep() }}

