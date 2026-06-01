import re

def _digitoUm(nums):
    peso = 10
    sum = 0
    for digit in nums[:9]:
        digit_peso = digit * peso
        sum += digit_peso
        peso -= 1

    resto = sum % 11
    return 0 if resto < 2 else 11-resto

def _digitoDois(nums):
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

    um = _digitoUm(num_array)
    dois = _digitoDois(num_array)

    if num_array[-1] == dois and num_array[-2] == um:
        return True
    else:
        return False

def validate_email(email):
    pattern = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])"
    match = re.match(pattern, email)
    if match != None:
        return True
    else:
        return False

# fonte: https://uibakery.io/regex-library/email-regex-python