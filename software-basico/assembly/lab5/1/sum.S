.data

.globl s
.align 4
s:  .int 0

.globl nums
.align 4
nums:  .int 65, -105, 111, 34

.text

.globl sum
sum:
    pushq %rbp
    movq  %rsp, %rbp

    # Seu código aqui...
    
    movl    $0, %eax
    movq    $nums, %r8

begin_while:
    cmpl    $4, %eax
    jge     end_while

    movl    (%r8), %ebx
    addl    %ebx, s
    addq    $4, %r8
    incl    %eax

    jmp     begin_while
end_while:

    leave
    ret