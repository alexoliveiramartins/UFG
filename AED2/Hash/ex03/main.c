/*
* Código retirado e adaptado de: BACKES, André Ricardo. Algoritmos e Estruturas de Dados em C. Rio de Janeiro: LTC, 2023. 
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "TabelaHash.h"


#define MAX_N 10000
#define TAMANHO_TABELA 13001 

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

    struct aluno* lista_de_alunos = (struct aluno*) malloc(MAX_N * sizeof(struct aluno));
    int* matriculas_geradas = (int*) malloc(MAX_N * sizeof(int));

    if(lista_de_alunos == NULL || matriculas_geradas == NULL) {
        printf("Erro de alocacao\n");
        return 1;
    }

    int i;
    for (i = 0; i < MAX_N; i++) {
        int nova_matricula;
        do {
            nova_matricula = rand() % 100000 + 1000;
        } while (ja_existe(nova_matricula, matriculas_geradas, i));
        
        matriculas_geradas[i] = nova_matricula;
        lista_de_alunos[i].matricula = nova_matricula;
        sprintf(lista_de_alunos[i].nome, "Aluno_%d", nova_matricula);
        lista_de_alunos[i].n1 = 5.0;
        lista_de_alunos[i].n2 = 5.0;
        lista_de_alunos[i].n3 = 5.0;
    }
    free(matriculas_geradas);

    int N_testes[] = {100, 1000, 10000};
    int j;

    for (j = 0; j < 3; j++) {
        int N = N_testes[j];
        
        Hash* tabela_linear = criaHash(TAMANHO_TABELA);
        Hash* tabela_quad = criaHash(TAMANHO_TABELA);
        Hash* tabela_duplo = criaHash(TAMANHO_TABELA);

        long total_sondagens_linear = 0;
        long total_sondagens_quad = 0;
        long total_sondagens_duplo = 0;

        for (i = 0; i < N; i++) {
            total_sondagens_linear += insereHash_Linear(tabela_linear, lista_de_alunos[i]);
            total_sondagens_quad += insereHash_Quadratica(tabela_quad, lista_de_alunos[i]);
            total_sondagens_duplo += insereHash_Duplo(tabela_duplo, lista_de_alunos[i]);
        }

        printf("Resultados para N = %d\n", N);
        printf("  Sondagem Linear: %ld sondagens\n", total_sondagens_linear);
        printf("  Sondagem Quadrática: %ld sondagens\n", total_sondagens_quad);
        printf("  Sondagem Duplo Hash: %ld sondagens\n", total_sondagens_duplo);
        printf("------------\n");

        liberaHash(tabela_linear);
        liberaHash(tabela_quad);
        liberaHash(tabela_duplo);
    }

    free(lista_de_alunos);
    return 0;
}