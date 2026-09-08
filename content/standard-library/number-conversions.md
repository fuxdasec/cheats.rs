+++
title = "Number Conversions"
description = "Rust integer and floating-point conversion behavior, risks, and available APIs."
weight = 27
template = "topic.html"

[extra]
seo_title = "Number Conversions"
anchor = "number-conversions"
previous = "/standard-library/iterators/"
previous_title = "Iterators"
next = "/standard-library/string-conversions/"
next_title = "String Conversions"
print = true
+++
<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">
<div class="color-header number">

As-<b style="">correct</b>-as-it-currently-gets number conversions.

| ↓ Have / Want → | `u8` &hellip; `i128` |  `f32` / `f64` | String |
| --- | --- |  --- |--- |
| `u8` &hellip; `i128` | `u8::try_from(x)?` <sup>1</sup> |  `x as f32` <sup>3</sup> | `x.to_string()` |
| `f32` / `f64` | `x as u8` <sup>2</sup> |  `x as f32` | `x.to_string()` |
| `String` | `x.parse::<u8>()?` | `x.parse::<f32>()?` | `x` |


<footnotes>

<sup>1</sup> If type true subset `from()` works directly, e.g., `u32::from(my_u8)`. <br/>
<sup>2</sup> Truncating (`11.9_f32 as u8` gives `11`) and saturating (`1024_f32 as u8` gives `255`); _c_. below. <br/>
<sup>3</sup> Might misrepresent number (`u64::MAX as f32`) or produce `Inf` (`u128::MAX as f32`).

</footnotes>

{{ tablesep() }}

> Also see **Casting-** and **Arithmetic Pitfalls** {{ above(target="/memory-layout/basic-types/#boolean-and-numeric-types") }} for more things that can go wrong working with numbers.


<!-- end overflow -->
</div>
</div>
</div>
