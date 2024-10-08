#include <stdio.h>

int main(){
    int t; scanf("%d", &t);
    int count, n, aux, c, j;
    while(t--){
        count = 0;
        scanf("%d", &n);
        int vag[n];
        for(c = 0; c < n; c++) scanf("%d", &vag[c]);
        for(c = 0; c < n-1; c++){
            for(j = 0; j < n-1; j++){
                if(vag[j] > vag[j+1]){
                    aux = vag[j+1];
                    vag[j+1] = vag[j];
                    vag[j] = aux;
                    
                    count++;  
                }
            }
        }
        printf("%d\n", count);
    }
}   