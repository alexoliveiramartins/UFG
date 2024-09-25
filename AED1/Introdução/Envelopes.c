#include <stdio.h>

int nat(int n){
    if(n == 0) printf("%d ", n+1);
    else return nat(n - 1);
}

int main(){
    int n;
    scanf("%d", &n);
    nat(n);
}