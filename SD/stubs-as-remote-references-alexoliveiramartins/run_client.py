from client import Client
from constRPC import *
from dbclient import DBClient
from requests import get

def get_public_ip():
    return get('https://api.ipify.org').content.decode('utf8')

def run():
    c = Client(PORT_CLIENT)
    db = DBClient(SERVER_ADDR, PORT)

    db.create()
    db.appendData(f"Client {get_public_ip()}")
    db.appendData("Item 2")
    db.appendData("Item 3")
    print(db.getValue())

    input("Digite qualquer coisa para parar o servidor (STOP): ")
    db.stop()

if __name__ == '__main__':
    run()
