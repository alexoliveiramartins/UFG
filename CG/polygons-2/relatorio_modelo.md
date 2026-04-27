# Relatório - T3 Complementar: Desenho e Preenchimento de Polígonos

**Aluno:** Alex Benjamim de Oliveira Martins
**Matrícula:** 202301419
**Disciplina:** Computação Gráfica

## Objetivo
Este relatório apresenta os resultados comparativos do desenho e preenchimento de polígonos aleatórios (5 a 10 vértices) utilizando três abordagens diferentes, executadas 1000 vezes cada:
1. Implementação Manual de Rasterização (Algoritmo DDA para linhas e Scanline para preenchimento).
2. WebGL direto (utilizando primitivas aceleradas e rotinas de Ear-Clipping para triangulação).
3. Three.js (Pipeline de alto nível utilizando `ShapeGeometry` e `Line`).

## Ambiente de Execução (Hardware e Software)
*Preencha com os dados reais do seu computador*
- **CPU:** [Ex: Intel Core i7-10750H @ 2.60GHz / AMD Ryzen 5 5600X]
- **Memória RAM:** [Ex: 16 GB DDR4]
- **GPU:** [Ex: NVIDIA GeForce RTX 3060 Laptop GPU]
- **Sistema Operacional:** [Ex: Windows 11 com WSL2 Ubuntu]
- **Navegador Web:** [Ex: Google Chrome versão 114.0.5735.134]

### Ativação da Renderização por Hardware na Web
O modo de aceleração de hardware foi ativado no navegador da seguinte forma:
- Acessou-se as configurações avançadas do navegador (ex: `chrome://settings/system`).
- A opção "Usar aceleração de hardware quando disponível" foi ativada.
- No WebGL e no Three.js, esta aceleração nativa é feita por meio do back-end gráfico do próprio navegador que gerencia as chamadas à GPU.

## Análise Comparativa de Desempenho

*Abaixo estão os tempos obtidos após rodar o benchmark pelo arquivo providenciado (Substitua pelos valores exibidos na sua tela).*

| Abordagem | Tempo Total (1000 iterações) em ms | Tempo Médio por Iteração (ms) |
| :--- | :--- | :--- |
| **Manual (DDA + Scanline)** | ~ [---] ms | ~ [---] ms |
| **WebGL** | ~ [---] ms | ~ [---] ms |
| **Three.js** | ~ [---] ms | ~ [---] ms |

## Conclusões
*Escreva uma pequena conclusão aqui referente aos resultados acima.*
Espera-se que a versão **WebGL** seja massivamente mais rápida por repassar o desenho dos triângulos processados para a pipeline de renderização acelerada (Placa de vídeo/GPU). A versão com **Three.js** tende a possuir um overhead um pouco maior em relação ao WebGL puro devido a todas as instâncias de classe e cálculo de matrizes adicionais que executa, mas ainda sendo mais eficaz que a versão puramente **Manual** rodando na CPU via Javascript.
A implementação manual, devido ao varrimento pixel-a-pixel no array de imagem do canvas e aos cálculos condicionais de intersecção em CPU para cada linha (Scanline), possui o caminho mais lento de execução.
