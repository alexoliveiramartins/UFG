.data

.globl last
.align 8
last:   .quad   0

.globl values
.align 8
values:   .quad 50, -10, 60, -20, 70

.text

.globl swap
swap:
    pushq %rbp
    movq  %rsp, %rbp

    # Seu código aqui...

    movl    $0, %eax    # rax = i = 0
    movl    $4, %ecx    # rcx = j = 4

    movq    $values, %r8    # r8 = &values[i]
    movq    %r8, %r9        # r9 = &values[i]
    addq    $32, %r9        # r9 = &values[i+4] (j)


begin_while:
    cmpl    %ecx, %eax 
    jge      end_while   # i >= j -> end_while 

    # tmp = values[i]
    movq    (%r8), %r10    

    # values[i] = values[j]
    movq    (%r9), %r11
    movq    %r11, (%r8)

    # values[j] = tmp
    movq    %r10, (%r9)

    incl    %eax
    decl    %ecx

    addq    $8, %r8    # &i = i + sizeof(long)
    subq    $8, %r9    # &j = j + sizeof(long)
    
    jmp     begin_while

end_while:

    movq    $values, %rdx
    addq    $32, %rdx
    movq    (%rdx), %r12
    movq    %r12, last

    leave
    ret