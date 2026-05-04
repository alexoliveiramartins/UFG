#include <stdio.h>

void teste(int array[]){
    array[1] = 1;
    return;
}

void teste2(int *array){
    array[1] = 2;
    return;
}

void printArray(int *arr, int size){
    for(int i = 0; i < size; i++){
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main(){
    int arr[3] = {1,2,3};

    teste(arr);
    printArray(arr, 3);

    teste2(arr);
    printArray(arr, 3);
    
    // mesma coisa :c

    return 0;
}