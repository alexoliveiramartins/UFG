.data

.text

.globl swap
swap:
    pushq %rbp
    movq  %rsp, %rbp

    # Seu código aqui...
    
    movl    $4, %ecx

    # i=0
    movl    $0, %eax

begin_for:
    # if (i >= j) break
    cmpl    $ecx, %eax
    jge     end_for

    # bloco do for

    incl    %eax    # i++
    decl    %ecx    # j--

    jmp     begin_for

end_for:
    leave
    ret