#include <stdio.h>

struct Node {
    struct Node * left;
    struct Node * right;
    char data; 
};

struct Node createNode(char data){
    struct Node node;
    node.data = data;
    node.right = NULL;
    node.left = NULL;

    return node;
}

int main(){
    struct Node root = createNode(0);
    struct Node children1 = createNode(1);
    struct Node children2 = createNode(2);

    root.left = &children1;
    root.right = &children2;

    printf("left: %d(%p), right: %d(%p)", root.left->data, root.left, root.right->data, root.right);

    return 0;
}