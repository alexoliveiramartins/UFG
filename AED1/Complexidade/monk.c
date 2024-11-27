#include <stdio.h>

int main(){
    int c, n; scanf("%d", &n);
    char s[10000];
    while(n--){
        int count = 0;
        scanf("%*c%[^\n]", s);
        for(c = 0; s[c]; c++){
            if(s[c] == 'a' || s[c] == 'A' || s[c] == 'e' || s[c] == 'E' || s[c] == 'i' || s[c] == 'I' || s[c] == 'o' || s[c] == 'O' || s[c] == 'u' || s[c] == 'U'){
                count++;
            }
        }
        printf("%d\n", count);
    }
}