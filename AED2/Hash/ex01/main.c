/*
* Código retirado e adaptado de: BACKES, André Ricardo. Algoritmos e Estruturas de Dados em C. Rio de Janeiro: LTC, 2023. 
*/

#include <stdio.h>
#include <stdlib.h>
#include "TabelaHash.h"

struct hash{
    int qtd, TABLE_SIZE;
    struct aluno **itens;
};
typedef struct hash Hash;

int main(){
    int tamanho = 1024;
    Hash *tabela = criaHash(tamanho);

    struct aluno al;
    struct aluno a[4] = {{12352,"Andre",9.5,7.8,8.5},
                         {7894,"Ricardo",7.5,8.7,6.8},
                         {3451,"Bianca",9.7,6.7,8.4},
                         {5293,"Ana",5.7,6.1,7.4}};

    int i;
    for (i = 0; i < 4; i++) {
        printf("Inserindo: %d\n", a[i].matricula);
        insereHash_SemColisao(tabela, a[i]);
    }

    printf("------------\n\n");

    // buscaHash_SemColisao(tabela, 12352, &al);
    // printf("%s, %d\n",al.nome,al.matricula);

    // buscaHash_SemColisao(tabela, 3451, &al);
    // printf("%s, %d\n",al.nome,al.matricula);

    // buscaHash_SemColisao(tabela, 5293, &al);
    // printf("%s, %d\n",al.nome,al.matricula);


    struct aluno alTabela; 
    buscaHash_SemColisao(tabela, 12352, &alTabela);
    printf("Aluno na tabela (antes da remocao): %s, %d\n",alTabela.nome,alTabela.matricula);
    removeHash_SemColisao(tabela, alTabela.matricula);

    int resultadoBusca = buscaHash_SemColisao(tabela, 12352, &alTabela);
    if(!resultadoBusca) {
        printf("Aluno removido com sucesso!\n");
    } else printf("Erro ao remover aluno\n");

    liberaHash(tabela);

    return 0;
}
