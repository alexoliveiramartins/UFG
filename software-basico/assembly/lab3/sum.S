.data

.globl s
.align 4
s:  .int    0 

.text

.globl sum
sum:
    pushq %rbp
    movq  %rsp, %rbp

    # Seu código aqui...
    movl  $0, %ecx

begin_while:
    #if (i >= 4) => end
    cmpl    $4, %ecx
    jge     end_while

    # nums[1]
    # addr(num) + (sizeof(int))
    movq    %nums, %r8
    movslq  %ecx, %r9
    imulq   $4, %r9
    addq    %r8, %r9

    movl    (%r9), %edx

    addl    %edx, s

    incl    %ecx

    jmp     begin_while
end_while:

    leave
    ret