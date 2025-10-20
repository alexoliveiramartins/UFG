	.data

# char c = 67;
.globl c
c:  .byte 67

# short s = 23;
.globl s
.align 2
s:  .word 23

# int i = 0;
.globl i
.align 4
i:  .int 0

# int j = 0;
.globl j
.align 4
j:  .int 0

# long l = 1023;
.globl l
.align 8
l:  .quad 1023

# unsigned int ui = 2047;
.globl ui
.align 4
ui: .int 2047

# unsigned long ul = 4095;
.globl ul
.align 8
ul: .quad 4095

	.text

# ---------------------------------------------------------------------------------
	.globl atribuicoes
atribuicoes:
	pushq %rbp
	movq  %rsp, %rbp

	# Se necessário, usar apenas os registradores (ou suas variações) abaixo:
	# %rax, %rcx, %rdx, %rdi, %rsi, %r8, %r9, %r10, %r11

	# Seu código aqui...
    
    movb    $93, c
    movw    $75, s
    movl    $52, j
    movq    $7265, l
    movl    j, %eax
    movl    %eax, i

	leave
	ret

# ---------------------------------------------------------------------------------
	.globl cast
cast:
	pushq %rbp
	movq  %rsp, %rbp

	# Se necessário, usar apenas os registradores (ou suas variações) abaixo:
	# %rax, %rcx, %rdx, %rdi, %rsi, %r8, %r9, %r10, %r11

	# Seu código aqui...

    # ui = i
    movl    i, %eax
    movl    %eax, ui

    # j = s
    movswl    s, %edx
    movl    %edx, j

    # ul = ui
    movl    ui, %ebx
    movl    %ebx, ul

    # s = c + j;
    movsbl   c, %eax
    addl    j, %eax
    movw    %ax, s


	leave
	ret

# ---------------------------------------------------------------------------------
	.globl expressoes
expressoes:
	pushq %rbp
	movq  %rsp, %rbp

	# Se necessário, usar apenas os registradores (ou suas variações) abaixo:
	# %rax, %rcx, %rdx, %rdi, %rsi, %r8, %r9, %r10, %r11

	# Seu código aqui...

    # i = j * s
    movswl      s, %r8d
    imull       j, %r8d
    movl        %r8d, i

    # j = 1 + (s * 3)
    movswl  s, %r9d
    imull   $3, %r9d
    addl    $1, %r9d
    movl    %r9d, j

    # ui = 2 * (i + s * 2)
    movswl  s, %r10d
    imull   $2, %r10d
    movl    i, %r11d
    addl    %r11d, %r10d
    imull   $2, %r10d
    movl    %r10d, ui

    # ul = (l + j * 3) - (s + 1024)
    movslq  j, %rcx
    imulq   $3, %rcx
    addq    l, %rcx

    movswq  s, %rdx
    addq    $1024, %rdx
    
    subq    %rdx, %rcx

    mov     %rcx, ul


	leave
	ret

# ---------------------------------------------------------------------------------
	.globl bitAbit
bitAbit:
	pushq %rbp
	movq  %rsp, %rbp

	# Se necessário, usar apenas os registradores (ou suas variações) abaixo:
	# %rax, %rcx, %rdx, %rdi, %rsi, %r8, %r9, %r10, %r11

	# Seu código aqui...

    # c = c & 0x0F
    andb    $0x0F, c

    # s = s | 0x80
    orw     $0x080, s

    # i = i ^ 0x55
    xorl    $0x55, i

    # j = (j | s) ^ c
    movswl  s, %ecx
    orl     j, %ecx
    movsbl  c, %r10d
    xorl    %r10d, %ecx
    movl    %ecx, j

    # l = l >> 2;
    sarq    $2, l

    # ul = ul >> 4
    shrl    $4, ul

	leave
	ret

# ---------------------------------------------------------------------------------
	.globl ponteiros
ponteiros:
	pushq %rbp
	movq  %rsp, %rbp

	# Se necessário, usar apenas os registradores (ou suas variações) abaixo:
	# %rax, %rcx, %rdx, %rdi, %rsi, %r8, %r9, %r10, %r11

	# Seu código aqui...

    movq    $s, %r8
    movl    $128, (%r8)

	leave
	ret