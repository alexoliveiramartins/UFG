#include <stdio.h>

int main(){
    int n1, n2, c, um, dois;
    scanf("%d %d", &n1, &n2);

    um = ((n1 % 10)*100) + (((n1/10) % 10)*10) + ((n1/100));
    dois = ((n2 % 10)*100) + (((n2/10) % 10)*10) + ((n2/100));

    if(um > dois) printf("%d", um);
    else printf("%d", dois);
}