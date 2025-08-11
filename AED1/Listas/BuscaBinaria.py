list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

entrada = int(input("Digite o numero para achar de 1-15: "))
tentativas = 0

start = 0
end = len(entrada) - 1
mid = 0

while 1:
    mid = int((start + end) / 2)
    tentativas += 1
    if list[mid] == entrada:
        print(f"Achado entrada ({list[mid]}). Tentativas: {tentativas}")
        break
    elif list[mid] > entrada:
        end = mid-1
    elif list[mid] < entrada:
        start = mid + 1
    elif start > end:
        print("Nao encontrado")
        break