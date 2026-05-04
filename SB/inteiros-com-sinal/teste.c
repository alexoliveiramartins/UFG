#include <stdio.h>

int main(){
    int a = -1;
    unsigned int z = 0;

    if(a > z){
        printf("%d(0x%x) > %d(0x%x)\n", a, a, z, z);
    }
    
    printf("int: %d, long: %d", sizeof(int), sizeof(long));
}