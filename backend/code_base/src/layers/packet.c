#include "packet.h"

void create_packet(const Segment *segment, Packet *packet){

    // memset(packet, 0, PACKET_SIZE);

    // // Network Layer for Sender - IP header
    // struct iphdr *iph = (struct iphdr *) packet;

    // // segment part
    // char *data = (char *) (packet + sizeof(struct iphdr));
    // memcpy(data, segment, SEG_SIZE);

    // printf("%s: %d\n", __func__, strlen(data+sizeof (struct udphdr)));

    packet->segment = segment;
    //Fill in the IP Header
    packet->iph.ihl = 5;
    packet->iph.version = 4;
    packet->iph.tos = 0;
    packet->iph.tot_len = sizeof (struct iphdr) + sizeof (struct udphdr) + sizeof(segment->data);
    packet->iph.id = htonl(54321); //Id of this packet
    packet->iph.frag_off = 0;
    packet->iph.ttl = 255;
    packet->iph.protocol = IPPROTO_UDP;
    packet->iph.check = 0;      //Set to 0 before calculating checksum
    packet->iph.saddr = inet_addr("192.168.1.2");    //Spoof the source ip address
    packet->iph.daddr = inet_addr("192.168.1.1");

    // printf("%s: %s\n", __func__, packet + sizeof(struct iphdr)+4*sizeof(uint16_t));

    // Packet packet;
    // packet.segment = seg;
    // packet.header.version = 4;
    // packet.header.ihl = 5;
    // packet.header.tos = 0;
    // packet.header.tot_len = sizeof(packet.header);
    // packet.header.id = 0;
    // packet.header.frag_off = 0;
    // packet.header.ttl = 0;
    // packet.header.protocol = 0;
    // packet.header.check = 0;
    // packet.header.saddr = 100;
    // packet.header.daddr = 200;

    // // printf("checkpoint 3: %s\n", packet.segment->data->filedata);
    // return packet;
}