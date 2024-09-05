#include <stdio.h>

char letra(int n){
    if(n == 0) return 'A';
    else if(n == 1) return 'C';
    else if(n == 2) return 'G';
    else if(n == 3) return 'T';
    else return 'l';
}

int valid(char c){
    if(c == 'A' || c == 'C' || c == 'G' || c == 'T') return 1;
    else return 0;
}

int main(){
    int n, num, c;
    int k = 0;
    scanf("%d", &n);
    while(n--){
        k = 0;
        scanf("%d", &num);
        char b[100];
        while(num != 0){
            b[k] = letra(num % 4);
            num /= 4;
            k++;
        }
        // for(int c = 0; c < 100; c++){
        //     printf("%c ", b[c]);
        // }
        for(c = k-1; c >= 0; c--){
            if(valid(b[c])) printf("%c", b[c]);
        }
        printf("\n");
    }
}