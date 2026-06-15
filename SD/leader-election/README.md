[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/d9mRg8uS)

# Eleicao de coordenador

## Demonstração

https://github.com/user-attachments/assets/a007699b-1d7e-48b5-9749-1e829fc93efe

## Explicação

Esta versao usa o algoritmo Bully.

O `server.py` guarda o recurso compartilhado, que neste projeto e o `score`.
Os processos `node.py` sao clientes e tambem podem virar coordenadores. O no
com maior ID vivo tem prioridade para ser coordenador.

## Como rodar

Abra quatro terminais.

Terminal 1:

```bash
python server.py
```

Terminal 2:

```bash
python node.py 1
```

Terminal 3:

```bash
python node.py 2
```

Terminal 4:

```bash
python node.py 3
```

Inicialmente, o no `3` e o coordenador.

## Como simular a falha do coordenador

No terminal do no `3`, pressione `Ctrl+C`.

Os outros nos vao perceber que o coordenador nao respondeu. Pelo algoritmo
Bully, o no vivo com maior ID deve vencer a eleicao. Neste caso, o no `2`
vira o novo coordenador.

Voce deve ver mensagens parecidas com:

```text
[NODE 1] Coordenador 3 nao respondeu
[NODE 1] Iniciando eleicao Bully: falha do coordenador 3
[NODE 2] Recebi ELECTION do no 1; respondendo OK
[NODE 2] Sou o novo coordenador
[NODE 1] Novo coordenador: no 2
```

Depois disso, os nos continuam pedindo acesso ao `server.py` e atualizando o
score usando o novo coordenador.
