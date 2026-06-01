import re

def extract(msg):
    msg = msg.strip()
    cpf = re.findall(r"\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b", msg)
    email = re.findall(r'\S+@\S+', msg)
    if cpf and email:
        return {"cpf": cpf[0], "email": email[0]}
    else:
        return None