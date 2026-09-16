+++
title = "Outras construções"
description = "Outros elementos da sintaxe de Rust e operadores comuns que não se encaixam nos demais grupos de construções da linguagem."
weight = 14
template = "topic.html"

[extra]
seo_title = "Outras construções"
anchor = "miscellaneous"
print = true
translation_of = "language-constructs/miscellaneous.md"
source_hash = "0c35b47cb198d53fb72ba0ea47856beaf078759a1fc3e1596d7af7124382f38c"
+++
Símbolos que não se encaixam nas outras categorias, mas também são úteis.

<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `!` | **Tipo never**, sempre vazio. {{ book(page="ch19-04-advanced-types.html#the-never-type-that-never-returns") }} {{ ex(page="fn/diverging.html#diverging-functions") }} {{ std(page="std/primitive.never.html") }} {{ ref(page="types.html#never-type") }} |
| {{ tab() }} `fn f() -> ! {}` | Função que nunca retorna; compatível com qualquer tipo, como `let x: u8 = f();`. |
| {{ tab() }} `fn f() -> Result<(), !> {}` | Função que deve retornar `Result`, mas indica que nunca pode produzir `Err`. {{ experimental() }} |
| {{ tab() }} `fn f(x: !) {}` | Função que existe, mas nunca pode ser chamada. Não é muito útil. {{ esoteric() }} {{ experimental() }} |
| `_` | Vínculo **curinga** {{ ref(page="patterns.html#wildcard-pattern")}} sem nome, como em <code>&vert;x, _&vert; {}</code>. |
| {{ tab() }} `let _ = x;` | Atribuir ao curinga não faz nada: **não** {{ bad() }} move o valor de `x` nem preserva seu escopo! |
| {{ tab() }} `_ = x;` | É possível atribuir _qualquer coisa_ a `_` sem `let`, isto é, `_ = ignore_rval();` {{ hot() }}. |
| `_x` | Vínculo de variável que não gera avisos de _variável não utilizada_. |
| `1_234_567` | Separador numérico para facilitar a leitura. |
| `1_u8` | Especificador de tipo para **literais numéricos** {{ ex(page="types/literals.html#literals") }} {{ ref(page="tokens.html#number-literals") }}; também aceita `i8`, `u16` etc. |
| `0xBEEF`, `0o777`, `0b1001` | Literais inteiros hexadecimais (`0x`), octais (`0o`) e binários (`0b`). |
| `12.3e4`, `1E-8` | **Notação científica** para literais de ponto flutuante. {{ref(page="tokens.html#floating-point-literals")}} |
| `r#foo` | **Identificador bruto** {{ book(page="appendix-01-keywords.html#raw-identifiers") }} {{ ex(page="compatibility/raw_identifiers.html#raw-identifiers") }} para compatibilidade entre edições. {{ esoteric() }} |
| `'r#a` | **Rótulo bruto de lifetime** {{ todo() }} para compatibilidade entre edições. {{ esoteric() }} |
| `x;` | Terminador de **instrução**; {{ ref(page="statements.html")}} compare com **expressões**. {{ ex(page="expression.html") }} {{ ref(page="expressions.html")}} |

</fixed-2-column>




## Operadores comuns {#common-operators}

Rust suporta a maioria dos operadores esperados (`+`, `*`, `%`, `=`, `==` etc.), incluindo **sobrecarga**. {{ std(page="std/ops/index.html")}} Como seu comportamento não difere do usual, eles não são listados aqui.
