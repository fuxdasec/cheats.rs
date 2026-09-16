+++
title = "Correspondência de padrões"
description = "Sintaxe de correspondência de padrões de Rust para desestruturação, vínculos, guardas, intervalos e alternativas."
weight = 9
template = "topic.html"

[extra]
seo_title = "Correspondência de padrões"
anchor = "pattern-matching"
print = true
translation_of = "language-constructs/pattern-matching.md"
source_hash = "be67ac45ceb6027afcb49ff05f35169528d2413b60a2aaaac34880c2b486aeb8"
+++
Construções encontradas em expressões `match` ou `let`, ou nos parâmetros de funções.


<fixed-2-column>

| Exemplo | Explicação |
|---------|-------------|
| `match m {}` | Inicia a **correspondência de padrões** {{ book(page="ch06-02-match.html") }} {{ ex(page="flow_control/match.html") }} {{ ref(page="expressions/match-expr.html") }} e usa braços de correspondência; veja a próxima tabela. |
| `let S(x) = get();` | Observe que `let` também **desestrutura** {{ ex(page="flow_control/match/destructuring.html") }}, de forma semelhante à tabela abaixo. |
| {{ tab() }} `let S { x } = s;` | Apenas `x` recebe o vínculo com o valor `s.x`. |
| {{ tab() }} `let (_, b, _) = abc;` | Apenas `b` recebe o vínculo com o valor `abc.1`. |
| {{ tab() }} `let (a, ..) = abc;` | Também é possível ignorar o restante. |
| {{ tab() }} `let (.., a, b) = (1, 2);` | Vínculos específicos têm precedência sobre o restante; aqui, `a` vale `1` e `b` vale `2`. |
| {{ tab() }} `let s @ S { x } = get();` | Vincula `s` a `S` enquanto `x` é vinculado a `s.x`: **vínculo em padrão**. {{ book(page="ch18-03-pattern-syntax.html#-bindings") }} {{ ex(page="flow_control/match/binding.html#binding") }} {{ ref(page="patterns.html#identifier-patterns") }} Veja abaixo {{ esoteric() }}. |
| {{ tab() }} `let w @ t @ f = get();` | Armazena três cópias do resultado de `get()` em `w`, `t` e `f`. {{ esoteric() }} |
| {{ tab() }} <code>let (&vert;x&vert; x) = get();</code> | Um padrão de alternativas incomum,{{ below(target="/language-constructs/pattern-matching/#pattern-matching")}} **não** uma closure.{{ bad() }} Equivale a `let x = get();` {{ esoteric() }}. |
| `let Ok(x) = f();` | **Não funciona** {{ bad() }} se o padrão puder ser **refutado**; {{ ref(page="expressions/if-expr.html#if-let-expressions") }} use `let else` ou `if let`. |
| `let Ok(x) = f();` | Mas pode funcionar se as alternativas forem não habitadas; por exemplo, `f` retorna `Result<T, !>` {{ edition(ed="1.82+") }}. |
| `let Ok(x) = f() else {};` | Tenta atribuir {{ rfc(page="3137-let-else.html") }}; se não corresponder, `else {}` deve executar `break`, `return`, `panic!` etc. {{ edition(ed="1.65+")}} {{ hot() }} |
| `if let Ok(x) = f() {}` | Ramifica se o padrão puder receber o valor, como uma variante `enum`. É açúcar sintático. <sup>*</sup> |
| <code>if let &hellip; && let &hellip; { }</code> | **Cadeias let**: {{ ref(page="expressions/if-expr.html#r-expr.if.chains.bindings")}} usa mais de um vínculo sem aninhamento. {{ edition(ed="'24") }} |
| `while let Ok(x) = f() {}` | Equivalente; aqui, continua chamando `f()` e executa `{}` enquanto o padrão corresponder. |
| `fn f(S { x }: S)` | Parâmetros de função também funcionam como `let`; aqui, `x` é vinculado ao campo `s.x` de `f(s)`. {{ esoteric() }} |

</fixed-2-column>


<footnotes>

<sup>*</sup> Expande-se para `match get() { Some(x) => {}, _ => () }`.

</footnotes>



{{ tablesep() }}

Braços de correspondência em expressões `match`. O lado esquerdo desses braços também pode aparecer em expressões `let`.

<fixed-2-column class="color-header special_example">

