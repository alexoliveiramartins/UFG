#include <stdio.h>
#include <math.h>

int main() {
    double a = 1.0;

    // n = 2, 3, 4
    for (int n = 2; n <= 4; n++) {
        int N = n;

        double distancia_total = a * (sqrt( 1.0 + pow( (double)(n+1), 2 )));

        double distancia_parcial = distancia_total / N;

        printf("total do percurso (n = %d): %.02f\n", n, distancia_total);
        printf("percorrida por formiga (n = %d): %.02f\n\n", n, distancia_parcial);
    }

    return 0;
}

// gcc 2.c -o a -lm && ./a