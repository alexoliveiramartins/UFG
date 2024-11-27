#include <stdio.h>

void insertionSort(int *arr, int n){
    int min, aux;
    for(int c = 0; c < n; c++){
        min = c;
        for(int j = c; j < n; j++){
            if(arr[j] < arr[min]) min = j;
        }
        if(min != c){
            aux = arr[min];
            arr[min] = arr[c];
            arr[c] = aux;
        }
    }
}

int main(){
    int n; scanf("%d", &n);
    int arr[n];
    for(int c = 0; c < n; c++) scanf("%d", &arr[c]);
    insertionSort(arr, n);
    for(int c = 0; c < n; c++) printf("%d ", arr[c]);
}