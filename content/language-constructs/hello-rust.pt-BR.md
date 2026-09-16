+++
title = "Olá, Rust!"
description = "Uma introdução aos pontos fortes de Rust, instalação, primeiros passos e um exemplo executável de Hello World."
weight = 1
template = "topic.html"

[extra]
seo_title = "Olá, Rust!"
anchor = "hello-rust"
print = false
translation_of = "language-constructs/hello-rust.md"
source_hash = "6c49daa09f3988706f17879925dd0c4f98b3d49bbde05c0daadba95710314a32"
+++
Se você está começando em Rust ou quer experimentar os exemplos abaixo:


<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-1" name="tab-hello" checked/>
<label for="tab-hello-1"><b>Hello World</b></label>
<panel><div>
<div id="hellostatic">

```rust
fn main() {
    println!("Hello, world!");
}
```


</div>
<div id="helloplay"></div>
<div id="helloinfo">Serviço fornecido por <a href="https://play.rust-lang.org/" target="_blank" rel="noopener">play.rust-lang.org <sup>🔗</sup></a></div>
<div id="helloctrl"><a href="javascript:show_playground(true);">▶️ Editar e executar</a></div>
</div></panel></tab>


<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-3" name="tab-hello">
<label for="tab-hello-3"><b>Pontos fortes</b></label>
<panel><div>

**Aspectos em que Rust apresenta bons resultados mensuráveis**

- Código compilado com [desempenho semelhante](https://benchmarksgame-team.pages.debian.net/benchmarksgame/box-plot-summary-charts.html) ao de C/C++, com excelente eficiência de memória e energia.
- Pode [evitar 70% dos problemas de segurança](https://www.chromium.org/Home/chromium-security/memory-safety) presentes em C/C++ e a maioria dos problemas de memória.
- O sistema de tipos forte impede [corridas de dados](https://doc.rust-lang.org/nomicon/races.html) e proporciona, entre outras coisas, [“concorrência sem medo”](https://blog.rust-lang.org/2015/04/10/Fearless-Concurrency.html).
- Boa interoperabilidade com C e [dezenas de plataformas suportadas](https://doc.rust-lang.org/rustc/platform-support.html), com base em LLVM.
- [“Linguagem mais amada ou admirada”](https://survey.stackoverflow.co/2023/#section-admired-and-desired-programming-scripting-and-markup-languages) por <strike>4</strike> <strike>5</strike> <strike>6</strike> <strike>7</strike> 8 anos consecutivos. 🤷‍♀️
- Ferramentas modernas: `cargo` para compilações que _simplesmente funcionam_, `clippy` com mais de 700 verificações de qualidade e `rustup` para gerenciar toolchains facilmente.

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-4" name="tab-hello">
<label for="tab-hello-4"><b>Pontos fracos</b></label>
<panel><div>

**Dificuldades que você pode encontrar**

- Curva de aprendizado acentuada;<sup>1</sup> o compilador impõe regras, sobretudo de memória, que seriam apenas boas práticas em outras linguagens.
- Falta de bibliotecas nativas de Rust em algumas áreas, de suporte a certas plataformas, sobretudo embarcadas, e de recursos de IDE.<sup>1</sup>
- Compilação mais demorada do que a de código semelhante em outras linguagens.<sup>1</sup>
- Bibliotecas que usam `unsafe` sem cuidado podem violar garantias de segurança sem que isso seja aparente.
- ~~Ausência de uma especificação formal da linguagem~~, {{ link(url="https://spec.ferrocene.dev/") }} ~~o que pode impedir seu uso autorizado em certas áreas, como aviação e medicina~~. {{ link(url="https://ferrous-systems.com/ferrocene/") }}
- A Rust Foundation pode usar seus direitos de propriedade intelectual para afetar projetos relacionados a Rust, por exemplo, proibindo nomes ou impondo políticas. {{ link(url="https://devclass.com/2023/04/11/dont-call-it-rust-community-complains-about-draft-trademark-policy-restricting-use-of-word-marks/") }}{{ link(url="https://web.archive.org/web/20230413161930/https://old.reddit.com/r/rust/comments/12e7tdb/rust_trademark_policy_feedback_form/") }}<sup>2</sup>


<sup>1</sup> Compare com a [pesquisa sobre Rust](https://blog.rust-lang.org/2020/04/17/Rust-survey-2019.html#why-not-use-rust). <br>
<sup>2</sup> Evitar suas marcas, por exemplo, no nome, URL, logotipo ou identidade visual, provavelmente é suficiente.

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-5" name="tab-hello">
<label for="tab-hello-5"><b>Instalação</b></label>
<panel><div>

**Download**
- Obtenha o instalador em [**rustup.rs**](https://rustup.rs/), opção fortemente recomendada.{{ hot() }}


**IDEs**
- [**Rust Rover**](https://www.jetbrains.com/rust/), gratuito para uso não comercial.
- [Visual Studio Code](https://code.visualstudio.com/) com [**rust-analyzer**](https://rust-analyzer.github.io/), gratuito.


</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-hello-6" name="tab-hello">
<label for="tab-hello-6"><b>Primeiros passos</b></label>
<panel><div>

<!-- Note - Please ONLY submit PRs linking to high-quality, "permanent" sites
            dedicated to learning Rust that work in a browser, are moderately
            condensed, and have a public Git repo and issue tracker.
            Also, this section should be very short <=3 entries, so it should only list
            "the best of their kind".
             -->

**Recursos para iniciantes, organizados por módulos**
- [**Tour of Rust**](https://tourofrust.com/TOC_en.html): código executável e explicações lado a lado.
- [**Rust in Easy English**](https://dhghomon.github.io/easy_rust/Chapter_3.html): mais de 60 conceitos em inglês simples, apresentados por exemplos.
- [**Rust for the Polyglot Programmer**](https://www.chiark.greenend.org.uk/~ianmdlvl/rust-polyglot/index.html): um guia para programadores experientes.

Considere também **The Book**,{{ book(page="") }} **Rust by Example**,{{ ex(page="") }} a **biblioteca padrão**{{ std(page="std") }} e **Learn Rust**.{{ link(url="https://github.com/ImplFerris/LearnRust") }}



> **Opinião** {{ opinionated() }} — Se você nunca viu ou usou Rust, vale visitar um dos links acima antes de continuar; caso contrário, o próximo capítulo pode parecer sucinto demais.

</div></panel></tab>

</tabs>
