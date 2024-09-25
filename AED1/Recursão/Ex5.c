#include <stdio.h>

int i[100];
int k = 0;

void binario(int n){
    int c;
    if(n == 0){
        for(c = k-1; c >= 0; c--){
            printf("%d", i[c]);
        }
        return;
    }
    else{
        i[k++] = n % 2;
        return binario(n / 2);
    }
}

int main(){
    int n, c, t;
    scanf("%d", &t);
    while(t--){
        k = 0;
        scanf("%d", &n);
        binario(n);
        printf("\n");
    }
}