#include <stdlib.h>
#include <stdio.h>

// node struct
typedef struct Node{
    int data;
    struct Node * next;
} node;

// criar novo node
node* newNode(int value){
    node *new = (node *)malloc(sizeof(node));
    if(new == NULL){
        printf("Error\n");
        return NULL;
    }
    new->data = value;
    new->next = NULL; 
    return new;
}

// inserir node no final
void insertAtEnd(node **Head, int value){
    node *new = newNode(value);
    if(*Head == NULL){
        *Head = new;
        return;
    }
    node *temp = *Head;
    while(temp->next != NULL){
        temp = temp->next;
    }
    temp->next = new;
}

// inserir node no come(ss)o
void insertAtBeginning(node **Head, int value){
    node *new = newNode(value);
    if(*Head == NULL){
        *Head = new;
        return;
    }
    new->next = *Head;
    *Head = new;
}

// deletar node por valor
void deleteNodeByValue(node **Head, int value){
    if (*Head == NULL) {
        return;
    }

    node *temp = *Head;
    node *prev = NULL;

    // se o node pra deletar for o head
    if(temp->data == value){
        *Head = temp->next;
        free(temp);
        return;
    }

    while (temp != NULL && temp->data != value) {
        prev = temp;
        temp = temp->next;
    }

    if(temp == NULL){
        return;
    }

    prev->next = temp->next;
    free(temp);
    return;
}

// printa a lista
void printList(node *Head){
    node *temp = Head;
    while(temp != NULL){
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\n");
}


int main(){
    node *Head = NULL;

    insertAtEnd(&Head, 10);
    printList(Head);

    insertAtEnd(&Head, 11);
    insertAtEnd(&Head, 12);
    insertAtEnd(&Head, 13);
    insertAtEnd(&Head, 14);
    insertAtEnd(&Head, 15);
    printList(Head);

    insertAtBeginning(&Head, 9);
    insertAtBeginning(&Head, 8);
    insertAtBeginning(&Head, 7);
    printList(Head);

    deleteNodeByValue(&Head, 10);
    deleteNodeByValue(&Head, 15);
    deleteNodeByValue(&Head, 69);
    printList(Head);
}