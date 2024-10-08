#include <stdio.h>

int main(){
    int min, j, aux, temp, c, n, countIns = 0, countSel = 0; scanf("%d", &n);
    int arrSel[n], arrIns[n];
    for(c = 0; c < n; c++){
        scanf("%d", &arrSel[c]);
        arrIns[c] = arrSel[c];
    }

    // inssssserttttttttiooooon
    for(c = 1; c < n; c++){
        aux = c;
        if(arrIns[c] < arrIns[c-1]){
            while(aux > 0 && arrIns[aux] < arrIns[aux-1]){
                temp = arrIns[aux];
                arrIns[aux] = arrIns[aux-1];
                arrIns[aux-1] = temp;  
                countIns++;
                aux--;
            }
        }
    }
    printf("Insertion: ");
    for(c = 0; c < n; c++) printf("%d ", arrIns[c]);
    printf("\n");

    // sellllllleeeeectttttiiiiiioooon
    for(c = 0; c < n; c++){
        min = c;
        for(j = c+1; j < n; j++){
            if(arrSel[j] < arrSel[min]) min = j;
        }
        if(arrSel[min] != arrSel[c]){
            countSel++;
            aux = arrSel[min];
            arrSel[min] = arrSel[c];
            arrSel[c] = aux;
        }
    }
    printf("Selection: ");
    for(c = 0; c < n; c++) printf("%d ", arrSel[c]);
    printf("\n");

    printf("%d\n", countIns - countSel);
}