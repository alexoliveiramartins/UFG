#include <stdio.h>

// Complexity = O(n^2)

int main(){
    int n, aux, temp;
    scanf("%d", &n);
    int arr[n];
    for(int c = 0; c < n; c++) scanf("%d", &arr[c]);
    
    for(int c = 1; c < n; c++){
        if(arr[c] < arr[c-1]){
            aux = c;
            while(arr[aux] < arr[aux-1] && aux > 0){
                temp = arr[aux-1];
                arr[aux-1] = arr[aux];
                arr[aux] = temp;
                aux--;
            }
            for(int c = 0; c < n; c++) printf("%d ", arr[c]);
        }
    }
    // VETOR ORDENADO
    for(int c = 0; c < n; c++) printf("%d ", arr[c]);
}