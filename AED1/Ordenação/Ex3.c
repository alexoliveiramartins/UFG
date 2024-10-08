#include <stdio.h>

// selection sort

int main(){
    int t, c; scanf("%d", &t);
    while(t--){
        int n, aux, temp; scanf("%d", &n);
        int arr[n];
        for(c = 0; c < n; c++) scanf("%d", &arr[c]);
        for(c = 1; c < n; c++){
            aux = c;
            if(arr[aux] < arr[aux-1]){
                while(aux > 0 && arr[aux] < arr[aux-1]){
                    temp = arr[aux];
                    arr[aux] = arr[aux-1];
                    arr[aux-1] = temp;
                    aux--;
                }
            }
        }
        for(c = 0; c < n; c++) printf("%d ", arr[c]);
        printf("\n");
    }
}