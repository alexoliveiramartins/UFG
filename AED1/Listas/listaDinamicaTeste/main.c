#include <stdio.h>
#include "Lista.h"

int main(){
    Lista * lista = createList();

    addElement(lista, 1);
    addElement(lista, 2);
    addElement(lista, 3);
    addElement(lista, 4);
    addElement(lista, 5);
    addElement(lista, 6);
    printList(lista);

    removeElement(lista, 2);
    printList(lista);

    removeElement(lista, 2);
    printList(lista);

    addElement(lista, 69);
    printList(lista);

    deleteList(lista);
}