import zmq
from CONSTS import *
import random, time

def client():
    context = zmq.Context()
    socket  = context.socket(zmq.REQ)  

    socket.connect(f"tcp://{SERVER_IP}:{SERVER_PORT}") # block until connected
    print(f"Client conectado ao server {SERVER_IP}:{SERVER_PORT}")

    while True: 
        socket.send(("GET").encode())             # send message
        message = socket.recv()                 # block until response
        score = int(message.decode())

        time.sleep(random.randint(1, 5)) # delay para demonstrar melhor rejeicoes de update

        pts = random.randint(1, 5)
        msg = f"UPDATE {score + pts}"
        socket.send(msg.encode()) 
        message = socket.recv()
        print(message.decode())

        time.sleep(random.randint(1, 3))

client()