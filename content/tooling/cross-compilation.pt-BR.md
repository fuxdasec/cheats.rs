+++
title = "Compilação cruzada"
description = "Configuração de compilação cruzada em Rust, plataformas de destino, toolchains, executores e opções específicas de plataforma."
weight = 32
template = "topic.html"

[extra]
seo_title = "Compilação cruzada"
anchor = "cross-compilation"
print = true
translation_of = "tooling/cross-compilation.md"
source_hash = "ef25597efeb3cb9a233acb9dca253bf4ef41b5edef11f3a65c428e013ada48cc"
+++
<!-- <div class="steps"> -->

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

🔘 Confira se a [plataforma de destino é suportada](https://doc.rust-lang.org/rustc/platform-support.html).

🔘 Instale a plataforma de destino, por exemplo, com **`rustup target install aarch64-linux-android`**.

🔘 Instale a toolchain nativa, necessária para a etapa de _vinculação_ e específica da plataforma de destino.

Obtenha-a do fornecedor da plataforma (Google, Apple etc.). Ela pode não estar disponível em todos os sistemas de desenvolvimento; por exemplo, não há toolchain de iOS para Windows.

**Algumas toolchains exigem etapas adicionais de preparação**, como `make-standalone-toolchain.sh` no Android.

🔘 Atualize **`~/.cargo/config.toml`** desta forma:

```
[target.aarch64-linux-android]
linker = "[PATH_TO_TOOLCHAIN]/aarch64-linux-android/bin/aarch64-linux-android-clang"
```

   ou

```
[target.aarch64-linux-android]
linker = "C:/[PATH_TO_TOOLCHAIN]/prebuilt/windows-x86_64/bin/aarch64-linux-android21-clang.cmd"
```

🔘 Configure as **variáveis de ambiente**. Esta etapa é opcional: aguarde os erros do compilador antes de defini-las.

```
set CC=C:\[PATH_TO_TOOLCHAIN]\prebuilt\windows-x86_64\bin\aarch64-linux-android21-clang.cmd
set CXX=C:\[PATH_TO_TOOLCHAIN]\prebuilt\windows-x86_64\bin\aarch64-linux-android21-clang.cmd
set AR=C:\[PATH_TO_TOOLCHAIN]\prebuilt\windows-x86_64\bin\aarch64-linux-android-ar.exe
…
```

A necessidade de cada variável depende dos erros apresentados pelo compilador; nem todas serão necessárias.

> Algumas plataformas ou configurações são **extremamente sensíveis** à forma como os caminhos são escritos (por exemplo, `\` ou `/`) e delimitados por aspas.


✔️ Compile com **`cargo build --target=aarch64-linux-android`**


<!-- End overflow area -->
</div>
</div>

<!-- End steps  -->
<!-- </div> -->

{{ tablesep() }}
