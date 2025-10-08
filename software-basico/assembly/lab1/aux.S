.data

# char c = -20;
# int i = -256;
# int j = 512;
# long l = 128;
# unsigned short us = 111;
# unsigned int ui = 1024;
# unsigned long ul = 2048;

.globl c
c: .byte -20

.globl i
.align 4
i: .int -256

.globl j
.align 4
j: .int 512

.globl l
.align 8
l: .quad 128

.globl us
.align 2
us: .word 111

.globl ui
.align 4
ui: .int 1024

.globl ul
.align 8
ul: .quad 2048

.text

.globl aux
aux:
    pushq   %rbp
    movq    %rsp, %rbp

    # Se necessário, usar apenas os registradores (ou suas variações) abaixo:
    # %rax, %rcx, %rdx, %rdi, %rsi, %r8, %r9, %r10, %r11

    # Seu código aqui...

    # Atribuições simples

    movl    $68000, j       # j = 68000
    movq    $4096, l        # l = 4096

    movl    j, %eax          # i = j
    movl    %eax, i        

    # j = 10 + i - 5
    movl    i, %eax
    addl    $10, %eax
    subl    $5, %eax
    movl    %eax, j

    #   i = (i * 2) - (j + 5);
    movl    i, %eax     # %eax = i
    imull   $2, %eax    # %eax = i * 2

    movl    j, %ebx
    addl    $5, %ebx
    subl    %ebx, %eax  # ebx = ebx- ebx
    movl    %eax, i     # i = eax

    # CASTS

    # ui = i
    movl    i, %eax
    mov     %eax, ui    # ui = i;

    # j = c
    movsbl  c, %eax
    movl    %eax, j

    # ul = ui
    movl    ui, %eax
    mov     %eax, ul

    # us = ul;
    movq    ul, %rax
    movw    %ax, us      

    # c = i + j
    movl    i, %eax
    addl    j, %eax
    movb    %al, c     # c = i + j;

    # Ponteiros:

    movq    $l, %r8
    movq    $128, (%r8)
    movq    $i, %rsi

    movl    j, %eax
    addl    (%rsi), %eax
    movl    %eax, j 

    leave
    ret