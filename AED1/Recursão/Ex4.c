#include <stdio.h>

int reverse(int n){
    printf("%d", n % 10);
    if(n < 10) return n;
    else return reverse(n / 10);
}

int main(){
    int n, c, t;
    scanf("%d", &t);
    while(t % 10 == 0) t /= 10;
    reverse(t);
}