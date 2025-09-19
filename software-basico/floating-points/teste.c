#include <stdio.h>

#define makefloat(s,e,f) (((s) & 1)<<31 | (((e) & 0xff) << 23) | ((f) & 0x7fffff))
#define getsig(i)  ((i)>>31 & 1)
#define getexp(i)  ((i)>>23 & 0xff)
#define getfrac(i) ((i) & 0x7fffff)

typedef union { 
  float f;
  unsigned int i;
} U;

int main(){
    U u;
    u.f = -42.1875;
    unsigned int a = 163;

    unsigned int s = getsig(u.i);
    unsigned int e = getexp(u.i);
    unsigned int f = getfrac(u.i);

    e = e | (e >> 5) | s;
    printf("e: %x, f: %x, a: %x, a << 14: %x\n", e, f, a, (a << 14));
    f = f & (a << 14);

    u.i = makefloat(s, e, f);
    
    printf("\ne: %x m: %x\n ", e, f);
    printf("%f\n", u.f);

}