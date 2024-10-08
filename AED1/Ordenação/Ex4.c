#include <stdio.h>
#include <string.h>

typedef struct
{
    char name[100];
    int grade;
} Aluno;

int main(){
    int c, i, n, auxC, min, j; scanf("%d", &n);
    Aluno aux;
    Aluno alunos[n];

    for(c = 0; c < n; c++){
        scanf("%s %d", alunos[c].name, &alunos[c].grade);
    }
    for(c = 0; c < n-1; c++){
        for(j = 0; j < n-1; j++){
            if(alunos[j].grade < alunos[j+1].grade){  
                aux = alunos[j];
                alunos[j] = alunos[j+1];
                alunos[j+1] = aux;
            }
        }
    }
    for(c = 0; c < n-1; c++){
        for(j = 0; j < n-1; j++){
            if(strcmp(alunos[j].name, alunos[j+1].name) >= 0 && alunos[j].grade == alunos[j+1].grade){
                aux = alunos[j];
                alunos[j] = alunos[j+1];
                alunos[j+1] = aux;
            }
        }
    }
    printf("\n");
    for(c = 0; c < n; c++){
        if(c != n-1) printf("%s %d\n", alunos[c].name, alunos[c].grade);
        else printf("%s %d #reprovado(a)\n", alunos[c].name, alunos[c].grade);
    }
}