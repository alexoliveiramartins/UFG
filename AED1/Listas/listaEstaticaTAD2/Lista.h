typedef struct 
{
    int array[100];
    int size;
    int elementsNumber;
} Lista;

Lista createList(int size);
void addElement(Lista * lista, int element);
void removeElement(Lista * lista, int pos);
void printList();