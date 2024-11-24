#include <stdio.h>

int mmc (int n1, int n2){
    int n, maior, menor;
    if(n1 > n2) { maior = n1; menor = n2; }
    else { maior = n2; menor = n1; }
    n = maior;

    while(n % n1 != 0 || n % n2 != 0){
        n += maior;
    }
    return n;
}

int main(){
    int n1, n2;
    scanf("%d %d", &n1, &n2);
    printf("%d\n", mmc(n1, n2));
}