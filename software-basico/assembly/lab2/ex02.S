ex02:
    pushq %rbp
    movq %rsp, %rbp

    cmpl $0, a
    je end_if1

    jmp end_if2
end_if1:

els_if2:
