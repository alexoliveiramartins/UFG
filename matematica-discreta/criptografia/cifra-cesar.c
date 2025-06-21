// Minha tentativa de implementacao da Cifra de Cesar
#include <stdio.h>

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

int main(){
    int k = 5;
    
    char nome[] = "ALEX";

    for(int i = 0; i < 4; i++){
        nome[i] = encrypt(nome[i], k);
    }

    printf("%s\n", nome);

    for(int i = 0; i < 4; i++){
        nome[i] = decrypt(nome[i], k);
    }

    printf("%s\n", nome);
}