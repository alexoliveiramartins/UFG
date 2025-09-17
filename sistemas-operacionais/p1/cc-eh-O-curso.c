#include <sys/types.h>
#include <stdio.h>
#include <unistd.h>
#include <signal.h>
#include <stdlib.h>

#define N 3
// um pipe pra cada filho
int fd[N][2];

volatile sig_atomic_t sig_received = 0;

void handler(int sig) {
    sig_received = 1;
}

int main(){
    pid_t pid;
    pid_t filhos[3];

    for(int i = 0; i < N; i++){
        if(pipe(fd[i]) == -1) exit(1);
    }

    signal(SIGINT, handler);

    printf("Criado processo pai, pid: %d. pressione ctrl c para notificar processos filhos\n", getpid());

    for(int i = 0; i < N; i++){
        pid = fork();

        // erro
        if(pid < 0){
            return 1;
        }
        //filho
        else if(pid == 0){
            signal(SIGINT, SIG_IGN);
            printf("Criado processo filho (%d) numero %d\n", getpid(), i);
            char buf;

            while(1){
                read(fd[i][0], &buf, 1);
                printf("Filho %d, PID %d, recebeu aviso do pai\n", i+1, getpid());
                fflush(stdout);
            }
            return 0;
        }
        // pai
        else {
            filhos[i] = pid;
        }
    }

    while(1){
        pause();
        sig_received = 0;
        printf("processo pai recebeu o sinal, notificando processos filhos...\n");

        char msg = 'a';
        for (int i = 0; i < N; i++) write(fd[i][1], &msg, 1);
    }

    return 0;
}