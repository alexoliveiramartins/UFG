#include <stdio.h>

int main(){
    int c, j, i, aux;
    int n; scanf("%d", &n);
    int preco[n];
    for(c = 0; c < n; c++) scanf("%d", &preco[c]);
    int q; scanf("%d", &q);
    int moedas[q];
    for(c = 0; c < q; c++) scanf("%d", &moedas[c]);
    for(c = 0; c < q; c++){
        int soma = 0;
        int ans[10000];
        for(j = 0; j < n; j++){
            if(moedas[c] >= preco[j]){
                ans[soma++] = j+1;
            }
        }
        for(j = 0; j < soma-1; j++){
            for(i = 0; i < soma-1; i++){
                if(ans[i] > ans[i+1]){
                    aux = ans[i];
                    ans[i] = ans[i+1];
                    ans[i+1] = aux;
                }
            }
        }
        printf("%d ", soma);
        for(i = 0; i < soma; i++) printf("%d ", ans[i]);
        printf("\n");
    }
}