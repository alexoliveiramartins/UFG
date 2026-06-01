import multiprocessing
import zmq, time, pickle, sys, random
from constPipe import * #-

mensagens = [
    "Meu cpf é 123.456.789-00 e meu email é alex_martins@discente.ufg.br",
    "Prezados, segue o contato do coordenador: cpf 98765432100 e o email é roberto.silva@ufg.br.",
    "O cadastro foi feito com o CPF 456.789.123-22. Caso precisem, o email secundário é mariana_dev@outlook.com.",
    "Por favor, atualize meu endereço de entrega. Meu documento é 111.222.333-44 e meu e-mail atual é carlos.oliveira123@gmail.com.",
    "A nota fiscal deve ser emitida para o CPF: 000.111.222-33. Enviar cópia para financeiro@empresa.com.br.",
    "Tentei me registrar usando o e-mail invalido@@com e o CPF 123.456.789-XX, mas o sistema deu erro.",
    "Cadastro concluído. Nome: Lucas Souza, CPF: 22233344455, Email: lucas.souza@hotmail.com.",
    "Não lembro se digitei o e-mail certo (ana.costa@discente.ufg..br), mas o meu CPF é 888.777.666-55.",
    "Alguém me ajuda? Coloquei o CPF 999.888.777-666 (acho que tem número a mais) e o email contatocliente@gmail.",
    "Seguem os dados do candidato: CPF: 333.444.555-66, Correio Eletrônico: beatriz.almeida@yahoo.com.br.",
    "O e-mail de suporte é suporte@ti.ufg.br e o CPF do responsável técnico é 55566677788."
]

def producer():
  context = zmq.Context()              
  socket  = context.socket(zmq.PUSH)      # create a push socket
  socket.bind(f"tcp://*:{PRODUCER_PORT}")    # bind socket to address
  print(f"Producer rodando na porta {PRODUCER_PORT}")
  
  num_msgs = len(mensagens)
  msg = 0

  while True:
    workload = mensagens[msg]     # compute workload
    print(f"Enviando mensagem para processamento: {mensagens[msg]} ...") #-
    socket.send(pickle.dumps(workload))   # send workload to worker
    time.sleep(5)
    msg += 1
    if(msg >= num_msgs):
      break
    
producer()
