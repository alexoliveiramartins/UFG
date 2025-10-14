.data

# Definição da variável 'str' aqui...
    .globl str
str: .string "BEBAMUITOCAFE"


.text
.globl process
process:
   pushq %rbp
   movq  %rsp, %rbp

   # Inicialização de 'ptr' aqui (Obs: utilize %r8 como sendo 'ptr')
   # ptr = str

    mov     $str, %r8

beginwhile:
   cmpb $0, (%r8)
   je endwhile            # while() {

   # Bloco do while

    movb    (%r8), %al
    addb    $32, %al
    movb    %al, (%r8)

    incq    %r8

   jmp beginwhile         # }
endwhile:

   leave
   ret