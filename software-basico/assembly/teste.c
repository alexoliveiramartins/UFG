#include <stdio.h>

int nums[] = {10, -21, -30, 45};

int main(){
    int i, *p;
    for(i = 0, p = nums; i != 4; i++, p++)
        printf("%d\n", *p);

    return 0;
}

/* 

.data
nums:       .int 10, -21, -30, 45

.text
.globl main
main:
    movl    $0, %ebx
    movq    $nums, %r12
.L1:
    cmpl    $4, %ebx
    je      .L2
    movl    (%r12), %eax
    addl    $1, %ebx
    addq    $4, %r12
    jmp     .L1
.L2:
    ret

*/