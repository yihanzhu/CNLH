#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <regex.h>
#include "data.h"

void create_data(const char *file, Data *data){

    FILE *fp;
    if((fp = fopen(file, "r")) == NULL) {
        fprintf(stderr, "Can't open file %s\n", file);
        exit(1);
    }

    // Data data;
    data->filename = file;
    fread((void*)data->filedata, sizeof(char), DATA_SIZE, fp);

    // data_to_string(&data, buf);
};

void data_to_string(const Data *data, char *str) {
    // Initialize string buffer
    memset(str, 0, DATA_SIZE);

    // Load data into string
    int cursor = 0;
    sprintf(str, "%s", data->filename);

    cursor = strlen(str);
    memcpy(str + cursor, ":", sizeof(char));
    ++cursor;

    memcpy(str + cursor, data->filedata, sizeof(char) * DATA_SIZE);

    // printf("'%s'\n", str);
};

void string_to_data(const char *str, Data *data) {
    // Compile Regex to match ":"
    regex_t regex;
    if(regcomp(&regex, "[:]", REG_EXTENDED)) {
        fprintf(stderr, "Could not compile regex\n");
    }
    // Match regex to find ":"
    regmatch_t pmatch[1];
    int cursor = 0;
    char buf[DATA_SIZE];
    // Match filename
    if(regexec(&regex, str + cursor, 1, pmatch, REG_NOTBOL)) {
        fprintf(stderr, "Error matching regex\n");
        exit(1);
    }
    memset(buf, 0, DATA_SIZE * sizeof(char));
    memcpy(buf, str + cursor, pmatch[0].rm_so);
    data->filename = buf;
    cursor += (pmatch[0].rm_so + 1);

    // Match filedata
    memcpy(data->filedata, str + cursor, sizeof(char) * DATA_SIZE);

    // printf("%s:\n %s:\n %s",__func__, data->filename, data->filedata);
};