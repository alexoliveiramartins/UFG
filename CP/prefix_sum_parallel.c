#include <stdio.h>
#include <omp.h>

void inclusive_scan(int *data, int n) {
    int temp[16];

    for (int d = 1; d < n; d <<= 1) {
        #pragma omp parallel for
        for (int i = 0; i < n; i++) {
            if (i >= d)
                temp[i] = data[i] + data[i - d];
            else
                temp[i] = data[i];
        }

        #pragma omp parallel for
        for (int i = 0; i < n; i++) {
            data[i] = temp[i];
        }
    }
}

int main() {
    int vec1[16];
    int vec2[16];
    int n = 16;
    int ts = 8;

    omp_set_num_threads(ts);

    for (int i = 0; i < n; i++) {
        vec1[i] = 1;
        vec2[i] = i + 1;
    }

    inclusive_scan(vec1, n);
    inclusive_scan(vec2, n);

    printf("Vetor 1 (todos 1) - soma de prefixos inclusiva:\n");
    for (int i = 0; i < n; i++) {
        printf("%d ", vec1[i]);
    }
    printf("\n");
    
    printf("Vetor 2 (naturais 1..16) - soma de prefixos inclusiva:\n");
    for (int i = 0; i < n; i++) {
        printf("%d ", vec2[i]);
    }

    return 0;
}