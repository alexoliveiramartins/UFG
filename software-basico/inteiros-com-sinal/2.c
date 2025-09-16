#include <stdio.h>

void dump(void *p, int n) {
  unsigned char *p1 = p;
  while (n--) {
    printf("%p - 0x%02X\n", p1, *p1);
    p1++;
  }
}

int main() {
  short s;
  int i;
  long l;

  s = 108; // 0x006c
  i = (int)s; // 0x0000006c
  printf("--- s:\n");
  dump(&s, sizeof(s)); 

  printf("--- i:\n");
  dump(&i, sizeof(i));

  printf("-----------------------------------------------------------------");

  i = -10; // ~(1010)+1 = 0101+1 = (1111)3x 0110 = 0xFFFFFFF6
  l = (long)i; //  (1111)7x 11110110 = 0xFFFFFFFFFFFFFFF6

  printf("--- i:\n");
  dump(&i, sizeof(i));

  printf("--- c:\n");
  dump(&l, sizeof(l));

  printf("-----------------------------------------------------------------");

//   l = 83728472363;
//   i = (int)l;
//   s = (short)l;

//   printf("--- c:\n");
//   dump(&l, sizeof(l));

//   printf("--- i:\n");
//   dump(&i, sizeof(i));

//   printf("--- s:\n");
//   dump(&s, sizeof(s));

  return 0;
}