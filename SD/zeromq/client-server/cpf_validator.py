import re

def digitoUm(nums):
    peso = 10
    sum = 0
    for digit in nums[:9]:
        digit_peso = digit * peso
        sum += digit_peso
        peso -= 1

    resto = sum % 11
    return 0 if resto < 2 else 11-resto

def digitoDois(nums):
    pesos = 11
    sum = 0
    for digit in nums[:10]:
        digit_peso = digit * pesos
        sum += digit_peso
        pesos -= 1

    resto = sum % 11
    return 0 if resto < 2 else 11-resto

def validateCPF(cpf):
    numeros = re.sub(r"\D", "", cpf)
    num_array = []
    for digit in numeros:
        num_array.append(int(digit))

    um = digitoUm(num_array)
    dois = digitoDois(num_array)

    if num_array[-1] == dois and num_array[-2] == um:
        return True
    else:
        return False
    
if __name__ == '__main__':
    print() 