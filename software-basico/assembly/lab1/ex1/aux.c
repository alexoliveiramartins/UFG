char str[] = "BEBAMUITOCAFE";

void process()
{
   char *ptr = str;
   while (*ptr) {
      // Seu código aqui...
        *ptr += 32;
        ptr++;
   }
}