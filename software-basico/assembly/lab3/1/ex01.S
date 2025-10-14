.section .rodata

.data

# int a = 30;
.globl a
.align 4
a:  .int 30

# int b = 45;
.globl b
.align 4
b:  .int 45

# int c = -60;
.globl c
.align 4
c:  .int -60

# int d = 25;
.globl d
.align 4
d:  .int 25

.text
.globl ex01
ex01:
   pushq %rbp
   movq  %rsp, %rbp

   # Seu código aqui...

    # _if(a>b)

    movl    a, %eax
    cmpl   b, %eax
    jle      depois_if

    movl    c, %eax
    negl    %eax
    movl    $3, %ecx
    idivl   %ecx

    movl    %eax, d
depois_if:

    # _if(b>=a)
    movl    a, %r10d
    cmpl    b, %r10d
    jge depois_if2
    
    # c = (a + b) * c;
    movl    a, %r11d
    addl    b, %r11d
    imull   c, %r11d
    movl    %r11d, c

    # d = 1024;
    movl    $1024, d
    
depois_if2:

   leave
   ret