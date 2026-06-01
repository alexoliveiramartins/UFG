import zmq, pickle, time
from validator import validate_email, validateCPF
from constPipe import *

def validator():
  context = zmq.Context()
  socket  = context.socket(zmq.PULL)      # create a pull socket
  socket.bind(f"tcp://*:{VALIDATOR_PORT}")
  print(f"Validator rodando na porta {VALIDATOR_PORT}")
  
  while True:
    print("Validator esperando mensagem")
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

validator()
