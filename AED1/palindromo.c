#include <stdio.h>

int main(){
    int n, n1, n2, c, um, dois;

    scanf("%d", &n);
    while(n--){
        scanf("%d", &n1);
        if(((n1 / 10) % 10) == ((n1 / 100) % 10) && (n1 % 10) == (n1 / 1000)){
            printf("yes ");
        }
        else printf("no ");
    }
}