+++
template = "misc.html"
weight = 100
title = "Perguntas frequentes"
description = "Perguntas frequentes sobre o guia de referência da linguagem Rust, seu público, funcionamento e conteúdo."

[extra]
translation_of = "faq.md"
source_hash = "6be2500217a867dcf67ce403fe862da162067b3b642f9a0d162c1336edb9286a"
+++


# FAQ {#faq}

---


## Site {#site}

### Quem é o público alvo? Por que você não explica ...? {#who-is-the-target-audience-why-don-t-you-explain}

Mesmo correndo o risco de ser específico demais, a _persona_ para quem a página foi escrita tem:

- mais de 3 anos de experiência com linguagens que não sejam Rust (Java, Python, C, ...)
- mais de 2 semanas de experiência com Rust (leu um livro ou concluiu um tutorial)
- alguma familiaridade com conceitos de baixo nível, como memória e ponteiros

É claro que esperamos que o conteúdo seja útil também para quem não se encaixa nesse perfil, mas sem prejudicar a experiência direta que buscamos oferecer ao público-alvo.


### Enviei uma mensagem antes. Por que você não corrigiu...? {#i-sent-a-message-earlier-why-didn-t-you-fix}

Algumas sugestões encerradas como _wontfix_ recebem uma breve explicação no GitHub. O motivo mais comum para algo não ser corrigido é que o comentário era curto ou enigmático demais e não deixava claro o que estava realmente errado.


### Por que todos os gráficos HTML? Por que você não usa imagens? {#why-all-the-html-graphics-why-don-t-you-use-images}

Imagens são mais fáceis de criar, mas mais difíceis de versionar. Entre PNG, SVG e HTML, o HTML ofereceu o melhor equilíbrio.


### Eu criei X, você pode ligá-lo? {#i-created-x-can-you-link-it}

Talvez. A política atual não é definitiva, mas segue aproximadamente estas regras:

- Para adicionar um item a uma lista existente, ele deve ter alta qualidade e a lista não pode ficar longa demais.
- Para adicionar um link específico em outro lugar, ele deve ser _o melhor de sua categoria_ para aquela finalidade.


### Porquê o pentagrama? {#why-the-pentagram}

O pentagrama tem algumas propriedades desejáveis:

- mais fácil e seguro de executar que heptagramas e tridecagramas,
- mais rápido para desenhar,
- tem documentação excelente que abrange vários séculos,
- e, acima de tudo, requer menos sangue, portanto é mais ergonômico.

Em outras palavras, o pentagrama é o Rust dos círculos de invocação.


### Você é satanista? {#are-you-a-satanist}

Todas as perguntas sobre esse assunto devem ser dirigidas ao espelho do seu banheiro em uma noite sem lua.


### Você pode remover o pentagrama? {#can-you-remove-the-pentagram}

O pentagrama falou. O pentagrama fica.



## Operações {#operations}

### Como posso construir uma cópia offline? {#how-can-i-build-an-offline-copy}

Compile o site e depois sirva as páginas geradas por HTTP:

```
zola build
python3 -m http.server 8000 --directory public
```

Abra `http://127.0.0.1:8000/`. No Windows, use `python` em vez de `python3`, se necessário.


### Como posso ver qual é a versão implantada? {#how-can-i-see-what-the-deployed-version-is}

Clique na linha da data ou subtítulo para ver o hash Git da versão publicada.



### Acabei de formatar minha unidade, como faço para executar o script de implantação? {#i-just-formatted-my-drive-how-do-i-run-the-deploy-script}

No Windows:
- Instale o Git e adicione todas as ferramentas Unix, especialmente o `bash`, ao PATH
- Em “Variáveis de Ambiente”, coloque o caminho do Git antes de `C:\windows\system32` no PATH
- Instale o Zola
- Instale o Node.js
- `npm install`



### Como faço para atualizar o Prism? {#how-do-i-upgrade-prism}

- Acesse [https://prismjs.com/download.html](https://prismjs.com/download.html)
- Selecione a versão: "Minified"
- Selecione o tema: "Default"
- Selecione a linguagem: "Rust" (e somente Rust)
- Selecione os plugins: "Keep Markup" e "Highlight Keywords" (experimental)
- Salve os arquivos e substitua os correspondentes em `static`
- No `git`, descarte as alterações de CSS que deixarem a página visualmente incorreta, como mudanças em `font-style` ou `background`


### Converter imagens não dispostas para dados URIs? {#convert-unwilling-images-to-data-uris}

- https://ezgif.com/image-to-datauri
- Adicione a `postprocess.js`



## Jurídico {#legal}

### Posso traduzir a página? {#am-i-allowed-to-translate-the-page}

Sim, pode seguir em frente. Você não precisa pedir outra permissão e não há requisitos _especiais_. Ainda assim, peço que [respeite estas condições](/pt-BR/legal/). A forma mais simples é:

- Altere o rodapé da página para algo como:
    ```
    Translated and hosted by [YOU], based on cheats.rs (Ralf Biedert)
    ```
- Remova meu nome da seção "Operador".


### O que significa "interferência"? {#what-does-interference-mean}

Este trabalho busca oferecer conteúdo de alta qualidade em um formato específico. Respeitamos todos os direitos e posições razoáveis de terceiros, relativos a propriedade intelectual ou não. Ainda assim, se você usar leis de propriedade intelectual ou semelhantes de forma que possa ser percebida como ameaça para influenciar o conteúdo ou o design deste trabalho ou de trabalhos similares, perderá a “boa situação”.

Para deixar claro: enquanto estiver em boa situação, você pode copiar ou hospedar novamente o trabalho e fazer [quase qualquer alteração](/pt-BR/legal/#copyright-information) em sua própria cópia. Você só perderá essa condição se tentar impor sua vontade aos outros.

{{ tablesep() }}
