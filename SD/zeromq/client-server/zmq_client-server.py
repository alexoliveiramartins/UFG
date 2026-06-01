import multiprocessing #-
import zmq
import sys
from time import sleep #-
from cpf_validator import validateCPF

SERVER_IP = "172.31.51.9"
SERVER_PORT = 1234

# cpfs para teste:
valido = "529.982.247-25"
invalido = "529.982.247-24"

def server():
  context = zmq.Context()
  socket  = context.socket(zmq.REP)       # create reply socket
  socket.bind(f"tcp://*:{SERVER_PORT}")   # bind socket to address
  print(f"Server rodando na porta {SERVER_PORT}")

  while True:
    message = socket.recv()               # wait for incoming message
    if not "STOP" in str(message):        # if not to stop...
      msg = str(message.decode())
      valid = validateCPF(msg)
      if valid:
        reply = "CPF Valido"
      else:
        reply = "CPF Invalido"
      socket.send(reply.encode())         # send it away (encoded)
    else:                         
      break                               # break out of loop and end

def client():
  context = zmq.Context()
  socket  = context.socket(zmq.REQ)       # create request socket

  socket.connect(f"tcp://{SERVER_IP}:{SERVER_PORT}") # block until connected
  print(f"Client conectado ao server {SERVER_IP}:{SERVER_PORT}")
  
  socket.send(valido.encode())             # send message
  message = socket.recv()                 # block until response
  print(message.decode)
  
  socket.send(invalido.encode())             # send message
  message = socket.recv()                 # block until response
  print(message.decode())

  socket.send(b"STOP")                    # tell server to stop
  print(message.decode())                 # print result
#-
if __name__ == "__main__": #-
  if len(sys.argv) > 1 and sys.argv[1] == "server":
    server()
    sys.exit()
  if len(sys.argv) > 1 and sys.argv[1] == "client":
    client()
    sys.exit()

  s = multiprocessing.Process(target=server) #-
  c = multiprocessing.Process(target=client) #-
#-
  s.start() #-
  sleep(2) #-
  c.start() #-
  c.join() #-
  s.join() #-
