#include <stdio.h>

int main(){
    int k, n, c;
    long long res, f1, f2, aux;
    scanf("%d", &k);
    while(k--){
        scanf("%d", &n);
        f1 = f2 = 1;
        res = 0;
        for(c = 2; c < n; c++){
            aux = f1;
            res = f1 + f2;
            f1 = res;
            f2 = aux;
        }
        printf("%lld\n", res);
    }
}