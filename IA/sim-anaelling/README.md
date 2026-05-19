# Simulated Anaelling + N Queens

Esse trabalho foi feito para a matéria de IA para ilustrar a otimização do algoritmo de Simulated Anaelling no problema das N rainhas.

> Para rodar o programa basta ter o go instalado na versão `>1.25.9` usar o comando `go run .` (para rodar sem criar o binário)
> Na main, escolha se quer rodar o run (padrao) para visualizar o algoritmo ou o benchmark (descomente a linha e comente a do run)

Abaixo está o relatório do trabalho em markdown (original em LaTeX na raíz).

---

# Introdução

O problema das N-Rainhas consiste em posicionar $N$ rainhas em um
tabuleiro $N \times N$ de forma que nenhuma rainha ataque outra. Como
rainhas atacam na mesma linha, coluna e diagonais, uma solução válida
deve evitar todos esses conflitos.

Neste trabalho foi implementado o algoritmo Simulated Annealing para
buscar soluções para o problema. A técnica é inspirada no processo de
recozimento de metais, em que uma solução pode aceitar estados piores
temporariamente para escapar de mínimos locais. Ao longo da execução, a
temperatura diminui e o algoritmo passa a aceitar menos movimentos
ruins.

# Modelagem do Problema

A representação utilizada foi um vetor de inteiros. Cada posição do
vetor representa uma linha do tabuleiro, e o valor armazenado representa
a coluna onde a rainha daquela linha está posicionada. Por exemplo, em
um tabuleiro $N = 4$, o vetor:

$$[1, 3, 0, 2]$$

representa rainhas nas posições $(0,1)$, $(1,3)$, $(2,0)$ e $(3,2)$.

A solução inicial é gerada como uma permutação aleatória dos valores de
$0$ até $N-1$. Assim, cada linha possui exatamente uma rainha e cada
coluna também é usada uma única vez. Isso reduz bastante o espaço de
busca, pois os principais conflitos restantes ocorrem nas diagonais.

# Função de Custo

A função de custo mede a quantidade de conflitos entre rainhas. O
objetivo do algoritmo é minimizar essa função até chegar ao valor zero.

No código, são verificados:

-   conflitos nas diagonais;

-   conflitos de coluna, como verificação adicional.

Quanto menor o número de conflitos, melhor é a solução. Uma solução com
custo igual a zero é uma solução válida para o problema.

# Geração de Vizinhos

A estratégia de vizinhança utilizada consiste em escolher duas linhas
aleatórias e trocar as colunas das rainhas dessas linhas. Como o
tabuleiro é representado por uma permutação, essa troca mantém uma
rainha por linha e preserva o uso das colunas.

Essa vizinhança é simples, mas adequada para o problema, pois modifica
parcialmente o estado atual sem reconstruir todo o tabuleiro.

# Simulated Annealing

O algoritmo inicia com uma solução aleatória e uma temperatura inicial
$T_0$. A cada iteração, é gerado um vizinho e comparado seu custo com o
custo da solução atual.

Se o vizinho for melhor, ele é aceito. Se for pior, ainda pode ser
aceito com probabilidade:

$$P = e^{-\Delta E / T}$$

onde $\Delta E$ é a diferença entre o custo do vizinho e o custo atual,
e $T$ é a temperatura corrente.

Após cada iteração, a temperatura é reduzida por resfriamento
geométrico:

$$T = T \cdot \alpha$$

Os critérios de parada utilizados foram:

-   encontrar uma solução com custo zero;

-   temperatura menor que $T_{min}$;

-   atingir o limite máximo de iterações.

Na implementação, foram usados $T_{min} = 0{,}0001$ e limite máximo de
$100000$ iterações.

# Experimentos

Foram realizados experimentos com os valores de $N$ sugeridos na
especificação: $8$, $16$, $32$ e $128$. Para cada valor de $N$, foram
testadas três combinações de temperatura inicial e taxa de resfriamento.
Cada combinação foi executada três vezes, e a tabela apresenta as médias
obtidas.

| $N$ | $T_0$ | $\alpha$ | Conflitos médios | Iterações médias |
|---:|---:|---:|---:|---:|
| 8 | 20 | 0,9995 | 0,000000 | 340,333333 |
| 8 | 5 | 0,9500 | 1,000000 | 211,000000 |
| 8 | 1 | 0,9000 | 0,333333 | 58,333333 |
| 16 | 20 | 0,9995 | 0,000000 | 7081,666667 |
| 16 | 5 | 0,9500 | 0,666667 | 210,000000 |
| 16 | 1 | 0,9000 | 1,666667 | 88,000000 |
| 32 | 20 | 0,9995 | 0,000000 | 10436,333333 |
| 32 | 5 | 0,9500 | 2,666667 | 211,000000 |
| 32 | 1 | 0,9000 | 5,333333 | 88,000000 |
| 128 | 20 | 0,9995 | 0,000000 | 15422,000000 |
| 128 | 5 | 0,9500 | 32,000000 | 211,000000 |
| 128 | 1 | 0,9000 | 45,333333 | 88,000000 |

| $N$ | $T_0$ | $\alpha$ | Tempo médio |
|---:|---:|---:|---:|
| 8 | 20 | 0,9995 | 159,224 µs |
| 8 | 5 | 0,9500 | 89,444 µs |
| 8 | 1 | 0,9000 | 27,618 µs |
| 16 | 20 | 0,9995 | 4,305241 ms |
| 16 | 5 | 0,9500 | 120,495 µs |
| 16 | 1 | 0,9000 | 44,563 µs |
| 32 | 20 | 0,9995 | 17,476301 ms |
| 32 | 5 | 0,9500 | 330,651 µs |
| 32 | 1 | 0,9000 | 136,746 µs |
| 128 | 20 | 0,9995 | 387,604950 ms |
| 128 | 5 | 0,9500 | 5,155863 ms |
| 128 | 1 | 0,9000 | 2,108906 ms |

# Análise dos Resultados

Os resultados mostram que a combinação $T_0 = 20$ e $\alpha = 0{,}9995$
foi a mais consistente. Ela encontrou soluções com zero conflitos para
todos os valores de $N$ testados. Isso ocorreu porque a temperatura
inicial maior e o resfriamento mais lento permitiram ao algoritmo
explorar melhor o espaço de busca antes de se tornar mais restritivo.

As combinações com $T_0 = 5$, $\alpha = 0{,}95$ e $T_0 = 1$,
$\alpha = 0{,}9$ foram mais rápidas, mas apresentaram mais conflitos,
principalmente para $N = 32$ e $N = 128$. Isso indica que o resfriamento
mais rápido reduz o tempo de execução, porém aumenta a chance de o
algoritmo parar em uma solução ainda não ideal.

Também é possível perceber que, conforme $N$ aumenta, o tempo de
execução cresce. Isso acontece porque a função de custo compara pares de
rainhas para detectar conflitos, o que torna cada avaliação mais cara em
tabuleiros maiores.

# Conclusão

A implementação conseguiu aplicar o Simulated Annealing ao problema das
N-Rainhas e produzir soluções válidas nos principais testes. O
experimento mostrou a importância da escolha dos parâmetros:
temperaturas maiores e resfriamento mais lento tendem a melhorar a
qualidade da solução, enquanto temperaturas menores e resfriamento
rápido reduzem o tempo, mas podem deixar conflitos no tabuleiro.

Assim, o trabalho confirma que o Simulated Annealing é uma abordagem
adequada para problemas de busca heurística, especialmente quando é
necessário escapar de mínimos locais e explorar um espaço de soluções
muito grande.
