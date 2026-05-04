.section .rodata

.data

.globl a
.align 4
a: .int 0

.globl b
.align 8
b: .quad 2

.text
.globl ex02
ex01:
   pushq %rbp
   movq  %rsp, %rbp

   # Seu código aqui...

    movl    a, %eax
    compl   $0, %eax
    jle     end_if

    movl    b, %eax
    compl   $5, %eax
    jl      end_if_2

end_if_2:
    movl    b, %ecx
    
end_if_1:

   leave
   ret