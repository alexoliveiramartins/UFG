#include <stdio.h>

int primo(int n){
    int c;
    for(c = 2; c < n; c++){
        if(n % c == 0) return 0;
    }
    return 1;
}

int main(){
    unsigned long a = 354224848179261915075;
    printf("%lu\n", a);
}