#define DATA_SIZE 1000
#define BUF_SIZE 1100

typedef struct tagData {
	char *filename;
	char filedata[DATA_SIZE];
} Data;

void create_data(const char *file, Data *data);
void data_to_string(const Data *data, char *str);
void string_to_data(const char *str, Data *data);