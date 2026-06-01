import multiprocessing #-
import zmq, time, pickle, sys, random #-
from extractor import extract
from validator import validate_email, validateCPF
#-
NWORKERS = 10 #-
#-

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
  socket.bind("tcp://*:12345")    # bind socket to address
  
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

# consumer 1 - extrai cpf e email do texto
# producer 2 - envia para validacao pro outro consumer
def extractor(id):
  context = zmq.Context()
  push_socket  = context.socket(zmq.PUSH)      # create a push socket
  push_socket.bind("tcp://*:8080")      # bind socket to address

  pull_socket  = context.socket(zmq.PULL)      # create a pull socket
  pull_socket.connect("tcp://localhost:12345") # connect to the producer

  while True:
    work = pickle.loads(pull_socket.recv())     # receive work from a source
    print(f"recebida a mensagem: {work}")
    extraido = extract(work)
    if extraido == None:
      continue

    workload = {
      "mensagem": work,
      "email": extraido["email"],
      "cpf": extraido["cpf"],
    }
    push_socket.send(pickle.dumps(workload)) 
    time.sleep(5)
    
# valida o email e o cpf que foi extraido
def validator(id):
  context = zmq.Context()
  socket  = context.socket(zmq.PULL)      # create a pull socket
  socket.connect("tcp://localhost:8080") # connect to the producer
  while True:
    msg = pickle.loads(socket.recv())
    valid_email = validate_email(msg["email"])
    valid_cpf = validateCPF(msg["cpf"])
    resposta = {
      "msg": msg["mensagem"],
      "email": msg["email"],
      "email_valido": valid_email,
      "cpf": msg["cpf"],
      "cpf_valido": valid_cpf
    }
    print(resposta)

if __name__ == "__main__": #-
  s = multiprocessing.Process(target=producer) #-
  w = [multiprocessing.Process(target=worker,args=(i+1,)) for i in range(NWORKERS)]#-
#-
  for i in range(NWORKERS): w[i].start() #-
  s.start() #-
  time.sleep(60) #-
  for i in range(NWORKERS): w[i].terminate() #-
  s.terminate() #-
