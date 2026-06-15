import zmq
from CONSTS import *
import random, time

def client():
    context = zmq.Context()
    socket  = context.socket(zmq.REQ)  
    coordinator_socket  = context.socket(zmq.REQ)  

    socket.connect(f"tcp://{SERVER_IP}:{SERVER_PORT}")
    print(f"Client conectado ao server {SERVER_IP}:{SERVER_PORT}")

    coordinator_socket.connect(f"tcp://{COORDINATOR_IP}:{COORDINATOR_PORT}")
    print(f"Client conectado ao server {COORDINATOR_IP}:{COORDINATOR_PORT}")

    while True: 
        coordinator_socket.send(("REQUEST").encode())
        reply = coordinator_socket.recv()
        if(reply.decode() == "GRANT"):
            socket.send(("GET").encode())
            message = socket.recv()
            score = int(message.decode())

            time.sleep(random.randint(1, 5)) # delay para demonstrar melhor rejeicoes de update

            pts = random.randint(1, 5)
            msg = f"UPDATE {score + pts}"
            socket.send(msg.encode()) 
            message = socket.recv()
            print(message.decode())

            time.sleep(random.randint(1, 3))

            coordinator_socket.send(("RELEASE").encode())
            coordinator_socket.recv()
        
        time.sleep(2)

client()