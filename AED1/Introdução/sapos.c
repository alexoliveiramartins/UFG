#include <stdio.h>

int main(){
    int i, s, p, aux;
    scanf("%d %d", &p, &s);
    int pedras[p+1];
    for(i = 0; i < p+1; i++){
        pedras[i] = 0;
    }
    int pI, d;
    for(i = 1; i <= s; i++){
        scanf("%d %d", &pI, &d);
        pedras[pI] = 1;
        aux = pI;
        while(pI + d < p+1){
            pI += d;
            pedras[pI] = 1;
        }
        pI = aux;
        while(pI - d >= 1){
            pI -= d;
            pedras[pI] = 1;
        }
    }
    for(i = 1; i < p+1; i++){
        if(pedras[i] >= 1) printf("1\n");
        else printf("0\n");
    }
}