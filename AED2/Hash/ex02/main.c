/*
* Código retirado e adaptado de: BACKES, André Ricardo. Algoritmos e Estruturas de Dados em C. Rio de Janeiro: LTC, 2023. 
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "TabelaHash.h"


#define TAMANHO_HASH 100 
#define N 150          


struct hash{
    int qtd, TABLE_SIZE;
    struct aluno **itens;
};
typedef struct hash Hash;


int ja_existe(int matricula, int* array, int tamanho_atual) {
    int i;
    for (i = 0; i < tamanho_atual; i++) {
        if (array[i] == matricula) {
            return 1;
        }
    }
    return 0;
}

int main(){
    srand(time(NULL));

    int tamanho = TAMANHO_HASH;
    Hash *tabela = criaHash(tamanho);

    
    int* matriculas_inseridas = (int*) malloc(N * sizeof(int));
    if(matriculas_inseridas == NULL) {
        printf("Erro de alocacao\n");
        return 1;
    }

    struct aluno al;
    int i;

    
    for (i = 0; i < N; i++) {
        int nova_matricula;
        
        do {
            nova_matricula = rand() % 5000 + 1000; 
        } while (ja_existe(nova_matricula, matriculas_inseridas, i));
        
        matriculas_inseridas[i] = nova_matricula;
        
        al.matricula = nova_matricula;
        sprintf(al.nome, "Aluno_%d", nova_matricula); 
        al.n1 = 7.0; al.n2 = 8.0; al.n3 = 9.0;
        al.proximo = NULL; 
        
        printf("Inserindo: %d\n", al.matricula);
        insereHash_ComColisao(tabela, al); 
    }

    printf("------------\n\n");

    
    struct aluno al_busca;

    
    int mat_busca1 = matriculas_inseridas[0];
    if(buscaHash_ComColisao(tabela, mat_busca1, &al_busca)) {
        printf("%s, %d\n", al_busca.nome, al_busca.matricula);
    }

    
    int mat_busca2 = matriculas_inseridas[N - 1];
    if(buscaHash_ComColisao(tabela, mat_busca2, &al_busca)) {
        printf("%s, %d\n", al_busca.nome, al_busca.matricula);
    }

    
    int mat_inexistente = 999999;
    if(!buscaHash_ComColisao(tabela, mat_inexistente, &al_busca)) {
        printf("Aluno %d nao encontrado.\n", mat_inexistente);
    }

    liberaHash(tabela);
    free(matriculas_inseridas);

    return 0;
}