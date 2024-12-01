#include <stdio.h>
#include "Lista.h"

// Teste de lista sequencial de numeros sem encapsulamento e estatica.

// Funcionalidades: adicionar elemento, criar lista, remover elemento e
// imprimir lista.

int main(){
    Lista lista1 = createList(10);
    addElement(&lista1, 1);
    addElement(&lista1, 2);
    printList(lista1);
    addElement(&lista1, 6);
    addElement(&lista1, 20);
    printList(lista1);
    removeElement(&lista1, 5);
    printList(lista1);
}