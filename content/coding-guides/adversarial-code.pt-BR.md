+++
title = "Código adversarial"
description = "Considerações de projeto de APIs em Rust para manter a segurança diante de usos inesperados, mas válidos, por quem chama a API."
weight = 42
template = "topic.html"

[extra]
seo_title = "Código adversarial"
anchor = "adversarial-code"
print = true
translation_of = "coding-guides/adversarial-code.md"
source_hash = "021cd3fe87046cb3dfa10c68f64efab5aee5c1dd9e1033962b55089f23bff6e3"
+++
Código _adversarial_ é código _seguro_ de terceiros que compila, mas não segue as _expectativas_ da API e pode interferir nas suas próprias garantias de segurança.


<div class="color-header redred">


| Você escreve | O código do usuário pode… |
|---------|---------|
| `fn g<F: Fn()>(f: F) { … }` | Entrar em pânico inesperadamente. |
| `struct S<X: T> { … }` | Implementar `T` incorretamente, por exemplo, usar `Deref` de forma inadequada. |
| `macro_rules! m { … }` | Fazer tudo isso; o local de invocação pode ter um escopo _incomum_. |

{{ tablesep() }}

| Padrão de risco | Descrição |
|---------|---------|
| `#[repr(packed)]` |  O alinhamento compactado pode tornar a referência `&s.x` inválida. |
| `impl std::… for S {}`  | Qualquer `impl` de trait, sobretudo de `std::ops`, pode estar incorreta. Em particular… |
| {{ tab() }} `impl Deref for S {}` | Pode executar `Deref` de forma imprevisível, como em `s.x != s.x`, ou entrar em pânico.  |
| {{ tab() }} `impl PartialEq for S {}` | Pode violar as regras de igualdade ou entrar em pânico.  |
| {{ tab() }} `impl Eq for S {}`  | Pode fazer com que `s != s` ou entrar em pânico; não se deve usar `s` em `HashMap` e coleções semelhantes. |
| {{ tab() }} `impl Hash for S {}`  | Pode violar as regras de hashing ou entrar em pânico; não se deve usar `s` em `HashMap` e coleções semelhantes. |
| {{ tab() }} `impl Ord for S {}`  | Pode violar as regras de ordenação ou entrar em pânico; não se deve usar `s` em `BTreeMap` e coleções semelhantes. |
| {{ tab() }} `impl Index for S {}` | Pode indexar de forma imprevisível, como em `s[x] != s[x]`, ou entrar em pânico. |
| {{ tab() }} `impl Drop for S {}` | Pode executar código ou entrar em pânico no fim do escopo `{}` ou durante uma atribuição `s = new_s`. |
| `panic!()` | O código do usuário pode entrar em pânico a _qualquer_ momento, provocando encerramento ou desenrolamento da pilha. |
| <code>catch_unwind(&vert;&vert; s.f(panicky))</code> |  Quem chama a função também pode forçar a observação de um estado inválido em `s`.  |
| `let … = f();` | O nome de uma variável pode afetar a ordem de execução de `Drop`. <sup>1</sup> {{ bad() }}  |

<footnotes>

<sup>1</sup> Em particular, renomear uma variável de <code>_x</code> para <code>&lowbar;</code> muda a semântica e o comportamento de Drop. Para uma variável chamada <code>_x</code>, <code>Drop::drop()</code> é executado no fim do escopo. Com <code>&lowbar;</code>, ele pode ser executado imediatamente na atribuição “aparente”. Ela é aparente porque <code>&lowbar;</code> é um **padrão curinga** {{ ref(page="patterns.html#wildcard-pattern") }} que significa _descarte isto_; o descarte acontece assim que possível, muitas vezes imediatamente!

</footnotes>

{{ tablesep() }}

</div>


> **Implicações**
>
> - Código genérico **não pode garantir segurança se ela depender da cooperação do tipo** com a maioria das traits de `std::`.
> - Se a cooperação do tipo for necessária, use traits `unsafe`, possivelmente definidas por você.
> - Considere a execução de código arbitrário em locais inesperados, como reatribuições e o fim de um escopo.
> - Seu estado ainda pode ser observável depois de um pânico no pior momento possível.
>
> Por consequência, código _seguro_ no sentido de Rust, mas potencialmente letal — como `airplane_speed<T>()` — provavelmente também deve seguir estas orientações.


{{ tablesep() }}
