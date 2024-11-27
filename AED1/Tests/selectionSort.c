#include <stdio.h>

void selectionSort(int *arr, int n){
    int j, aux, c, temp;
    for(c = 1; c < n; c++){
        aux = c;
        if(arr[c] < arr[c-1]){
            while(aux > 0 && arr[aux] < arr[aux-1]){
                temp = arr[aux];
                arr[aux] = arr[aux-1];
                arr[aux-1] = temp;
                aux--;
            }
        }
    }
}

int main(){
    int c, n; scanf("%d", &n);
    int arr[n];
    for(c = 0; c < n; c++) scanf("%d", &arr[c]);
    selectionSort(arr, n);
    for(c = 0; c < n; c++) printf("%d ", arr[c]);
    
}