#include <stdio.h>

int main(){
    int n, o1, o2;
    char op;
    scanf("%d", &n);  
    scanf("%d %c %d", &o1, &op, &o2);

    if(op == 'x'){
        if(o1*o2 > n) printf("overflow\n");
        else printf("no overflow\n");
    }
    else if(op == '+'){
        if(o1 + o2 > n) printf("overflow\n");
        else printf("no overflow\n");
    } 
}