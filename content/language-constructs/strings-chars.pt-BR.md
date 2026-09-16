+++
title = "Strings e caracteres"
description = "Sintaxe de strings, strings de bytes, caracteres, escapes e literais de strings brutas em Rust."
weight = 12
template = "topic.html"

[extra]
seo_title = "Strings e caracteres"
anchor = "strings-chars"
print = true
translation_of = "language-constructs/strings-chars.md"
source_hash = "ff4aaa5981426f7d75d22e06a01bce08eda54a20c220fd6ac6ddf153f94ce8d3"
+++
Rust oferece várias formas de criar valores textuais.


<fixed-2-column>

| Exemplo | Explicação |
|--------|-------------|
| `"..."` | **Literal de string**: {{ ref(page="tokens.html#string-literals")}}<sup>, 1</sup> um `&'static str` em UTF-8 {{ std(page="std/primitive.str.html") }} que aceita os seguintes escapes. |
| {{ tab() }} `"\n\r\t\0\\"` | **Escapes comuns** {{ ref(page="tokens.html#ascii-escapes") }}; por exemplo, `"\n"` representa uma _nova linha_. |
| {{ tab() }} `"\x36"` | **Escape ASCII** {{ ref(page="tokens.html#ascii-escapes") }} até `7f`; por exemplo, `"\x36"` se torna `6`. |
| {{ tab() }} `"\u{7fff}"` | **Escape Unicode** {{ ref(page="tokens.html#unicode-escapes") }} com até seis dígitos; por exemplo, `"\u{7fff}"` se torna `翿`. |
| `r"..."` | **Literal de string bruta**: {{ ref(page="tokens.html#raw-string-literals")}}<sup>, 1</sup> usa UTF-8, mas não interpreta os escapes acima. |
| `r#"..."#` | Literal de string bruta em UTF-8 que também pode conter `"`. A quantidade de `#` pode variar. |
| `c"..."` | **Literal de string C**: {{ ref(page="tokens.html#c-string-literals")}} um `&'static CStr` terminado em NUL {{ std(page="std/ffi/struct.CStr.html") }} para FFI. {{ edition(ed="1.77+")}} |
| `cr"..."`, `cr#"..."#` | Literal de string C bruta, combinando as formas acima. |
| `b"..."` | **Literal de string de bytes**: {{ ref(page="tokens.html#byte-and-byte-string-literals")}}<sup>, 1</sup> constrói um `&'static [u8; N]` limitado a ASCII. |
| `br"..."`, `br#"..."#` | Literal de string de bytes bruta, combinando as formas acima. |
| `b'x'` | **Literal de byte** ASCII: {{ ref(page="tokens.html#byte-literals")}} um único byte `u8`. |
| `'🦀'` | **Literal de caractere**: {{ ref(page="tokens.html#character-and-string-literals")}} um **char** Unicode de tamanho fixo de quatro bytes. {{ std(page="std/primitive.char.html") }} |

<footnotes>

<sup>1</sup> Aceita várias linhas diretamente. Lembre-se de que `Debug`{{ below(target="/standard-library/string-output/#string-output") }}, como `dbg!(x)` e `println!("{x:?}")`, pode exibi-las como `\n`, enquanto `Display`{{ below(target="/standard-library/string-output/#string-output") }}, como `println!("{x}")`, as exibe como novas linhas.

</footnotes>


</fixed-2-column>
