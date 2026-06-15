import random
import sys
import threading
import time

import zmq

from CONSTS import *


if len(sys.argv) != 2:
    print("Uso: python node.py <id>")
    print(f"IDs disponiveis: {', '.join(str(node_id) for node_id in NODES)}")
    sys.exit(1)


NODE_ID = int(sys.argv[1])

if NODE_ID not in NODES:
    print(f"ID invalido: {NODE_ID}")
    print(f"IDs disponiveis: {', '.join(str(node_id) for node_id in NODES)}")
    sys.exit(1)


context = zmq.Context.instance()
state_lock = threading.Lock()

current_coordinator_id = INITIAL_COORDINATOR_ID
resource_available = True
election_in_progress = False


def log(message):
    print(f"[NODE {NODE_ID}] {message}", flush=True)


def send_request(ip, port, message, timeout_ms=1500):
    socket = context.socket(zmq.REQ)
    socket.setsockopt(zmq.LINGER, 0)
    socket.setsockopt(zmq.RCVTIMEO, timeout_ms)
    socket.setsockopt(zmq.SNDTIMEO, timeout_ms)

    try:
        socket.connect(f"tcp://{ip}:{port}")
        socket.send_string(message)
        return socket.recv_string()
    except zmq.Again:
        return None
    finally:
        socket.close()


def send_to_node(node_id, message, timeout_ms=1500):
    ip, port = NODES[node_id]
    return send_request(ip, port, message, timeout_ms)


def send_to_server(message, timeout_ms=1500):
    return send_request(SERVER_IP, SERVER_PORT, message, timeout_ms)


def set_coordinator(node_id):
    global current_coordinator_id, election_in_progress

    with state_lock:
        current_coordinator_id = node_id
        election_in_progress = False


def become_coordinator():
    global current_coordinator_id, resource_available

    with state_lock:
        current_coordinator_id = NODE_ID
        resource_available = True

    log("Sou o novo coordenador")

    for node_id in NODES:
        if node_id != NODE_ID:
            send_to_node(node_id, f"COORDINATOR {NODE_ID}", timeout_ms=800)


def start_election(reason):
    global election_in_progress

    with state_lock:
        if election_in_progress:
            return
        election_in_progress = True

    log(f"Iniciando eleicao Bully: {reason}")

    higher_nodes = [node_id for node_id in NODES if node_id > NODE_ID]
    higher_node_answered = False

    for node_id in higher_nodes:
        reply = send_to_node(node_id, f"ELECTION {NODE_ID}", timeout_ms=1000)
        if reply == "OK":
            higher_node_answered = True
            log(f"No {node_id} respondeu OK para a eleicao")

    if higher_node_answered:
        log("Aguardando um no de maior prioridade anunciar o coordenador")
        time.sleep(3)
        with state_lock:
            election_in_progress = False
        return

    become_coordinator()

    with state_lock:
        election_in_progress = False


def handle_message(message):
    global resource_available

    parts = message.split()
    operation = parts[0]

    with state_lock:
        coordinator_id = current_coordinator_id

    if operation == "PING":
        return "PONG"

    if operation == "REQUEST":
        if NODE_ID != coordinator_id:
            return f"REDIRECT {coordinator_id}"

        with state_lock:
            if resource_available:
                resource_available = False
                log("Acesso permitido")
                return "GRANT"

        log("Acesso negado")
        return "WAIT"

    if operation == "RELEASE":
        if NODE_ID != coordinator_id:
            return f"REDIRECT {coordinator_id}"

        with state_lock:
            resource_available = True

        log("Servidor liberado")
        return "OK"

    if operation == "ELECTION":
        sender_id = int(parts[1])
        log(f"Recebi ELECTION do no {sender_id}; respondendo OK")

        if sender_id < NODE_ID:
            threading.Thread(
                target=start_election,
                args=(f"no {sender_id} chamou uma eleicao",),
                daemon=True,
            ).start()

        return "OK"

    if operation == "COORDINATOR":
        new_coordinator_id = int(parts[1])
        set_coordinator(new_coordinator_id)
        log(f"Novo coordenador: no {new_coordinator_id}")
        return "OK"

    return "UNKNOWN"


def listen_for_nodes():
    ip, port = NODES[NODE_ID]
    socket = context.socket(zmq.REP)
    socket.bind(f"tcp://*:{port}")

    log(f"Escutando mensagens de outros nos na porta {port}")

    while True:
        message = socket.recv_string()
        reply = handle_message(message)
        socket.send_string(reply)


def request_access():
    while True:
        with state_lock:
            coordinator_id = current_coordinator_id

        reply = send_to_node(coordinator_id, "REQUEST", timeout_ms=1500)

        if reply is None:
            log(f"Coordenador {coordinator_id} nao respondeu")
            start_election(f"falha do coordenador {coordinator_id}")
            time.sleep(1)
            continue

        if reply == "GRANT":
            return True

        if reply == "WAIT":
            time.sleep(1)
            continue

        if reply.startswith("REDIRECT"):
            new_coordinator_id = int(reply.split()[1])
            set_coordinator(new_coordinator_id)
            log(f"Redirecionado para o coordenador {new_coordinator_id}")
            continue

        log(f"Resposta inesperada do coordenador {coordinator_id}: {reply}")
        time.sleep(1)


def release_access():
    with state_lock:
        coordinator_id = current_coordinator_id

    reply = send_to_node(coordinator_id, "RELEASE", timeout_ms=1500)

    if reply is None:
        log(f"Coordenador {coordinator_id} falhou antes do RELEASE")
        start_election(f"falha do coordenador {coordinator_id}")


def use_server():
    score_reply = send_to_server("GET")
    if score_reply is None:
        log("Servidor de score nao respondeu ao GET")
        return

    score = int(score_reply)
    points = random.randint(1, 5)

    time.sleep(random.randint(1, 4))

    update_reply = send_to_server(f"UPDATE {score + points}")
    if update_reply is None:
        log("Servidor de score nao respondeu ao UPDATE")
        return

    log(update_reply)


def run_client_loop():
    time.sleep(random.uniform(0.2, 1.2))

    while True:
        request_access()
        use_server()
        release_access()
        time.sleep(random.randint(1, 3))


def main():
    with state_lock:
        coordinator_id = current_coordinator_id

    role = "coordenador inicial" if NODE_ID == coordinator_id else "cliente"
    log(f"Iniciado como {role}; coordenador atual: no {coordinator_id}")

    listener = threading.Thread(target=listen_for_nodes, daemon=True)
    listener.start()

    run_client_loop()


try:
    main()
except KeyboardInterrupt:
    log("Encerrando")
