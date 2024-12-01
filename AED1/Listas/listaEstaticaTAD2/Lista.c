#include <stdio.h>
#include "Lista.h"

struct Lista
{
    int array[100];
    int size;
    int elementsNumber;
};

Lista createList(int size){
    Lista lista;
    lista.size = size;
    lista.elementsNumber = 0;
    return lista;
};

void addElement(Lista * lista, int element){
    if(lista->size > lista->elementsNumber){
        lista->array[lista->elementsNumber] = element;
        lista->elementsNumber++;
    }
}

void removeElement(Lista * lista, int pos){
    int c, aux, num;
    if(pos <= lista->elementsNumber){
        pos--;
        for(c = pos; c < lista->elementsNumber; c++){
            lista->array[c] = lista->array[c+1]; 
        }
        lista->elementsNumber--;
    }
}

void printList(Lista lista){
    int c;
    for(c = 0; c < lista.elementsNumber; c++){
        printf("%d ", lista.array[c]);
    }
    printf("\n");
}