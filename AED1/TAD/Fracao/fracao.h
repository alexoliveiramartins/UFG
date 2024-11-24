typedef struct {
    int num, den;
} fracao_t;

fracao_t *criar(int num, int den);
void imprimir(fracao_t *f);
void destruir(fracao_t *f);
fracao_t *somar(fracao_t *f1, fracao_t *f2);


