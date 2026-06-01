# Enunciado 

Implemente um serviço para manutenção do escore de um jogo multi-player. O serviço provê duas operações: consulta do escore e atualização do escore. As seguintes regras devem ser respeitadas para uso destas operações:

1) Para atualizar o escore, o cliente deve chamar a operação para consultar o escore atual, calcular o novo escore (por exemplo, somando alguma pontuação obtida pelo jogador) e, em seguida chamar a operação para atualizar o escore com o valor calculado;  

2) O escore só pode ser atualizado para valores maiores.

Implementar tanto o serviço quanto o cliente. O sistema deve prover suporte para vários clientes, os quais têm igualmente acesso ao serviço de consulta e atualização do escore do jogo.

Execute testes com vários clientes concorrentes (executando em instâncias diferentes no AWS) e relate o resultado.

O comportamento dos clientes quanto à atualização do escore (momento em que ocorre e quantidade de pontos somada) pode ser simulado. O serviço de manutenção do escore deve executar em uma instância separada do AWS.

A implementação pode ser feita com o middleware de sua preferência (ICE, ZeroMQ, JavaRMI, gRPC, RESTful etc). 

---

## Demonstração rodando na AWS com 2 clients e 1 servidor

<img width="1511" height="1073" alt="image" src="https://github.com/user-attachments/assets/f7a21797-bf8b-4dc6-9054-74fe87cb32e7" />
