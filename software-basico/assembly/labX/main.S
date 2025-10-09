.section .rodata

.data

.globl val
.align 4
val: .int 432

.globl age
.align 2
val: .short 

.globl r
.align 4
val: .int 0

.globl err
.align 8
val: .quad 2048

.section .rodata 
fmt: .string "Hello"

.text

.globl main
main:
   pushq %rbp
   movq  %rsp, %rbp

   # Seu código aqui...

   movq $fmt, %rdi
   movl val, r%esi
   movw age, %dx
   movq $r, %cx
   call  show
   movq err, %rdi
   movl val, %esi
   movl r, %edx

  sum
   
   movl %eax, val

   # call show

   # Faça o "return"

   movl $0, %eax

   leave
   ret