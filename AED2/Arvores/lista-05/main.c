/*
* Código retirado e adaptado de: BACKES, André Ricardo. Algoritmos e Estruturas de Dados em C. Rio de Janeiro: LTC, 2023. 
*/

#include <stdio.h>
#include <stdlib.h>
#include "ArvoreBinaria.h"
int main(){
    int N = 8, dados[8] = {50,100,30,20,40,45,35,37};

    ArvBin* raiz = cria_ArvBin();

    int i;
    for(i=0; i < N; i++){
        insere_ArvBin(raiz,dados[i]);
        printf("Tamanho: %d \n",totalNO_ArvBin(raiz));
    }

    preOrdem_ArvBin(raiz);
    //emOrdem_ArvBin(raiz);
    //posOrdem_ArvBin(raiz);

    // Aqui pode alterar conforme desejado
    // if(remove_ArvBin(raiz,50)){
    //     printf("removido\n");
    //     preOrdem_ArvBin(raiz);
    // }else
    //     printf("NAO removido\n");

    libera_ArvBin(raiz);
    printf("\nFim!\n");
    return 0;
}
