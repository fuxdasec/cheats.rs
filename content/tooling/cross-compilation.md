+++
title = "Cross Compilation"
description = "Rust cross-compilation setup, targets, toolchains, runners, and platform configuration."
weight = 32
template = "topic.html"

[extra]
seo_title = "Cross Compilation"
anchor = "cross-compilation"
previous = "/tooling/cargo/"
previous_title = "Cargo"
next = "/tooling/tooling-directives/"
next_title = "Tooling Directives"
print = true
+++
<!-- <div class="steps"> -->

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">

🔘 Check [target is supported](https://doc.rust-lang.org/rustc/platform-support.html).

🔘 Install target via **`rustup target install aarch64-linux-android`** (for example).

🔘 Install native toolchain (required to _link_, depends on target).

Get from target vendor (Google, Apple, &hellip;), might not be available on all hosts (e.g., no iOS toolchain on Windows).

**Some toolchains require additional build steps** (e.g., Android's `make-standalone-toolchain.sh`).

🔘 Update **`~/.cargo/config.toml`** like this:

```
[target.aarch64-linux-android]
linker = "[PATH_TO_TOOLCHAIN]/aarch64-linux-android/bin/aarch64-linux-android-clang"
```

   or

```
[target.aarch64-linux-android]
linker = "C:/[PATH_TO_TOOLCHAIN]/prebuilt/windows-x86_64/bin/aarch64-linux-android21-clang.cmd"
```

🔘 Set **environment variables** (optional, wait until compiler complains before setting):

```
set CC=C:\[PATH_TO_TOOLCHAIN]\prebuilt\windows-x86_64\bin\aarch64-linux-android21-clang.cmd
set CXX=C:\[PATH_TO_TOOLCHAIN]\prebuilt\windows-x86_64\bin\aarch64-linux-android21-clang.cmd
set AR=C:\[PATH_TO_TOOLCHAIN]\prebuilt\windows-x86_64\bin\aarch64-linux-android-ar.exe
…
```

Whether you set them depends on how compiler complains, not necessarily all are needed.

> Some platforms / configurations can be **extremely sensitive** how paths are specified (e.g., `\` vs `/`) and quoted.


✔️ Compile with **`cargo build --target=aarch64-linux-android`**


<!-- End overflow area -->
</div>
</div>

<!-- End steps  -->
<!-- </div> -->

{{ tablesep() }}
