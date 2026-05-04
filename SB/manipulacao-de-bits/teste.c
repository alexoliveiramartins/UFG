#include <stdio.h>

int main(){

    unsigned int e = 132;
    printf("%x\n", e);
    printf("%x\n", e | e >> 5 | 1);

}