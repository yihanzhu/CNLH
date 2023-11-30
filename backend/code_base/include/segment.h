#include <netinet/udp.h>
#include <netinet/tcp.h>
#include <netinet/in.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <arpa/inet.h>
#include "data.h"

#define SEG_SIZE 1100

struct pseudo_header
{
    u_int32_t source_address;
    u_int32_t dest_address;
    u_int8_t placeholder;
    u_int8_t protocol;
    u_int16_t udp_length;
};

typedef struct tagSegment {
	struct udphdr udph;
    Data *data;
} Segment;

unsigned short csum(unsigned short *ptr,int nbytes);
void create_segment(const Data *data, Segment *segment);