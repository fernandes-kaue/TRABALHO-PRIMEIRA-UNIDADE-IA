# Busca A* para rotas em uma cidade virtual

Aplicação web que demonstra o algoritmo de busca A* (A estrela) para encontrar rotas entre os pontos do mapa fornecido na atividade. O programa permite escolher origem, destino e função heurística, mostrando tanto o caminho final quanto as ruas avaliadas durante a busca.

O projeto foi feito com HTML, CSS e JavaScript puro. Não utiliza servidor, banco de dados, framework ou biblioteca externa.

## Objetivo

Encontrar uma rota de menor custo entre dois pontos do mapa. Cada rua possui um custo em unidades (U), calculado pela quantidade de quadrados percorridos entre seus extremos.

Por exemplo, se uma rua liga dois pontos separados por três quadrados, seu custo é `3 U`.

## Como executar

Há duas formas simples de abrir o projeto:

1. Abra o arquivo `index.html` diretamente em um navegador.
2. Ou, no terminal dentro desta pasta, execute:

   ```bash
   python -m http.server 8000
   ```

   Em seguida, acesse `http://localhost:8000`.

## Como usar a interface

1. Escolha uma origem e um destino nos campos superiores.
2. Escolha a heurística desejada.
3. Clique em **Calcular rota**.

Também é possível usar o mapa: o primeiro ponto clicado define a origem e o segundo define o destino. Após o segundo clique, o cálculo é realizado.

O resultado apresenta:

- a heurística aplicada;
- o custo total da rota, em unidades;
- a quantidade de nós expandidos;
- o trajeto com o custo acumulado em cada ponto.

Exemplo de saída:

```text
A(0) → B(1) → C(4) → H(6)
```

Isso significa que o caminho começa em `A` com custo `0`, chega a `B` com custo acumulado `1`, a `C` com custo `4` e assim por diante.

## Legenda do mapa

| Cor | Significado |
| --- | --- |
| Cinza | Rua disponível no mapa |
| Amarelo | Rua testada pelo algoritmo durante a busca |
| Azul | Rua que pertence à rota final |
| Verde | Ponto de origem |
| Vermelho | Ponto de destino |

## Como o algoritmo A* funciona

O A* escolhe, a cada passo, o ponto com menor valor estimado pela expressão:

```text
f(n) = g(n) + h(n)
```

Em que:

- `g(n)` é o custo real acumulado desde a origem até o ponto `n`;
- `h(n)` é uma estimativa da distância entre `n` e o destino;
- `f(n)` é o valor usado para decidir qual ponto será explorado primeiro.

No código, a lista `aberto` armazena os pontos que ainda podem ser explorados. Ela é ordenada pelo valor de `f`. Quando um ponto é escolhido, os seus vizinhos são verificados e recebem um novo custo caso exista um caminho melhor até eles.

Quando o destino é alcançado, o programa percorre os registros de ponto anterior para montar a rota final.

## Heurísticas disponíveis

O usuário pode selecionar uma das três heurísticas pedidas no enunciado.

### Distância de Manhattan

```text
|x1 - x2| + |y1 - y2|
```

Soma as diferenças horizontal e vertical entre dois pontos. É adequada para mapas em grade.

### Distância Euclidiana

```text
√((x1 - x2)² + (y1 - y2)²)
```

Calcula a distância em linha reta entre dois pontos.

### Distância de Chebyshev

```text
max(|x1 - x2|, |y1 - y2|)
```

Usa a maior diferença entre os eixos horizontal e vertical.

## Representação do mapa

Cada ponto do mapa é guardado com coordenadas simples, por exemplo:

```js
A: [0, 0]
B: [1, 0]
C: [4, 0]
```

As ligações entre os pontos são armazenadas em uma lista com origem, destino e sentido. Uma ligação sem `"dupla"` permite somente o deslocamento indicado pela seta. Uma ligação marcada como `"dupla"` permite deslocamento nos dois sentidos.

```js
["B", "G"]           // B → G
["A", "B", "dupla"] // A ↔ B
```

A distância de cada ligação é calculada pelas coordenadas dos dois extremos. Depois, essa lista é convertida em um grafo, onde cada ponto mantém apenas os vizinhos que podem ser alcançados seguindo o sentido da rua.

Essa representação evita dados repetidos e facilita a alteração do mapa caso seja necessário adicionar ou remover uma rua.

## Estrutura dos arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura da página, controles e área de resultado |
| `style.css` | Cores, layout responsivo e aparência da interface |
| `mapa.js` | Dados dos pontos, ruas, distâncias e criação do grafo |
| `astar.js` | Implementação do algoritmo A* e das heurísticas |
| `desenho.js` | Desenho do mapa e das cores no canvas |
| `interface.js` | Campos, botões, resultado e eventos de clique |

## Pontos principais para apresentação

1. O mapa foi transformado em um grafo de pontos e ligações com custos.
2. O A* combina custo acumulado (`g`) e estimativa até o destino (`h`).
3. A heurística pode ser trocada sem alterar o mapa ou o algoritmo principal.
4. O resultado textual mostra a sequência da rota e os custos acumulados.
5. O canvas diferencia visualmente ruas testadas e ruas escolhidas, além de mostrar o sentido permitido pelas setas pretas.
