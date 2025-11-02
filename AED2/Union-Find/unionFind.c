int unionFindVector[100];

void makeSet(int i){
    unionFindVector[i] = i;
}

int findSet(int i){
    return unionFindVector[i];
}

int Union(int x, int y){
    for(int i = 0; i < 100; i++){
        if(unionFindVector[i] == y){
            unionFindVector[i] = x;
        }
    }
}
