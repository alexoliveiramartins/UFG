import multiprocessing
import zmq, time
import sys
from minuto_a_minuto import flamengo, champions_league

SERVER_IP = "172.31.51.9"
SERVER_PORT = 1234

def server():
  context = zmq.Context()         
  socket = context.socket(zmq.PUB)          # create a publisher socket
  socket.bind(f"tcp://*:{SERVER_PORT}")     # bind socket to the address
  print(f"Publisher rodando na porta {SERVER_PORT}")
  mensagem = 0
  while True:                    
    time.sleep(5)                           # wait every 5 seconds
    msg_champions = "CHAMPIONS " + champions_league[mensagem % len(champions_league)]
    socket.send(msg_champions.encode())
    msg_flamengo = "FLAMENGO " + flamengo[mensagem % len(flamengo)]
    socket.send(msg_flamengo.encode())
    mensagem += 1

def client(topico, server_ip=SERVER_IP):
  context = zmq.Context()
  socket = context.socket(zmq.SUB)          # create a subscriber socket
  socket.connect(f"tcp://{server_ip}:{SERVER_PORT}")   # connect to the server
  print(f"Subscriber conectado ao publisher {server_ip}:{SERVER_PORT}")
  socket.setsockopt(zmq.SUBSCRIBE, topico.encode())
  print(f"Subscriber acompanhando {topico}")

  for i in range(5):      # Five iterations
    time = socket.recv()  # receive a message related to subscription 
    print(time.decode())  # print the result      
#-
if __name__ == "__main__": #-
  if len(sys.argv) > 1 and sys.argv[1] == "server":
    server()
    sys.exit()
  if len(sys.argv) > 1 and sys.argv[1] == "client":
    topico = "CHAMPIONS"
    if len(sys.argv) > 2 and sys.argv[2].lower() == "flamengo":
      topico = "FLAMENGO"
    client(topico)
    sys.exit()

  s = multiprocessing.Process(target=server) #-
  #champions ou flamengo
  c = multiprocessing.Process(target=client,args=("CHAMPIONS","localhost",))

#-
  s.start() #-
  time.sleep(2) #-
  c.start() #-
  c.join() #-
  s.terminate() #-
