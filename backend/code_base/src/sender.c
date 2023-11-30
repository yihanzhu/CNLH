#include <stdio.h>
#include <string.h>
#include <netinet/ether.h>
#include <sys/ipc.h>
#include <sys/shm.h>

#include "frame.h"


void send_file(const char *file, Data* data, Segment *segment, Packet *packet, Frame *frame){

    // char data[DATA_SIZE];
    // char segment[SEG_SIZE];
    // char packet[PACKET_SIZE];

    // // Application Layer for Sender
    // create_data(file, data);

    // // Transport Layer for Sender - TCP/UDP header
    // create_segment(data, segment);

    // // Network Layer for Sender - IP header
    // create_packet(segment, packet);

    // // Data Link Layer for Sender - MAC header
    // create_frame(packet, frame);

    // Frame frame;
    // Application Layer for Sender
    create_data(file, data);
    // printf("checkpoint 1: %s\n",data->filedata);

    // Transport Layer for Sender - TCP/UDP header
    create_segment(data, segment);
    // printf("checkpoint 2: %s\n",segment->data->filedata);

    // Network Layer for Sender - IP header
    create_packet(segment, packet);
    // printf("checkpoint 3: %s\n",packet->segment->data->filedata);

    // Data Link Layer for Sender - MAC header
    create_frame(packet, frame);
    // printf("checkpoint 4: %s\n",frame->packet->segment->data->filedata);

};

void frame_to_array(const Frame *frame, char *datagram){
    memset(datagram, 0, 4096);
    // Data Link Layer for Sender - MAC header
    EthHeader *eth = (EthHeader *) datagram;

    // Network Layer for Sender - IP header
    struct iphdr *iph = (struct iphdr *) (datagram + sizeof(EthHeader));

    // Transport Layer for Sender - UDP header
    struct udphdr *udph = (struct udphdr *) (datagram + sizeof(EthHeader) + sizeof(struct iphdr));

    //Data part
    char *data = (char *) (datagram + sizeof(EthHeader) + sizeof(struct iphdr) + sizeof(struct udphdr));

    // memcpy(data, buf, DATA_SIZE);
    const char dmac[] = {0x00, 0x30, 0x2d, 0x26, 0x70, 0x7f};
    memcpy(eth->dmac, frame->eth.dmac, sizeof(dmac));

    // printf("%s:%x:%x:%x:%x:%x:%x\n", __func__, eth->dmac[0], eth->dmac[1], eth->dmac[2], eth->dmac[3], eth->dmac[4], eth->dmac[5]);
    // printf("%s:%x:%x:%x:%x:%x:%x\n", __func__, eth->ether_shost[0], eth->ether_shost[1], eth->ether_shost[2], eth->ether_shost[3], eth->ether_shost[4], eth->ether_shost[5]);

    // assign value to ethernet header
    // eth->dmac = frame->eth.dmac;
    // eth->smac = frame->eth.smac;
    eth->ether_type = frame->eth.ether_type;
    // char *dmac = "00:09:5b:56:5f:8b";
    // if (strcmp(eth->dmac, dmac) == 0) {
    //     printf("%s: This is the frame\n", __func__);
    // }

    // assign value to ip header
    iph->ihl = frame->packet->iph.ihl;
    iph->version = frame->packet->iph.version;
    iph->tos = frame->packet->iph.tos;
    iph->tot_len = frame->packet->iph.tot_len;
    iph->id = frame->packet->iph.id;
    iph->frag_off = frame->packet->iph.frag_off;
    iph->ttl = frame->packet->iph.ttl;
    iph->protocol = frame->packet->iph.protocol;
    iph->check = frame->packet->iph.check;
    iph->saddr = frame->packet->iph.saddr;
    iph->daddr = frame->packet->iph.daddr;

    // assign value to udp header
    udph->source = frame->packet->segment->udph.source;
    udph->dest = frame->packet->segment->udph.dest;
    udph->len = frame->packet->segment->udph.len;
    udph->check = frame->packet->segment->udph.check;

    // assign value to data
    memcpy(data, frame->packet->segment->data->filedata, DATA_SIZE);
}

int main(int argc, char const *argv[])
{
    char *file = "./src/test.txt";
    char datagram[4096];
    Data *data = (Data *)malloc(sizeof(Data));
    Segment *segment = (Segment *)malloc(sizeof(Segment));
    Packet *packet = (Packet *)malloc(sizeof(Packet));
    Frame *frame = (Frame *)malloc(sizeof(Frame));
    char message [DATA_SIZE];

    send_file(file, data, segment, packet, frame);
    // printf("%s: Sending message - '%s'\n", __func__, frame->packet->segment->data->filedata);

    // convert frame to array to store in shared memory
    frame_to_array(frame, datagram);

    printf("%s: Sending message - %s\n", __func__, datagram + sizeof(EthHeader) + sizeof(struct iphdr) + sizeof(struct udphdr));

    free(data);
    free(segment);
    free(packet);
    free(frame);

    // copy to shared memory
    // ftok to generate unique key
    key_t key = ftok("shmfile",65);

    // shmget returns an identifier in shmid
    int shmid = shmget(key,4096,0666|IPC_CREAT);

    // shmat to attach to shared memory
    char *str = (char*) shmat(shmid,(void*)0,0);

    memcpy(str, datagram, 4096);
    // gets(str);

    printf("Data written in memory: %s\n",str + sizeof(EthHeader) + sizeof(struct iphdr) + sizeof(struct udphdr));

    //detach from shared memory
    shmdt(str);

    // // destroy the shared memory
    // shmctl(shmid,IPC_RMID,NULL);
    return 0;
}
