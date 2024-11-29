#include <stdio.h>
#include <stdlib.h>

struct node {
    int value;
    struct node* next;
};
typedef struct  node node_t;

void printList(node_t * head){
    node_t * temporary = head;

    while(temporary != NULL){
        printf("[%d] ", temporary->value);
        temporary = temporary->next;
    }

}

int main(){
    node_t *node1 = (node_t *)malloc(sizeof(node_t));
    node1->value = 1;
    node1->next = NULL;
    node_t *node2 = (node_t *)malloc(sizeof(node_t));
    node2->value = 2;
    node2->next = node1;
    node_t *node3 = (node_t *)malloc(sizeof(node_t));
    node3->value = 3;
    node3->next = node2;

    node_t * head = (node_t *)malloc(sizeof(node_t));
    head->next = node3;

    printList(head);

    free(node1);
    free(node2);
    free(node3);
    free(head);
}