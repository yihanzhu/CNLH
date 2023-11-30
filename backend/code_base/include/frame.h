
#include <net/ethernet.h>
#include "packet.h"

#define FRAME_SIZE 1300

typedef struct tagEthHeader {
    char        dmac[6];
    char        smac[6];
    uint16_t       ether_type;
} EthHeader;

typedef struct tagFrame {
    // struct ether_header header; // <net/ethernet.h>
	// struct ether_header eth;
    EthHeader eth;
	Packet *packet;
} Frame;

void create_frame(const Packet *packet, Frame *frame);