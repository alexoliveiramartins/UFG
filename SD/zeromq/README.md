[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/wa7oHGos)

# ZeroMQ-Examples

Examples extracted from Tanenbaum&amp;vanSteen (2025) to illustrate three different communication patterns with ZeroMQ: client-server, pub-sub and producer-consumer.

---

## Client Server

```
Server = Envia CPFs
Client = Valida CPFs
```

## Pub Sub

```
Pub = Publica Minuto a Minuto de dois jogos: Flamengo x Coritiba e PSG x Arsenal
Sub = escolhe qual acompanhar: CHAMPIONS ou FLAMENGO
```

- Demonstracao rodando localmente

<img width="727" height="186" alt="image" src="https://github.com/user-attachments/assets/d7e8fe2b-e103-4804-841b-c5112e6d3b02" />

## Producer Consumer pipeline

```
1. Produtor - Producer = Envia mensagens contendo cpf e email
2. Extractor - Producer/Consumer = Recebe as mensages e extrai o cpf/email delas; Depois envia pro consumer
Obs: Podem ter varios desses extractors, mas testei so com um
3. Validator - Consumer = Valida o email (regex) e CPF (digitos de verificacao)
```

- Demonstracao rodando o producer consumer em 3 maquinas AWS:

<img width="1080" height="757" alt="output" src="https://github.com/user-attachments/assets/3aa7c313-e8f9-4d5f-9dd9-d7206866e041" />
