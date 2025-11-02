#include <stdio.h>

int heapSize = 0;

int clearHeap(int * heap, int n){
    while(n--){
        *heap = 0;
        heap++;
    }
}

int parent(int i){
    return (i - 1) / 2;
}

int left(int i){
    return (2*i + 1);
}

int right (int i){
    return (2 * i + 2);
}

void insert(int key){
    if(heapSize == 100){
        printf("\nHeap Overflow");
    }

    
}

int main(){
    int heap[100];
    
    clearHeap(heap, 3);

    printf("%d %d %d", heap[0], heap[1], heap[2]);
}