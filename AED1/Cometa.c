#include <stdio.h>



int main(){
    int ano, n = 1986, count = 0;
    
    scanf("%d", &ano);

    // 76 / 4 = 19
    if(ano < n){
        while(n > ano){
            n -= 76;
            count += 19;
        }
        if(count >= 366) n--;        
        n += 76;
    }
    else{
        while(n < ano){
            n += 76;
            count += 19;
        }
        if(count >= 366) n++;
    }
    printf("%d", n);
}