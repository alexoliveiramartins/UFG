// Minha tentativa de implementacao da Cifra de Cesar
#include <stdio.h>
#include <string.h>

// ascii -> A = 65 / Z = 90

char encrypt(char c, int k){
    if(k >= 26) k %= 26;
    c += k;
    if(c > 90) c -= 26;
    return c;
}

char decrypt(char c, int k){
    if(k >= 26) k %= 26;
    c -= k;
    if(c < 65) c += 26;
    return c;
}

void attack(char *string){
    char aux[5];
    for(int i = 0; i < 26; i++){
        strcpy(aux, string);
        for(int c = 0; c < 4; c++){
            aux[c] = decrypt(aux[c], i);
        }
        printf("Tentativa %d: %s\n", i+1, aux);
    }
}

int main(){
    int k = 5;
    
    char nome[] = "ALEX";

    for(int i = 0; i < 4; i++){
        nome[i] = encrypt(nome[i], k);
    }
    printf("Encriptado: %s\n", nome);

    attack(nome);

    for(int i = 0; i < 4; i++){
        nome[i] = decrypt(nome[i], k);
    }
    printf("Decriptado: %s\n", nome);
}