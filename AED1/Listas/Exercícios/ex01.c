#include <stdio.h>
#define N 50

typedef struct{int Hrch, Mch, c,Tch, Tat, dif;
              }Tempo;
typedef struct {Tempo item[N];
                int prim, ult;
                int qtd;
               }Fila_sus;
               
void inicia_fila(Fila_sus *f) {
  f->prim = 0;
  f->ult = f->prim;
  f->qtd = 0;
 }
 
 void ler_paciente(Tempo *p){
	scanf("%d %d %d",&p->Hrch, &p->Mch, &p->c); 
	getchar();
 }
 
 void enfileirar_paciente(Fila_sus *f,Tempo p){
	if(f->ult==N)
	  printf("A fila esta cheia\n");
	else{ f->item[f->ult] = p;
		  f->ult++;
		  f->qtd++;
		} 
 }

 
int main() { 
  Tempo t;
  Fila_sus fs;
  int qc;
  int  i, n, hr, tempo, min=0;
  inicia_fila(&fs);
  scanf("%d", &n);
  qc = 0;
  for(i=0;i<n;i++) {
	  ler_paciente(&t);
	  enfileirar_paciente(&fs, t);
	}
	i=0;
	hr = 7;
    tempo = hr*60+min;
   while(i<n){
    
	if((fs.item[i].Hrch*60+fs.item[i].Mch)>tempo)
	   { hr = fs.item[i].Hrch;
		 if((fs.item[i].Mch>0)&&(fs.item[i].Mch<30))
		    min = 30;
		   else if(fs.item[i].Mch>30){
		           hr++;
		           min=0;
		          }else min=0;
    	 tempo = hr*60+min;
    	}
    fs.item[i].Tat = tempo;
    fs.item[i].Tch = fs.item[i].Hrch*60+fs.item[i].Mch;
    fs.item[i].dif = fs.item[i].Tat-fs.item[i].Tch;
    if(fs.item[i].dif>fs.item[i].c)
       qc++;
    tempo = tempo+30;
    i++;
  }
  printf("%d\n", qc);
 return 0;
}