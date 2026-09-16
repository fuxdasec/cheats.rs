+++
title = "Conversões de strings"
description = "Conversões entre strings, bytes, caminhos, strings do sistema operacional, strings C e valores numéricos em Rust."
weight = 28
template = "topic.html"

[extra]
seo_title = "Conversões de strings"
anchor = "string-conversions"
print = true
translation_of = "standard-library/string-conversions.md"
source_hash = "519e4eb495d432c2eff93afd141b4ebefdefc8d51961c07c0238312d66e18c8b"
+++

Se você ** quer** uma string de tipo &hellip;

<!-- Create a horizontal scrollable area on small displays to preserve layout-->
<div style="overflow:auto;">
<div style="min-width: 100%; width: 650px;">


<tabs>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-1" name="tab-group-str" checked>
<label for="tab-str-1"><code>String</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`x`|
|`CString`|`x.into_string()?` |
|`OsString`|`x.to_str()?.to_string()`|
|`PathBuf`|`x.to_str()?.to_string()`|
|`Vec<u8>` <sup>1</sup> |`String::from_utf8(x)?`|
|`&str`|`x.to_string()` <sup>`i`</sup> |
|`&CStr`|`x.to_str()?.to_string()` |
|`&OsStr`|`x.to_str()?.to_string()`|
|`&Path`|`x.to_str()?.to_string()`|
|`&[u8]` <sup>1</sup> |`String::from_utf8_lossy(x).to_string()`|

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-2" name="tab-group-str" >
<label for="tab-str-2"><code>CString</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`CString::new(x)?`|
|`CString`|`x`|
|`OsString` |`CString::new(x.to_str()?)?`|
|`PathBuf`|`CString::new(x.to_str()?)?`|
|`Vec<u8>` <sup>1</sup> |`CString::new(x)?`|
|`&str`|`CString::new(x)?`|
|`&CStr`|`x.to_owned()` <sup>`i`</sup> |
|`&OsStr` |`CString::new(x.to_os_string().into_string()?)?`|
|`&Path`|`CString::new(x.to_str()?)?`|
|`&[u8]` <sup>1</sup> |`CString::new(Vec::from(x))?`|
|`*mut c_char` <sup>2</sup> |`unsafe { CString::from_raw(x) }`|

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-3" name="tab-group-str" >
<label for="tab-str-3"><code>OsString</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`OsString::from(x)` <sup>`i`</sup> |
|`CString`|`OsString::from(x.to_str()?)`|
|`OsString`|`x`|
|`PathBuf`|`x.into_os_string()`|
|`Vec<u8>` <sup>1</sup> |`unsafe { OsString::from_encoded_bytes_unchecked(x) }`|
|`&str`|`OsString::from(x)` <sup>`i`</sup>|
|`&CStr`|`OsString::from(x.to_str()?)`|
|`&OsStr`|`OsString::from(x)` <sup>`i`</sup>|
|`&Path`|`x.as_os_str().to_owned()`|
|`&[u8]` <sup>1</sup> |`unsafe { OsString::from_encoded_bytes_unchecked(x.to_vec()) }`|

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-35" name="tab-group-str" >
<label for="tab-str-35"><code>PathBuf</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`PathBuf::from(x)` <sup>`i`</sup>|
|`CString`|`PathBuf::from(x.to_str()?)`|
|`OsString`|`PathBuf::from(x)` <sup>`i`</sup>|
|`PathBuf`|`x`|
|`Vec<u8>` <sup>1</sup> |`unsafe { PathBuf::from(OsString::from_encoded_bytes_unchecked(x)) }` |
|`&str`|`PathBuf::from(x)` <sup>`i`</sup>|
|`&CStr`|`PathBuf::from(x.to_str()?)`|
|`&OsStr`|`PathBuf::from(x)` <sup>`i`</sup>|
|`&Path`|`PathBuf::from(x)` <sup>`i`</sup>|
|`&[u8]` <sup>1</sup> |`unsafe { PathBuf::from(OsString::from_encoded_bytes_unchecked(x.to_vec())) }` |

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-4" name="tab-group-str" >
<label for="tab-str-4"><code>Vec&lt;u8&gt;</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`x.into_bytes()`|
|`CString`|`x.into_bytes()`|
|`OsString`|`x.into_encoded_bytes()`|
|`PathBuf`|`x.into_os_string().into_encoded_bytes()`|
|`Vec<u8>` <sup>1</sup> |`x`|
|`&str`|`Vec::from(x.as_bytes())`|
|`&CStr`|`Vec::from(x.to_bytes_with_nul())`|
|`&OsStr`|`Vec::from(x.as_encoded_bytes())`|
|`&Path`|`Vec::from(x.as_os_str().as_encoded_bytes())`|
|`&[u8]` <sup>1</sup> |`x.to_vec()`|

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-5" name="tab-group-str" >
<label for="tab-str-5"><code>&str</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`x.as_str()`|
|`CString`|`x.to_str()?`|
|`OsString`|`x.to_str()?`|
|`PathBuf`|`x.to_str()?`|
|`Vec<u8>` <sup>1</sup> |`std::str::from_utf8(&x)?`|
|`&str`|`x`|
|`&CStr`|`x.to_str()?`|
|`&OsStr`|`x.to_str()?`|
|`&Path`|`x.to_str()?`|
|`&[u8]` <sup>1</sup> |`std::str::from_utf8(x)?`|

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-6" name="tab-group-str" >
<label for="tab-str-6"><code>&CStr</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`CString::new(x)?.as_c_str()`|
|`CString`|`x.as_c_str()`|
|`OsString`|`x.to_str()?`|
|`PathBuf`| {{ todo() }}<sup>,3</sup> |
|`Vec<u8>` <sup>1</sup><sup>,4</sup> |`CStr::from_bytes_with_nul(&x)?`|
|`&str`| {{ todo() }}<sup>,3</sup> |
|`&CStr`|`x`|
|`&OsStr` | {{ todo() }} |
|`&Path`| {{ todo() }} |
|`&[u8]` <sup>1</sup><sup>,4</sup> |`CStr::from_bytes_with_nul(x)?`|
|`*const c_char` <sup>1</sup> |`unsafe { CStr::from_ptr(x) }`|

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-8" name="tab-group-str" >
<label for="tab-str-8"><code>&OsStr</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`OsStr::new(&x)`|
|`CString`| {{ todo() }} |
|`OsString`|`x.as_os_str()`|
|`PathBuf`|`x.as_os_str()`|
|`Vec<u8>` <sup>1</sup> |`unsafe { OsStr::from_encoded_bytes_unchecked(&x) }`|
|`&str`|`OsStr::new(x)`|
|`&CStr`| {{ todo() }} |
|`&OsStr`|`x`|
|`&Path`|`x.as_os_str()`|
|`&[u8]` <sup>1</sup> | `unsafe { OsStr::from_encoded_bytes_unchecked(x) }` |


