[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)]()

---

This is a simple example to demonstrate how stubs can be used as remote references in RPC systems. The example was extracted from (Tanenbaum and van Steen, 2025).

---

## Funcionamento do programa

- `client.py` funciona como um cliente que envia requests para o servidor
- `server.py` interpreta chamadas com formato \[OPERAÇÃO, dados, id_lista\] e armazena as listas do "banco de dados"
- `dbclient.py` é o STUB do cliente que envia chamadas RPC para o servidor, agindo como um "serviço de banco de dados"
- `run.py` simula o envio por 2 clientes para 1 servidor de um criando duas listas, cada uma por um cliente com um identficador "Cliente N". Os dois clientes utilizam o mesmo STUB de dbclient. No final a classe Server mostra as duas listas depois da operação de APPEND.

## Resultado

- Criados arquivos para rodar no client (run_client.py) e servidor (run_server.py)
- Cada client usa os stubs de dbclient e cria uma lista (CREATE) e faz 3 appends (APPEND), lista os itens da sua lista guardados no servidor (GETVALUE) e depois encerra o servidor (STOP)
- O servidor guarda as listas criadas por cada client

- Resultado no client 1
```
[ec2-user@ip-172-31-58-105 stubs-as-remote-references-alexoliveiramartins]$ python3 run_client.py 
['Client 100.26.50.212', 'Item 2', 'Item 3']
Digite qualquer coisa para parar o servidor (STOP):
```

- Resultado no client 2
```
[ec2-user@ip-172-31-63-230 stubs-as-remote-references-alexoliveiramartins]$ python3 run_client.py 
['Client 100.26.209.70', 'Item 2', 'Item 3']
Digite qualquer coisa para parar o servidor (STOP):
```

## Execucao

> Obs: Configurar ip do servidor em `constRPC.py`

- Na maquina servidor 
```bash
python3 run_server.py
```

- Nas (n) maquinas client
```bash
python3 run_client.py
```

## Diferenças da semantica de chamadas em comparação à implementação original

- A chamada de funções se mostrou identica devido ao stubs, que abstraem as chamadas. A única
mudança no programa original foi separar arquivos para rodar em client/servidor e configurar
ip's/hosts para rodar nas máquinas da AWS.