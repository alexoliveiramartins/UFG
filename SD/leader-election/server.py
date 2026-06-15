import zmq
from CONSTS import *

def server():
    score = 0 

    context = zmq.Context()
    socket  = context.socket(zmq.REP)       # create reply socket

    socket.bind(f"tcp://*:{SERVER_PORT}")   # bind socket to address
    print(f"Server rodando na porta {SERVER_PORT}")
    
    while True:
        msg = socket.recv()
        op = msg.decode()
        if op == "GET":
            socket.send(str(score).encode())
        elif "UPDATE" in op:
            new = int(op.split(" ")[1])
            if new <= score:
                reply = "update rejected\n"
                socket.send(reply.encode())
                print(reply)
            else:
                score = new
                reply = f"Score updated: {score}"
                socket.send(reply.encode())
                print(reply)

try:
    server()
except KeyboardInterrupt:
    print("\nServer encerrado")
