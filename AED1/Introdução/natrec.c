#include <stdio.h>

void nat(int n){
    if(n == 0) return;
    nat(n - 1);
    printf("%d ", n);
}

int main(){
    int n;
    scanf("%d", &n);
    nat(n);
}