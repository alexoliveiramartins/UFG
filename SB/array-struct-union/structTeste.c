#include <stdio.h>

struct s {
    int a;
    int b;
    char c;
};

int main(){
    struct s var;
    char *p_bytes = (char*)&var;

    *p_bytes = 10;
    *(p_bytes + sizeof(int)) = 20;
    *(p_bytes + (sizeof(int)*2)) = 30;

    printf("a(%p):%X b(%p):%X c(%p):%X\n", &var.a, var.a, &var.b, var.b, &var.c, var.c);

    return 0;
}