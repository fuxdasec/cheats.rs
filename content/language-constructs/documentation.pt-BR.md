+++
title = "Documentação"
description = "Comentários de documentação, links internos, exemplos e sintaxe do rustdoc em Rust."
weight = 13
template = "topic.html"

[extra]
seo_title = "Documentação"
anchor = "documentation"
print = true
translation_of = "language-constructs/documentation.md"
source_hash = "aa79e19c9abe2ca093b57ea56bc00748a775608487e9517c8cd75ce96b2a0f75"
+++
Depuradores odeiam este truque: evite bugs com documentação.


<fixed-2-column>

| Exemplo | Explicação |
|--------|-------------|
| `///` | **Comentário de documentação** externo de linha;<sup>1</sup> {{ book(page="ch14-02-publishing-to-crates-io.html#making-useful-documentation-comments") }} {{ ex(page="meta/doc.html#documentation") }} {{ ref(page="comments.html#doc-comments")}} use em tipos, traits, funções etc. |
| `//!` | Comentário de documentação interno de linha, geralmente no início do arquivo. |
| `//` | Comentário de linha; use para documentar o fluxo ou os detalhes internos do código. |
| `/* … */` | Comentário de bloco. <sup>2</sup> {{ deprecated() }} |
| `/** … */` | Comentário de documentação externo de bloco. <sup>2</sup> {{ deprecated() }} |
| `/*! … */` | Comentário de documentação interno de bloco. <sup>2</sup> {{ deprecated() }} |

</fixed-2-column>

<footnotes>

<sup>1</sup> [Diretivas de ferramentas](/tooling/tooling-directives/#tooling-directives) mostra o que pode ser feito dentro dos comentários de documentação. <br>
<sup>2</sup> Em geral, comentários de bloco são desaconselhados pela experiência de edição. Prefira o comentário de linha equivalente, com suporte da IDE.

</footnotes>
