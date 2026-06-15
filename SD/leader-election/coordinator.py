import zmq
from CONSTS import *
import sys

def coordinator():
    avaliable = True

    self_id = int(sys.argv[1])
    current_coordinator = INITIAL_COORDINATOR_ID

    context = zmq.Context()
    rep_socket  = context.socket(zmq.REP)  

    rep_socket.bind(f"tcp://*:{NODES[self_id]}")
    print(f"Coordenador rodando na porta {NODES[self_id]}")

    while True: 
        msg = rep_socket.recv()
        op = msg.decode()
        if op == "REQUEST":
            if avaliable:
                reply = "GRANT"
                print("Acesso permitido!")
                avaliable = False
            else:
                reply = "WAIT"
                print("Acesso negado!")
            rep_socket.send(reply.encode())
        if op == "RELEASE":
            avaliable = True
            rep_socket.send("OK".encode())
            print("Servidor liberado")
        
coordinator()