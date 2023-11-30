#include "frame.h"

void create_frame(const Packet *packet, Frame *frame) {

    // memset(frame, 0, FRAME_SIZE);

    // // Data Link Layer for Sender - MAC header
    // struct ether_header *eth = (struct ether_header *) frame;

    // // packet part
    // char *data = (char *) (frame + sizeof(struct ether_header));
    // memcpy(data, packet, PACKET_SIZE);

    // printf("%s: %s\n", __func__, data+sizeof (struct udphdr)+sizeof(struct iphdr));

    frame->packet = packet;

    // char *smac = "00:30:bd:26:70:7f", *dmac = "00:09:5b:56:5f:8b";
    // const char dmac[] = {0x00, 0x30, 0xbd, 0x26, 0x70, 0x7f};
    // const char smac[] = {0x00, 0x09, 0x5b, 0x56, 0x5f, 0x8b};
    // memcpy(frame->eth.ether_dhost, dmac, ETHER_ADDR_LEN);
    // memcpy(frame->eth.ether_shost, smac, ETHER_ADDR_LEN);
    const char dmac[] = {0x00, 0x30, 0x2d, 0x26, 0x70, 0x7f};
    memcpy(frame->eth.dmac, dmac, sizeof(dmac));
    const char smac[] = {0x00, 0x09, 0x5b, 0x56, 0x5f, 0x8b};
    memcpy(frame->eth.smac, smac, sizeof(smac));
    // frame->eth.dmac = dmac;
    // frame->eth.smac = smac;
    frame->eth.ether_type = htons(ETH_P_IP);
    // printf("%s:%x:%x:%x:%x:%x:%x\n", __func__, frame->eth.dmac[0], frame->eth.dmac[1], frame->eth.dmac[2], frame->eth.dmac[3], frame->eth.dmac[4], frame->eth.dmac[5]);

    // printf("%s:%x:%x:%x:%x:%x:%x\n", __func__, eth->ether_dhost[0], eth->ether_dhost[1], eth->ether_dhost[2], eth->ether_dhost[3], eth->ether_dhost[4], eth->ether_dhost[5]);
    // printf("%s:%x:%x:%x:%x:%x:%x\n", __func__, eth->ether_shost[0], eth->ether_shost[1], eth->ether_shost[2], eth->ether_shost[3], eth->ether_shost[4], eth->ether_shost[5]);

    // printf("%s: %s\n", __func__, data+sizeof (struct udphdr)+sizeof(struct iphdr));

    // Frame frame;
    // frame.packet = packet;
    // frame.header.smac = smac;
    // frame.header.dmac = dmac;
    // frame.header.ether_type = htons(ETH_P_IP);

    // printf("checkpoint 4: %s\n", frame.packet->segment->data->filedata);
    // printf("checkpoint 5: %s\n", frame.header.smac);

    // struct ether_addr *source, *dest;
    // source = ether_aton(smac);
    // dest = ether_aton(dmac);
    // bcopy(source->ether_addr_octet, frame.header.ether_shost, ETH_ALEN);
    // bcopy(dest->ether_addr_octet, frame.header.ether_dhost, ETH_ALEN);

    // return frame;
}