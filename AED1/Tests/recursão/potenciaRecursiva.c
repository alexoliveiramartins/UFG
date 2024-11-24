#include <stdio.h>

int potencia(int n, int exp){
    if(exp == 1) return n;
    else return n * potencia(n, exp - 1);
}

int main(){
    int n;
    scanf("%d", &n);
    printf("%d", potencia(n, 3));
}