</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-85" name="tab-group-str" >
<label for="tab-str-85"><code>&Path</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`Path::new(x)` <sup>`r`</sup>|
|`CString`|`Path::new(x.to_str()?)` |
|`OsString`|`Path::new(x.to_str()?)` <sup>`r`</sup>|
|`PathBuf`|`Path::new(x.to_str()?)` <sup>`r`</sup>|
|`Vec<u8>` <sup>1</sup> |`unsafe { Path::new(OsStr::from_encoded_bytes_unchecked(&x)) }`|
|`&str`|`Path::new(x)` <sup>`r`</sup>|
|`&CStr`|`Path::new(x.to_str()?)` |
|`&OsStr`|`Path::new(x)` <sup>`r`</sup>|
|`&Path`|`x`|
|`&[u8]` <sup>1</sup> |`unsafe { Path::new(OsStr::from_encoded_bytes_unchecked(x)) }` |

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-7" name="tab-group-str" >
<label for="tab-str-7"><code>&[u8]</code></label>
<panel><div class="stringconversion">

| Se você tem ** `x` de tipo &hellip;| Use este &hellip; |
| --- | --- |
|`String`|`x.as_bytes()`|
|`CString`|`x.as_bytes()`|
|`OsString`|`x.as_encoded_bytes()`|
|`PathBuf`|`x.as_os_str().as_encoded_bytes()`|
|`Vec<u8>` <sup>1</sup> |`&x`|
|`&str`|`x.as_bytes()`|
|`&CStr`|`x.to_bytes_with_nul()`|
|`&OsStr`|`x.as_encoded_bytes()`|
|`&Path`|`x.as_os_str().as_encoded_bytes()`|
|`&[u8]` <sup>1</sup> |`x`|

</div></panel></tab>

<!-- NEW TAB -->
<tab>
<input type="radio" id="tab-str-9" name="tab-group-str" >
<label for="tab-str-9"><b>Outros</b></label>
<panel><div class="stringconversion">

| Você quer ** | E ter... `x` | Use este &hellip; |
| --- | --- | --- |
|<b>`*const c_char`</b>|<b>`CString`</b>|`x.as_ptr()`|


</div></panel></tab>

<!-- End tabs -->
</tabs>

<!-- End overflow protection -->
</div></div>


<footnotes>

<sup>i</sup> Formulário curto `x.into()` possível se o tipo pode ser inferido. <br>
<sup>r</sup> Formulário curto `x.as_ref()` possível se o tipo pode ser inferido.<br>
<sup>1</sup> Você tem que garantir `x` vem com uma representação válida para o tipo de string (por exemplo, dados UTF-8 para uma `String`).<br>
<sup>2</sup> A `c_char` ** deve ter vindo de um anterior `CString`. Se vier de FFI ver `&CStr` Em vez disso.<br>
<sup>3</sup> `x` falta terminar `0x0`Melhor maneira de provavelmente ir através `CString`.<br>
<sup>4</sup> Deve assegurar `x` realmente termina com `0x0`.<br>

</footnotes>
