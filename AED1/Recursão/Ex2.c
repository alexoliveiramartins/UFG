#include <stdio.h>

int fibonacci(int n){
    if(n == 0){
        // printf("%d ", n);
        return 0;
    }
    else if(n == 1){
        // printf("%d ", n);
        return 1;
    }
    else {
        printf("%d ", fibonacci(n-1) + fibonacci(n-2));
        // return fibonacci(n-1) + fibonacci(n-2);
    }

}

int main(){
    int n, c;
    scanf("%d", &n);
    printf("%d ", fibonacci(n));
}