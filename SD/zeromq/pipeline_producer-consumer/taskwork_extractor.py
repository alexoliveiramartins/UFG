import zmq, pickle, time
from extractor import extract
from constPipe import *

def extractor():
  context = zmq.Context()
  push_socket  = context.socket(zmq.PUSH)      # create a push socket
  push_socket.connect(f"tcp://{VALIDATOR_IP}:{VALIDATOR_PORT}")
  print(f"Extractor conectado ao validator {VALIDATOR_IP}:{VALIDATOR_PORT}")

  pull_socket  = context.socket(zmq.PULL)      # create a pull socket
  pull_socket.connect(f"tcp://{PRODUCER_IP}:{PRODUCER_PORT}") # connect to the producer
  print(f"Extractor conectado ao producer {PRODUCER_IP}:{PRODUCER_PORT}")

  while True:
    print("Extractor esperando mensagem")
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

extractor()
