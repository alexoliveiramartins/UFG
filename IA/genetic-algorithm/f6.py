import math, random

limite_superior = 100
limite_inferior = -100
K = 22

# funcao para avaliar x e y aplicados em f6
def fitness(x, y):
    num = math.sin(math.sqrt(x**2 + y**2))**2 - 0.5
    den = (1 + 0.001 * (x**2 + y**2))**2
    return 0.5 - (num/den)

# converte dec -> bin
def decToBin(n):
    return bin(n)[2:]

# converte o numero de 'cromossomo' de 22 bits
# para um valor real inteiro
def valorReal(n):
    return limite_inferior + n * (limite_superior - limite_inferior) / (2**K - 1)

# torneio aleatorio (funcao de selecao)
def torneio(pop):
    a = random.choice(pop)
    b = random.choice(pop)
    
    if avaliar(a) > avaliar(b):
        return a[:]
    
    return b[:]

# roleta (funcao de selecao)
def roleta(pop):
    aptidoes = [avaliar(individuo) for individuo in pop]
    selecionado = random.choices(
        pop,
        weights=aptidoes,
        k=1
    )[0]

    return selecionado[:]

# cruzamento: pega cromossomo 1 e 2 de cada
def cruzar(x, y):
    f1 = [x[0], y[1]]
    f2 = [y[0], x[1]]

    return f1, f2

# mutacao: faz XOR aleatoriamente nos bits
# do individuo com base na taxa de mutacao
def mutacao(individuo, tx_mutacao):
    novo = individuo[:]

    for gene in range(2):
        for bit in range(K):
            if random.random() < tx_mutacao:
                novo[gene] ^= 1 << bit 

    return novo

# gerar individuo aleatorio (para a geracao inicial)
# i = [x, y] (Entre 0 e 2**k)
def gerar_individuo():
    max = 2**K - 1
    return [random.randint(0, max), random.randint(0, max)]

# usa fitness convertendo os cromossomos
#  para os valores reais
def avaliar(individuo):
    x = valorReal(individuo[0])
    y = valorReal(individuo[1])
    return fitness(x, y)

# cria uma nova geracao por meio de 
# cruzamento de pais selecionados por 
# roleta e faz mutacao dos filhos 
# baseado na taxa de mutacao
def criar_geracao(pop, size, tx_cruzamento, tx_mutacao):
    new = []

    while len(new) < size:
        pai = roleta(pop)
        mae = roleta(pop)
    
        if random.random() < tx_cruzamento:
            filho1, filho2 = cruzar(pai, mae)
        else:
            filho1, filho2 = pai[:], mae[:]

        filho1 = mutacao(filho1, tx_mutacao)
        filho2 = mutacao(filho2, tx_mutacao)

        new.append(filho1)

        if len(new) < size:
            new.append(filho2)
 
    return new

# programa principal
def genetic():
    taxa_mutacao = 0.01
    geracoes = 40
    tamanho_pop = 100
    taxa_cruzamento = 0.65
    elitismo = 2

    pop = [gerar_individuo() for _ in range(tamanho_pop)]

    for _ in range(geracoes):
        top_k = sorted(pop, key=avaliar, reverse=True)[:elitismo]
        pop = criar_geracao(pop, tamanho_pop - elitismo, taxa_cruzamento, taxa_mutacao)
        for item in top_k:
            pop.append(item)

    melhor = max(pop, key=avaliar)
    print(f"Cromossomo: {bin(melhor[0])[2:]} {bin(melhor[1])[2:]}")
    print(f"x: {valorReal(melhor[0])} y: {valorReal(melhor[1])} resultado: {avaliar(melhor)}")

genetic()
