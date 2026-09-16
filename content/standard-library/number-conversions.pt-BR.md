+++
title = "Conversões numéricas"
description = "Comportamento, riscos e APIs disponíveis para conversões de inteiros e números de ponto flutuante em Rust."
weight = 27
template = "topic.html"

[extra]
seo_title = "Conversões numéricas"
anchor = "number-conversions"
print = true
translation_of = "standard-library/number-conversions.md"
source_hash = "b67bfb79c406d992a2816980ac754f4b0df24eb90b5d4c2d428f72b1da85d36e"
+++

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">
<div class="color-header number">

Como...<b style="">correto</b>- como-ele-atualmente-obtém conversões de números.

| ↓ Tem / Quer → | `u8` &hellip; `i128` |  `f32` / `f64` | String |
| --- | --- |  --- |--- |
| `u8` &hellip; `i128` | `u8::try_from(x)?` <sup>1</sup> |  `x as f32` <sup>3</sup> | `x.to_string()` |
| `f32` / `f64` | `x as u8` <sup>2</sup> |  `x as f32` | `x.to_string()` |
| `String` | `x.parse::<u8>()?` | `x.parse::<f32>()?` | `x` |


<footnotes>

<sup>1</sup> Se digitar subconjunto verdadeiro `from()` funciona directamente, por exemplo, `u32::from(my_u8)`. <br/>
<sup>2</sup> Truncando (`11.9_f32 as u8` dá `11`) e saturação (`1024_f32 as u8` dá `255`); _c_. abaixo. <br/>
<sup>3</sup> Pode deturpar o número (`u64::MAX as f32`) ou produzir `Inf` (`u128::MAX as f32`).

</footnotes>

{{ tablesep() }}

> Veja também **Casting-** e **Petfalls aritméticos** {{ above(target="/memory-layout/basic-types/#boolean-and-numeric-types") }} para mais coisas que podem dar errado trabalhando com números.


<!-- end overflow -->
</div>
</div>
</div>
