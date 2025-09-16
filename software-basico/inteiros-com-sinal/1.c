#include <stdio.h>

void dump(void *p, int n) {
  unsigned char *p1 = p;
  while (n--) {
    printf("%p - 0x%02X\n", p1, *p1);
    p1++;
  }
}

int main(void) {
  short s = -3;
  int i = -151;
  char c = 150; // o valor aqui ja muda para -106

  printf("dump de s: %d\n", s);
  dump(&s, sizeof(s));

  printf("\ndump de i: %d\n", i);
  dump(&i, sizeof(i));

  printf("\ndump de c: %d\n", c); // c = -106? 
  // c = unsigned char, portanto 2^(n-1) 
  // 150 = 10010110 > 127
  // portanto o bit mais significativo em 150
  // eh interpretado como bit de sinal
  // ~10010110 = 01101001 + 1 = 01101010
  // 01101010_{10} = 106
  // saida c = -106

  dump(&c, sizeof(c));

  return 0;
}