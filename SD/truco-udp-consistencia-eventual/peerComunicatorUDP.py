from socket import socket, AF_INET, SOCK_DGRAM, SOCK_STREAM, SOL_SOCKET, SO_REUSEADDR
import os, random, time, pickle, json, hashlib
from cards import valores
from namingClient import NamingClient, get_advertised_host

class PeerCommunicator:
    def __init__(self):
        
        self.msgBuffer = {}

        # Informacoes individuais e privadas do jogo
        self.info = {
            "cards": None,
            "peer_id": None,
            "peer_name": None,
            "parceiro": None,
            "team": None,
        }

        self.game_state = None
        self.last_log = ""

        self.peer_id = None
        self.peer_name = None
        # self.num_messages = 0
        self.peers = []
        self.group_manager_addr = None
        self.naming_client = NamingClient()

        self.send_socket = socket(AF_INET, SOCK_DGRAM)
        self.recv_socket = socket(AF_INET, SOCK_DGRAM)
        self.recv_socket.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
        self.recv_socket.bind(('0.0.0.0', 0))
        self.udp_port = self.recv_socket.getsockname()[1]

        self.server_socket = socket(AF_INET, SOCK_STREAM)
        self.server_socket.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
        self.server_socket.bind(('0.0.0.0', 0))
        self.server_socket.listen(1)

    def new_game_state(self, placar=None):
        # "MEsa" ou estado do jogo
        # Valores de "fase": PLAYING, MUST_PLAY, TRUCO, SEIS, DOZE
        # o valor_mao muda de acordo com essas fases
        # esse é o estado replicado entre os peers
        previous_state = self.game_state or {}
        self.game_state = {
            "seq": previous_state.get("seq", 0),
            "fase": "PLAYING",
            "turno": 0,
            "vaza": 1,
            "tentos": 1,
            "current_player": 0,
            "cartas_mesa": [],
            "vazas_ganhas": {"A": 0, "B": 0},
            "valor_mao": 1,
            "last_request_player": None,
            "placar": placar or previous_state.get("placar", {"A": 0, "B": 0}),
            "order": previous_state.get("order"),
            "teams": previous_state.get("teams"),
        }

    ## ======== Logica de comunicação entre peers

    # pega o proprio ip de api.ipify.org
    def get_public_ip(self):
        return get_advertised_host()

    # encontra o groupMngr no naming service
    def lookup_group_manager(self):
        response = self.naming_client.lookup("group-manager")
        if response.get("status") != "ok":
            raise RuntimeError(f"GroupManager nao encontrado: {response.get('message')}")

        address = response["address"]
        self.group_manager_addr = (address["host"], int(address["port"]))
        return self.group_manager_addr

    # se registra no group manager
    def register_with_group_manager(self):
        response = self.send_request({
            "op": "register", 
            "ipaddr": self.get_public_ip(), 
            "port": self.udp_port
        })
        if response.get("status") == 'error':
            print(response.get("message"))
            exit(0)

        self.peer_id = response["player_id"]
        print(f"Registrado como jogador {self.peer_id}")
        self.register_with_naming_service()
    
    # se registra no serviço de nomes
    def register_with_naming_service(self):
        self.peer_name = f"peer-{self.peer_id}"
        address = {
            "host": self.get_public_ip(),
            "port": self.udp_port,
        }
        response = self.naming_client.rebind(self.peer_name, address, "peer")
        if response.get("status") != "ok":
            raise RuntimeError(f"Erro ao registrar peer no NamingService: {response.get('message')}")
        print(f"Peer registrado no NamingService: {self.peer_name} -> {address}")

    # pega a lista de peers para enviar as jogadas
    def get_list_of_peers(self):
        for _ in range(30):
            response = self.naming_client.discover("peer")
            if response.get("status") != "ok":
                raise RuntimeError(f"Erro ao descobrir peers: {response.get('message')}")

            records = response.get("records", [])
            if len(records) >= 4:
                self.peers = [
                    (record["address"]["host"], int(record["address"]["port"]))
                    for record in records
                    if record["name"] != self.peer_name
                ]
                return self.peers

            print("Aguardando peers no NamingService...")
            time.sleep(1)

        raise RuntimeError("Timeout aguardando 4 peers no NamingService")

    # multicast (envia mensagem para todos os peers)
    def multicast_msg(self, msg):
        msg_pack = pickle.dumps(msg)
        for addr in self.peers:
            self.send_socket.sendto(msg_pack, addr)

    # limpa o terminal (helper)
    def clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')

    ### ================ Helpers / Utils

    def expectedMsgInBuffer(self):
        expected_seq = self.game_state["seq"] + 1
        return expected_seq in self.msgBuffer

    def read_choice(self, prompt):
        while True:
            raw_input = input(prompt)
            digits = "".join(char for char in raw_input if char.isdigit())
            if digits:
                return digits[-1]
            print("Entrada invalida. Digite uma das opcoes numericas.")

    def pop_card_choice(self, cards, inp=None):
        while True:
            if inp is None:
                inp = self.read_choice("Digite sua jogada: ")
            card_index = int(inp)
            if 0 <= card_index < len(cards):
                return cards.pop(card_index)
            print("Carta invalida. Escolha um indice da lista de cartas.")
            inp = None

    def game_state_hash(self):
        state_json = json.dumps(self.game_state, sort_keys=True)
        return hashlib.md5(state_json.encode()).hexdigest()[:8]

    # printa a mesa com as informacoes relevantes no terminal
    def mostrar_mesa(self, cards):
        self.clear_screen()
        print(f"Jogador {self.peer_id} | Time {self.info['team']} | Parceiro {self.info['parceiro']}")
        print(f"Vaza {self.game_state['vaza']} | Turno {self.game_state['turno']} | Vez do jogador {self.game_state['current_player']}")
        print(f"Vazas ganhas: {self.game_state['vazas_ganhas']}")
        if self.game_state["placar"]: print(f"Placar: A-{self.game_state['placar']['A']} x B-{self.game_state['placar']['B']}") 
        else: print(f"Placar: A-0 x B-0")
        if self.last_log:
            print(f"Evento: {self.last_log}")
        print()
        print("Cartas na mesa:")
        if self.game_state["cartas_mesa"]:
            for play in self.game_state["cartas_mesa"]:
                print(f"  Jogador {play['player_id']}: {play['card']}")
        else:
            print("  Nenhuma carta jogada ainda.")
        print()
        print("Suas cartas:")
        for index, carta in enumerate(cards):
            print(f"  {index}: {carta}")
        print("\n\n\n")
        print("Estado: ", self.game_state_hash())

    # Prompt (terminal) para fazer a jogada
    def prompt_jogada(self, cards):
        self.mostrar_mesa(cards)
        msg = {
            # "type": "", # play, truco_accept, truco, seis, doze
            "vaza": self.game_state["vaza"],
            "turno": self.game_state["turno"],
            "valor_mao": self.game_state["valor_mao"],
            "player_id": self.peer_id,
            "card": None
        }

        fase = self.game_state["fase"]

        if fase == "PLAYING":    # Jogo normal (sem estar em pedido de truco/6/12)
            if self.game_state["valor_mao"] == 1:
                print("E sua vez, jogue uma carta ou peca truco...")
                print("correr: 9 | pedir truco: 8")
                inp = self.read_choice("Digite sua jogada: ")
                if inp == '9':
                    msg["type"] = "correr"
                elif inp == '8':
                    msg["type"] = "truco"
                else:
                    msg["card"] = self.pop_card_choice(cards, inp)
                    msg["type"] = "play"
            elif self.game_state["valor_mao"] == 3:    # Jogo trucado
                print("(3) E sua vez, jogue uma carta ou peca seis...")
                print("correr: 9 | pedir seis: 8")
                inp = self.read_choice("Digite sua jogada: ")
                if inp == '9':
                    msg["type"] = "correr"
                elif inp == '8':
                    msg["type"] = "seis"
                else:
                    msg["card"] = self.pop_card_choice(cards, inp)
                    msg["type"] = "play"
            elif self.game_state["valor_mao"] == 6:   # Alguem pediu 6
                print("(6) E sua vez, jogue uma carta ou peca doze...")
                print("correr: 9 | pedir doze: 8")
                inp = self.read_choice("Digite sua jogada: ")
                if inp == '9':
                    msg["type"] = "correr"
                elif inp == '8':
                    msg["type"] = "doze"
                else:
                    msg["card"] = self.pop_card_choice(cards, inp)
                    msg["type"] = "play"
            elif self.game_state["valor_mao"] == 12:   # Alguem pediu 12
                print("(12) E sua vez, jogue uma carta ou corra...")
                print("correr: 9")
                inp = self.read_choice("Digite sua jogada: ")
                if inp == '9':
                    msg["type"] = "correr"
                else:
                    msg["card"] = self.pop_card_choice(cards, inp)
                    msg["type"] = "play"
        elif fase == "MUST_PLAY":
            print("Pedido aceito, jogue uma carta...")
            msg["card"] = self.pop_card_choice(cards)
            msg["type"] = "must_play"

        elif fase == "TRUCO":    # Voce recebeu um pedido de truco
            print("E sua vez, aceite o truco, peca 6 ou corra")
            print("correr: 9 | aceitar truco: 8 | pedir seis: 7")
            inp = self.read_choice("Digite sua jogada: ")
            if inp == '9':
                msg["type"] = "correr"
            elif inp == '8':
                msg["type"] = "accept"
                msg["valor_mao"] = 3
            elif inp == '7':
                msg["type"] = "seis"

        elif fase == "SEIS":    # Voce recebeu um pedido de seis
            print("E sua vez, aceite o seis, peca doze ou corra")
            print("correr: 9 | aceitar seis: 8 | pedir doze: 7")
            inp = self.read_choice("Digite sua jogada: ")
            if inp == '9':
                msg["type"] = "correr"
            elif inp == '8':
                msg["type"] = "accept"
                msg["valor_mao"] = 6
            elif inp == '7':
                msg["type"] = "doze"

        elif fase == "DOZE":    # Voce recebeu um pedido de doze
            print("E sua vez, aceite o doze, peca 6 ou corra")
            print("correr: 9 | aceitar doze: 8")
            inp = self.read_choice("Digite sua jogada: ")
            if inp == '9':
                msg["type"] = "correr"
            elif inp == '8':
                msg["type"] = "accept"
                msg["valor_mao"] = 12

        return msg
    
    # Helper que envia request e espera/retorna a resposta 
    # (send recv) (requests para o group manager)
    def send_request(self, request):
        if not self.group_manager_addr:
            self.lookup_group_manager()

        client_socket = socket(AF_INET, SOCK_STREAM)
        client_socket.connect(self.group_manager_addr)
        client_socket.send(pickle.dumps(request))
        response = pickle.loads(client_socket.recv(2048))
        client_socket.close()
        return response

    ### ================= Logica do truco/comunicacao entre peers

    # recebe do GM a ordem e os jogadores (e o status)
    def get_table_info(self):
        response = self.send_request({"op": "table"})
        return response

    # envia as cartas do id (indice) do peer que fez a request
    # as cartas são salvas em um array no groupMngr
    def get_cards(self):
        response = self.send_request({
            "op": "hand", "player_id": self.peer_id
        })
        return response["cards"]

    # Identifica qual peer é seu parceiro do truco
    def getParceiro(self, teams):
        me = self.peer_id
        for team_name, players in teams.items():
            if me in players:
                my_team = team_name
                parceiro = players[0] if players[1] == me else players[1]

        self.parceiro = parceiro
        return {
            "team": my_team,
            "parceiro": parceiro
        }

    # avança o turno e atualiza o proximo a jogar
    def avancar_turno(self):
        order = self.game_state["order"]
        current_index = order.index(self.game_state["current_player"])
        next_index = (current_index + 1) % 4
        self.game_state["current_player"] = order[next_index]
        self.game_state["turno"] += 1

    # identifica qual o time do peer
    def get_team_of_player(self, player_id):
        for team, players in self.game_state["teams"].items():
            if player_id in players:
                return team

    # checa se alguem ganhou a vaza (rodada dentro do tento)
    def check_vaza_winner(self):
        winning_play = self.game_state["cartas_mesa"][0]

        for play in self.game_state["cartas_mesa"][1:]:
            if valores[play["card"]] > valores[winning_play["card"]]:
                winning_play = play

        winner_player = winning_play["player_id"]
        winner_team = self.get_team_of_player(winner_player)

        return winner_player, winner_team

    # envia para o GM o resultado do jogo
    def send_result(self, winner):
        return self.send_request({
            "op": "register_win", 
            "player_id": self.peer_id, 
            "winner_team": winner, 
            "valor_mao": self.game_state["valor_mao"]
        })

    # checa se chegou/passou de 12 tentos (acabou)
    def check_gameover(self):
        if not self.game_state["placar"]: 
            return False
        elif self.game_state["placar"]['A'] >= 12 or self.game_state["placar"]['B'] >= 12:
            return True
        return False

    def proximo_jogador(self, player_id):
        order = self.game_state["order"]
        index = order.index(player_id)
        return order[(index + 1) % 4]
        
    def jogador_anterior(self, player_id):
        order = self.game_state["order"]
        index = order.index(player_id)
        return order[(index - 1) % 4]

    def registrar_pedido_truco(self, msg):
        previous_requester = self.game_state["last_request_player"]
        self.game_state["last_request_player"] = msg["player_id"]
        self.game_state["fase"] = msg["type"].upper()

        if previous_requester is None:
            self.game_state["current_player"] = self.proximo_jogador(msg["player_id"])
        else:
            self.game_state["current_player"] = previous_requester

    def applyMsg(self, msg, cards):
        winner_team = winner_player = None
        tipo_msg = msg.get("type")
        if tipo_msg == "play":
            self.last_log = f"Jogador {msg.get('player_id')} jogou {msg.get('card')}"
            self.game_state["cartas_mesa"].append(msg)   # coloca a jogada na minha mesa local
            self.avancar_turno()
        elif tipo_msg == "must_play": 
            self.last_log = f"Jogador {msg.get('player_id')} jogou {msg.get('card')}"
            self.game_state["cartas_mesa"].append(msg)   # coloca a jogada na minha mesa local
            self.game_state["fase"] = "PLAYING"
            self.avancar_turno()
        elif tipo_msg in ["truco", "seis", "doze"]:    # Jogo vai para estado de "pedido de truco/6/12"
            self.last_log = f"Jogador {msg.get('player_id')} pediu {tipo_msg}"
            self.registrar_pedido_truco(msg)
        elif tipo_msg == "accept":                                  # Aceitou o pedido de truco/6/12
            self.last_log = f"Jogador {msg.get('player_id')} aceitou o pedido de {self.game_state['fase'].lower()}"
            self.game_state["valor_mao"] = msg.get("valor_mao")     # Jogo comeca a valer N tentos
            self.game_state["fase"] = "MUST_PLAY"                     # volta ao estado de jogo normal
            self.game_state["current_player"] = self.game_state["last_request_player"]
            self.game_state["last_request_player"] = None
        elif(tipo_msg == "correr"):
            self.last_log = f"Jogador {msg.get('player_id')} correu"
            self.game_state["fase"] = "HAND_FINISHED"
            runner_team = self.get_team_of_player(msg["player_id"])
            winner_team = "A" if runner_team == "B" else "B"
            winner_player = self.jogador_anterior(msg["player_id"])
        elif tipo_msg == "score_update":
            self.game_state["placar"] = msg["placar"]
            self.last_log = f"Placar atualizado: A-{self.game_state['placar']['A']} x B-{self.game_state['placar']['B']}"
        
        return winner_team, winner_player
    
    def submit_event(self, msg):
        req = {
            "op": "jogada",
            "msg": msg,
        }
        resp = self.send_request(req)
        if resp.get("status") != "ok":
            raise RuntimeError(f"Erro ao submeter jogada: {resp.get('message')}")

    def receive_next_ordered_msg(self):
        while not self.expectedMsgInBuffer():
            msg_pack = self.recv_socket.recv(1024)
            msg = pickle.loads(msg_pack)
            self.msgBuffer[msg["seq"]] = msg

        expected_seq = self.game_state["seq"] + 1
        msg = self.msgBuffer.pop(expected_seq)
        self.game_state["seq"] = msg["seq"]
        return msg

    ## ================= Loop principal do jogo
    def run(self):
        self.register_with_group_manager()
        self.new_game_state({"A": 0, "B": 0})
        while True:
            # -> Espera ate 4 jogadores entrarem
            while True:
                response = self.get_table_info()
                if response.get("status") == 'ok':
                    self.get_list_of_peers()
                    self.info = self.getParceiro(response.get("teams"))
                    self.game_state["order"] = response.get("order")
                    # cicla uma vez pra baixo pras outras vezes cliclarem e ignorar a primeira mao
                    self.game_state["order"] = self.game_state["order"][-1:] + self.game_state["order"][:-1] 
                    self.game_state["teams"] = response.get("teams")
                    print(f"Jogadores conectados, seu time: {self.info['team']}")
                    print(f"Você é o jogador {self.peer_id}, sua dupla é o jogador: {self.info['parceiro']}")
                    print(f"Ordem da mesa: {self.game_state['order']}")
                    break
                else:
                    print("Aguardando jogadores...")
                    time.sleep(2)
            
            # -> Logica do jogo principal
            placar = self.game_state["placar"]

            self.new_game_state(placar)
            self.game_state["order"] = self.game_state["order"][1:] + self.game_state["order"][:1]
            
            order = self.game_state["order"]
            self.game_state["current_player"] = order[0]
            
            cards = self.get_cards()
            
            self.mostrar_mesa(cards)

            while self.game_state["fase"] != "HAND_FINISHED":   
                winner_player = None
                winner_team = None
                while self.game_state["fase"] != "HAND_FINISHED" and len(self.game_state["cartas_mesa"]) < 4:  # enquanto nao tiverem jogado 4 cartas
                    # ----------- SE FOR MINHA VEZ
                    if self.game_state["current_player"] == self.peer_id:                      
                        msg = self.prompt_jogada(cards)
                        self.submit_event(msg)

                    msg = self.receive_next_ordered_msg()
                    winner_team, winner_player = self.applyMsg(msg, cards)
                    self.mostrar_mesa(cards)

                if(not winner_team and not winner_player):
                    winner_player, winner_team = self.check_vaza_winner()    # checa quem ganhou a mao
                    self.game_state["vazas_ganhas"][winner_team] += 1
                    self.mostrar_mesa(cards)

                print(f"Vaza {self.game_state['vaza']} vencida pelo jogador {winner_player} - time {winner_team}")
                time.sleep(2)

                if self.game_state["vazas_ganhas"][winner_team] == 2 or self.game_state["fase"] == "HAND_FINISHED":    # ve se o ganhador fez 2 vazas ja
                    self.game_state["fase"] = "HAND_FINISHED"
                    self.mostrar_mesa(cards)
                    print(f"Mao finalizada. Time vencedor: {winner_team}")
                    if self.peer_id == 0:              # So o peer 0 envia, pra nao somar o placar + vzs
                        self.send_result(winner_team)
                    msg = self.receive_next_ordered_msg()
                    self.applyMsg(msg, cards)
                    game_over = self.check_gameover()
                    if game_over:
                        print("Jogo encerrado! Saindo...")
                        time.sleep(5)
                        return
                else:
                    self.game_state["vaza"] += 1
                    self.game_state["cartas_mesa"] = []
                    self.game_state["current_player"] = winner_player
                    self.mostrar_mesa(cards)


if __name__ == "__main__":
    PeerCommunicator().run()


### Dead code (funcoes de outras tarefas que ficaram obsoletas)

def wait_to_start(self):
        conn, _ = self.server_socket.accept()
        msg_pack = conn.recv(1024)
        self.peer_id, self.num_messages = pickle.loads(msg_pack)
        conn.send(pickle.dumps(f"Processo peer {self.peer_id} iniciado."))
        conn.close()
        return self.peer_id, self.num_messages

def send_handshakes(self):
    for addr in self.peers:
        msg_pack = pickle.dumps(('READY', self.peer_id))
        self.send_socket.sendto(msg_pack, addr)

def send_messages(self):
    for msg_number in range(self.num_messages):
        time.sleep(random.uniform(0.01, 0.1))
        msg_pack = pickle.dumps((self.peer_id, msg_number))
        for addr in self.peers:
            self.send_socket.sendto(msg_pack, addr)

def send_stop_signal(self):
    msg_pack = pickle.dumps((-1, -1))
    for addr in self.peers:
        self.send_socket.sendto(msg_pack, addr)
