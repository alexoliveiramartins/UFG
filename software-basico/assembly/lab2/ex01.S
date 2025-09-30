.section .rodata

.data

.align 4
.globl a
a:  .int    30

.align 4
.globl b
b:  .int    45

.align 4
.globl c
c:  .int    -60

.align 4
.globl d
d:  .int    25


.text
.globl ex01
ex01:
   pushq %rbp
   movq  %rsp, %rbp

   # Seu código aqui...

    movl a, %eax
    movl b, %edx

    # a < b 
    cmpl %edx, %eax
    jle end_if01

    negl c

    movl c, %eax
    cltd
    movl $3, %ecx
    idiv %ecx

    movl %eax, d

end_if01:

    movl b, %edx
    cmpl a, %edx
    jl end_if02

    addl a, %edx
    imull c, %edx
    movl %edx, c

    movl $1024, d

end_if02:

   leave
   ret