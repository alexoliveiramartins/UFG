#include <stdio.h>
#include <math.h>

int casas[100];
int k = 0;

int descricao(int n){
    casas[k++] = n % 10;
    // printf("%d", n % 10);
    if(n < 10) return n;
    else return descricao(n / 10);
}

int main(){
    int n, c, start = 0;
    scanf("%d", &n);
    descricao(n);
    if(n >= 10000){
        printf("Numero invalido!");
        return 0;
    }
    else if(n >= 1000) printf("(quarta ordem) %d = ", n);
    else if(n >= 100) printf("(terceira ordem) %d = ", n);
    else if(n >= 10) printf("(segunda ordem) %d = ", n);
    else printf("(primeira ordem) %d = ", n);

    for(c = k-1; c >= 0; c--){
        if(casas[c] != 0){
            if(start) printf(" + ");
            printf("%d", casas[c]);
            if(c == 0){
                printf(" unidade"); if(casas[c] > 1) printf("s");
                start = 1;
            }
            else if(c == 1){
                printf(" dezena"); if(casas[c] > 1) printf("s");
            }
            else if(c == 2){
                printf(" centena"); if(casas[c] > 1) printf("s");
            }
            else if(c == 3){
                if(casas[c] > 1){
                    printf(" unidades de milhar");
                }
                else printf(" unidade de milhar");
            }
            start = 1;
        }
    }
    printf(" = ");
    start = 0;
    for(c = k-1; c >= 0; c--){
        if(casas[c] != 0){
            if(start) printf(" + ");
            printf("%d", casas[c] * (int)(pow(10, c)));
            start = 1;
        }
    }
}