| Dentro de um braço de match | Explicação |
|---------|-------------|
| `E::A => {}` | Corresponde à variante de enum `A`; veja **correspondência de padrões**. {{ book(page="ch06-02-match.html") }} {{ ex(page="flow_control/match.html") }} {{ ref(page="expressions/match-expr.html") }} |
| `E::B ( .. ) => {}` | Corresponde à variante de tupla `B` de um enum, ignorando todos os campos. |
| `E::C { .. } => {}` | Corresponde à variante de struct `C` de um enum, ignorando todos os campos. |
| `S { x: 0, y: 1 } => {}` | Corresponde a uma struct com valores específicos: apenas `s` com `s.x` igual a `0` e `s.y` igual a `1`. |
| `S { x: a, y: b } => {}` | Corresponde a uma struct com _quaisquer_ valores de {{ bad() }} e vincula `s.x` a `a` e `s.y` a `b`. |
| {{ tab() }} `S { x, y } => {}` | O mesmo, abreviado: `s.x` e `s.y` são vinculados a `x` e `y`, respectivamente. |
| `S { .. } => {}` | Corresponde a uma struct com quaisquer valores. |
| `D => {}` | Corresponde à variante de enum `E::D` se `D` estiver em `use`. |
| `D => {}` | Corresponde a qualquer valor e o vincula a `D`; pode ser confundido {{ bad() }} com `E::D` se `D` não estiver em `use`. |
| `_ => {}` | Curinga que corresponde a qualquer valor ou a todo o restante. |
| <code>0 &vert; 1 => {}</code> | Alternativas de padrões, ou **padrões or**. {{ rfc( page ="2535-or-patterns.html") }} |
| {{ tab() }} <code>E::A &vert; E::Z => {}</code> | O mesmo, com variantes de enum. |
| {{ tab() }} <code>E::C {x} &vert; E::D {x} => {}</code> | O mesmo, vinculando `x` se todas as variantes tiverem esse campo. |
| {{ tab() }} <code>Some(A &vert; B) => {}</code> | Também pode corresponder a alternativas profundamente aninhadas. |
| {{ tab() }} <code>&vert;x&vert; x => {}</code> | **Padrão or incomum**: {{ above(target="/language-constructs/pattern-matching/#pattern-matching")}}{{bad()}} o <code>&vert;</code> inicial é ignorado; resta <code>x &vert; x</code> e, portanto, <code>x</code>. {{esoteric()}} |
| {{ tab() }} <code>&vert;x => {}</code> | Semelhante: o <code>&vert;</code> inicial é ignorado. {{esoteric() }} |
| `(a, 0) => {}` | Corresponde a uma tupla com qualquer valor em `a` e `0` no segundo elemento. |
| `[a, 0] => {}` | **Padrão de slice**: {{ ref(page="patterns.html#slice-patterns") }} {{ link(url="https://doc.rust-lang.org/edition-guide/rust-2018/slice-patterns.html") }} corresponde a um array com qualquer valor em `a` e `0` no segundo elemento. |
| {{ tab() }} `[1, ..] => {}` | Corresponde a um array que começa com `1`, com qualquer restante: **padrão de subslice**. {{ ref(page="patterns.html#rest-patterns") }} {{ rfc(page="2359-subslice-pattern-syntax.html") }} |
| {{ tab() }} `[1, .., 5] => {}` | Corresponde a um array que começa com `1` e termina com `5`. |
| {{ tab() }} `[1, x @ .., 5] => {}` | O mesmo, vinculando `x` à slice que representa o meio; veja vínculos em padrões. |
| {{ tab() }} `[a, x @ .., b] => {}` | O mesmo, aceitando quaisquer primeiro e último elementos e vinculando-os a `a` e `b`. |
| `1 .. 3 => {}` | **Padrão de intervalo**: {{ book(page="ch18-03-pattern-syntax.html#matching-ranges-of-values-with-") }} {{ ref(page="patterns.html#range-patterns") }} aqui corresponde a `1` e `2`; parcialmente instável. {{ experimental() }} |
| {{ tab() }} `1 ..= 3 => {}` | Padrão de intervalo inclusivo: corresponde a `1`, `2` e `3`. |
| {{ tab() }} `1 .. => {}` | Padrão de intervalo aberto: corresponde a `1` e a qualquer número maior. |
| `x @ 1..=5 => {}` | Vincula o valor correspondente a `x`: **vínculo em padrão**. {{ book(page="ch18-03-pattern-syntax.html#-bindings") }} {{ ex(page="flow_control/match/binding.html#binding") }} {{ ref(page="patterns.html#identifier-patterns") }} Aqui, `x` seria `1`…`5`. |
| {{ tab() }} `Err(x @ Error {..}) => {}` | Também funciona aninhado; aqui, `x` é vinculado a `Error`, o que é especialmente útil com `if` abaixo. |
| `S { x } if x > 10 => {}` | **Guardas de correspondência**: {{ book(page="ch18-03-pattern-syntax.html#extra-conditionals-with-match-guards")}} {{ ex(page="flow_control/match/guard.html#guards")}} {{ ref(page="expressions/match-expr.html#match-guards") }} a condição também precisa ser verdadeira para haver correspondência. |

</fixed-2-column>
