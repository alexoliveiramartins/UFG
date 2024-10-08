#include <stdio.h>

//bubblesort

int main(){
    int n, c, j, impar = 0, par = 0, aux; 
    scanf("%d", &n);
    int arrPar[n], arrImp[n];
    for(c = 0; c < n; c++) {
        scanf("%d", &aux);
        if(aux % 2 == 0) arrPar[par++] = aux;
        else arrImp[impar++] = aux;
    }
    for(c = 0; c < par-1; c++){ 
        for(j = 0; j < par-1; j++){
            if(arrPar[j] > arrPar[j+1]){
                aux = arrPar[j];
                arrPar[j] = arrPar[j+1];
                arrPar[j+1] = aux;
            }
        }
    }
    for(c = 0; c < impar-1; c++){
        for(j = 0; j < impar-1; j++){
            if(arrImp[j] < arrImp[j+1]){
                aux = arrImp[j];
                arrImp[j] = arrImp[j+1];
                arrImp[j+1] = aux;
            }
        }
    }
    if(par > 0){
        for(c = 0; c < par; c++) printf("%d ", arrPar[c]);
        printf("\n");
    }
    if(impar > 0){
        for(c = 0; c < impar; c++) printf("%d ", arrImp[c]);
        printf("\n");   
    }
}