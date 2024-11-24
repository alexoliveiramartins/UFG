principal: principal.o fracao.o
	gcc -o principal principal.o fracao.o

principal.o: principal.c fracao.h
	gcc -c principal.c

fracao.o: fracao.c fracao.h
	gcc -c fracao.c

clean:
	rm *.o principal