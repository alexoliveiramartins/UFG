#include <stdio.h>

void inv(int n){
    if(n == 0) return;
    printf("%d", n % 10);
    inv(n/10);
}

int main(){
    int n; 
    scanf("%d", &n);
    inv(n);
}