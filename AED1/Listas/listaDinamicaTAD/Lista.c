#include <stdio.h>
#include <stdlib.h>
#include "Lista.h"

struct Lista{
    int *array;
    int numElements;
};

Lista * createList(){
    Lista * list = (Lista *)malloc(sizeof(Lista));
    if(list == NULL){
        printf("Failed to create list");
    }
    list->array = NULL;
    list->numElements = 0;
    return list;
}

void removeElement(Lista * lista, int index){
    int c;
    lista->numElements--;
    if(index != lista->numElements){
        for(c = index-1; c < lista->numElements; c++){
            lista->array[c] = lista->array[c+1];
        }
    }

    int * temp = realloc(lista->array, sizeof(int) * (lista->numElements));
    if(temp != NULL){
        lista->array = temp;
    } else{
        free(lista);
        printf("Failed");
        return;
    }
};

void addElement(Lista * lista, int element){
    lista->numElements++;

    int * temp = realloc(lista->array, sizeof(int) * (lista->numElements));
    if(temp != NULL){
        lista->array = temp;
    } else {
        free(lista);
        printf("Failed");
        return;
    }
    lista->array[lista->numElements-1] = element;
};

void printList(Lista * list){
    int c;
    for(c = 0; c < list->numElements; c++){
        printf("%d ", list->array[c]);
    }
    printf("\n");
}

void deleteList(Lista * list){
    free(list->array);
    free(list);
};
