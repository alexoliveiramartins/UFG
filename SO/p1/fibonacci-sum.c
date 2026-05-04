/*
  Program: parallelized Fibonacci

  This program implements a Fibonacci summation using threads.
  
  # Input:
  N: Number of steps in the sum (N > 0)
  
  # Output:
  The Fibonacci sum
  
 # Compile:
 gcc -o <my-program>.out <my-program>.c -lpthread
 gcc -o a.out fibonacci-sum.c -lpthread && ./a.out 8
*/



#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

int sum = 0;

typedef struct Operand {
    int x1; // First term of the sum
    int x2; // Second term of the sum
} Operand;

Operand *operandPtr;

void *summation(void *data); // Thread function

int main(int argc, char *argv[]) {
    // Input validation
    if(argc != 2) {
        fprintf(stderr, "Sintax: <my-program.out> <number-of-steps>\n");
        exit(-1);
    }

    int N = atoi(argv[1]);
    operandPtr = (Operand *)malloc(sizeof(Operand));

    if(N < 0) {
        fprintf(stderr, "Argument %d must be non-negative\n", N);
        exit(-1);
    }
    
    pthread_t tid[N]; // TID - Thread identifier
    pthread_attr_t attr; // Thread attributes
    
    // Initialization
    operandPtr->x1 = 0;
    operandPtr->x2 = 1;

    printf("N  : %d terms\n", N);
    printf("Sum: %02d, Partials: %02d, %02d\n", sum, operandPtr->x1, operandPtr->x2);

    // 1. Define threads with default attributes
    pthread_attr_init(&attr);

    // 2. Create N threads
    for(int k=0; k<N; k++) {
        pthread_create(&tid[k], &attr, summation, operandPtr);
        pthread_join(tid[k], NULL);
    }

    // 3. Wait for threads to finish
    // for(int k=0; k<N; k++) {
    // }
    
    free(operandPtr);
    operandPtr = NULL;
}

// Thread function
void *summation(void *data)  {
    /*
    s->x1: First term of the sum
    s->x2: Second term of the sum
    */

    Operand *s = (Operand *)data;
    
    sum = s->x1 + s->x2;
    
    printf("Sum: %02d, Partials: %02d, %02d\n", sum, operandPtr->x1, operandPtr->x2);

    s->x1 = s->x2;
    s->x2 = sum;

    pthread_exit(0);
}
