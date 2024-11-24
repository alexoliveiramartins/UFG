#include "fracao.h"
#include <stdio.h>
#include <stdlib.h>

int mmc (int n1, int n2){
    int n, maior, menor;
    if(n1 > n2) { maior = n1; menor = n2; }
    else { maior = n2; menor = n1; }
    n = maior;

    while(n % n1 != 0 || n % n2 != 0){
        n += maior;
    }
    return n;
}

fracao_t *criar(int num, int den){
    if(den == 0)
        return NULL;

    fracao_t *f = (fracao_t *)malloc(sizeof(fracao_t));
    if(f == NULL)
        return NULL;
    
    f->num = num;
    f->den = den;

    return f;
}

void imprimir(fracao_t *f){
    if(f != NULL)
        printf("%d / %d\n", f->num, f->den);
}

void destruir(fracao_t *f){
    if(f != NULL){
        free(f);
        f = NULL;
    }
}

fracao_t *somar(fracao_t *f1, fracao_t *f2){
    if(f1 == NULL || f2 == NULL) return NULL;

    fracao_t *f = (fracao_t *)malloc(sizeof(fracao_t));
    if(f == NULL) return NULL;

    f->den = mmc(f1->den, f2->den);
    f->num = (f->den / f1->den) * f1->num + (f->den / f2->den) * f2->num;

    return f;
}


