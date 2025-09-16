#include <stdio.h>

// Escreva uma função que verifique se o 
// número de bits '1' de 
// um inteiro sem sinal é ímpar.

// Use o programa abaixo como base. 
// Passe diferentes valores de entrada, 
// não esquecendo de verificar se os 
// resultados obtidos estão corretos. 
// Por exemplo, teste os valores 
// 0x01010101 (número par de bits 1) e 
// 0x01030101 (número ímpar de bits 1).

int odd_ones(unsigned int x) {
    int count = 0;
    for(int c = 32; c > 0; c--){
        if(x & 1) count++;
        x = x >> 1;
    }
    printf("count: %d\n", count);
    return count & 1;
}

int main() {
  unsigned int v;

  v = 0x01010101;
  printf("%X tem número %s de bits\n", v, odd_ones(v) ? "impar" : "par");

  v = 0x01030101;
  printf("%X tem número %s de bits\n", v, odd_ones(v) ? "impar" : "par");

  return 0;
}