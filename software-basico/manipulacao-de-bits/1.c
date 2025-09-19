#include <stdio.h>

int main(void) {
  unsigned int x = 0x01020304;
  unsigned int a, b;

  // Manter o byte menos significativo de x e os outros bits em '0'
  a = x & 0x000000FF;

  // O byte mais significativo com todos os bits em '1'
  // e manter os outros bytes com o mesmo valor dos bytes de x
  b = x | 0xFF000000;

  printf("a = 0x%08X\n", a);
  printf("b = 0x%08X\n", b);

  return 0;
}

// Se x = 0x87654321, então o resultado da expressão (a) deve ser 0x00000021 e (b) 0xFF654321.
// Se x = 0xAABBCCDD, então o resultado da expressão (a) deve ser 0x000000DD e (b) 0xFFBBCCDD.
// Se x = 0x01020304, então o resultado da expressão (a) deve ser 0x00000004 e (b) 0xFF020304.