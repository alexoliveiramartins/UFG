#include <stdio.h>
#include <math.h>

int main(){
    int n;

    double ans, R, r, a, b, c, B, H, semi;

    const double pi = 3.14159265;

    scanf("%d", &n);
    char aux;
    while(n--){
        scanf(" %c", &aux);
        if(aux == 'C'){
            scanf("%lf", &R);
            ans = (pi * (R*R));
        }
        else if(aux == 'E'){
            scanf("%lf %lf", &R, &r);
            ans = r * R * pi;
        }
        else if(aux == 'T'){
            scanf("%lf %lf %lf", &a, &b, &c);
            semi = (a + b + c) / 2;
            ans = sqrt(semi*(semi-a)*(semi-b)*(semi-c));
        }
        else if(aux == 'Z'){
            scanf("%lf %lf %lf", &B, &b, &H);
            ans = ((B + b)*H)/2;
        }
        printf("%.0lf\n", ans);

    }
}