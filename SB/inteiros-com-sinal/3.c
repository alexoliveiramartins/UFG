#include <stdio.h>

int main() {
  signed char sc = -1;
  unsigned int ui = sc;
  printf("0x%08X (%u)\n", ui, ui);
    
  signed char teste = ui;
  printf("0x%X (%d)\n", teste, teste);

  return 0;
}