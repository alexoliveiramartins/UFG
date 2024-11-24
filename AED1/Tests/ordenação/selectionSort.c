#include <stdio.h>

// Complexity = O(n^2)

int main(){
    int aux, c, n, min, j; scanf("%d", &n);
    int arr[n];
    for(c = 0; c < n; c++) scanf("%d", &arr[c]);
    
    for(c = 0; c < n; c++){
        min = c; 
        for(j = c; j < n; j++){
            if(arr[j] < arr[min]) min = j;
        }
        aux = arr[c];
        arr[c] = arr[min];
        arr[min] = aux;
    }

    for(c = 0; c < n; c++) printf("%d ", arr[c]);
}

// first try btw