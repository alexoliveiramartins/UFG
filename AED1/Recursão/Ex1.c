#include <stdio.h>

unsigned long long int factorial(unsigned long long int n){
    if(n == 1) return 1;
    else return (n * factorial(n-2));
}

int main(){
    unsigned long long int n;
    scanf("%llu", &n);
    if(n % 2 == 0) n--;
    printf("%llu", factorial(n));
}