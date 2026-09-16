+++
title = "Cargo"
description = "Comandos frequentes do Cargo para criar, compilar, testar, documentar e publicar projetos Rust."
weight = 31
template = "topic.html"

[extra]
seo_title = "Cargo"
anchor = "cargo"
print = true
translation_of = "tooling/cargo.md"
source_hash = "437fe1cebd33951df2358e928c4dcd3a99d0d07ba01e01277adb5de030fc9765"
+++
Comandos e ferramentas úteis.


<div class="color-header tooling">

| Comando | Descrição |
|--------| ---- |
| `cargo init` | Cria um projeto usando a edição mais recente. |
| <code>cargo <span class="cargo-prefix">b</span>uild</code> | Compila o projeto em modo de depuração; use <code>--<span class="cargo-prefix">r</span>elease</code> para habilitar todas as otimizações. |
| <code>cargo <span class="cargo-prefix">c</span>heck</code> | Verifica se o projeto compilaria, de forma muito mais rápida. |
| <code>cargo <span class="cargo-prefix">t</span>est</code> | Executa os testes do projeto. |
| <code>cargo <span class="cargo-prefix">d</span>oc --no-deps --open</code> | Gera localmente a documentação do seu código. |
| <code>cargo <span class="cargo-prefix">r</span>un</code> | Executa o projeto, se ele produzir um binário (main.rs). |
| {{ tab() }} `cargo run --bin b` | Executa o binário `b`. Unifica as features com as de outros dependentes, o que pode ser confuso. |
| {{ tab() }} <code>cargo run --<span class="cargo-prefix">p</span>ackage w</code> | Executa o programa principal do membro `w` do workspace. Trata as features de forma mais previsível. |
| <code>cargo … --timings</code> | Mostra quais crates tornaram sua compilação demorada. {{ hot() }} |
| `cargo tree` | Mostra o grafo de dependências e todas as crates usadas pelo projeto, inclusive transitivamente. |
| {{ tab() }} `cargo tree -i foo` | Consulta dependências inversas e explica por que `foo` é usada. |
| `cargo info foo` | Mostra os metadados da crate `foo`; por padrão, da versão usada pelo projeto. |
| <code>cargo +{nightly, stable} …</code> | Usa a toolchain indicada para executar o comando, por exemplo, para ferramentas exclusivas de nightly. |
| <code>cargo +1.85.0 …</code> | Também aceita diretamente uma versão específica. |
| `cargo +nightly …` | Alguns comandos exclusivos de nightly; substitua `…` por um dos comandos abaixo. |
| {{ tab() }} `rustc -- -Zunpretty=expanded` | Mostra as macros expandidas. {{ experimental() }} |
| `rustup doc` | Abre a documentação offline de Rust, incluindo os livros. Útil durante um voo! |

</div>

<footnotes>

Aqui, <code>cargo <span class="cargo-prefix">b</span>uild</code> indica que você pode escrever `cargo build` ou apenas `cargo b`; e <code>--<span class="cargo-prefix">r</span>elease</code> indica que a opção pode ser substituída por `-r`.

</footnotes>


{{ tablesep() }}


Estes são componentes opcionais do `rustup`.
Instale-os com `rustup component add [tool]`.


<div class="color-header tooling">

| Ferramenta | Descrição |
|--------| ---- |
| `cargo clippy` | Verificações adicionais ([lints](https://rust-lang.github.io/rust-clippy/master/)) que detectam usos incorretos de APIs e código pouco idiomático. {{ link(url = "https://github.com/rust-lang/rust-clippy") }} |
| `cargo fmt` | Formatador automático de código (`rustup component add rustfmt`). {{ link(url = "https://github.com/rust-lang/rustfmt") }} |

</div>

{{ tablesep() }}

Você pode encontrar muitos outros plugins do Cargo [**aqui**](https://crates.io/categories/development-tools::cargo-plugins?sort=downloads).


{{ tablesep() }}
