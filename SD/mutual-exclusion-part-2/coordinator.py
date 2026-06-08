import zmq
from CONSTS import *

def coordinator():
    avaliable = True

    context = zmq.Context()
    rep_socket  = context.socket(zmq.REP)  

    rep_socket.bind(f"tcp://*:{COORDINATOR_PORT}")
    print(f"Coordenador rodando na porta {COORDINATOR_PORT}")

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