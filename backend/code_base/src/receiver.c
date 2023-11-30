#include <stdio.h>
#include <string.h>
#include <netinet/ether.h>
#include <sys/ipc.h>
#include <sys/shm.h>

#include "frame.h"


void receive_file(const Frame *frame, char *message) {
    // printf("%s:%x:%x:%x:%x:%x:%x\n", __func__, frame->eth.dmac[0], frame->eth.dmac[1], frame->eth.dmac[2], frame->eth.dmac[3], frame->eth.dmac[4], frame->eth.dmac[5]);
    const char dmac[] = {0x00, 0x30, 0x2d, 0x26, 0x70, 0x7f};
    if (memcmp(frame->eth.dmac, dmac, sizeof(dmac)) == 0) {
        printf("%s: This is my frame\n", __func__);
        Data *data;
        Segment *segment;
        Packet *packet;

        packet = frame->packet;
        segment = packet->segment;
        data = segment->data;

        strcpy(message, data->filedata);
        // puts(message);
    }
    else {
        printf("%s: This is not my frame\n", __func__);
    }
};

void array_to_frame(const char *datagram, Frame *frame){
    // Data Link Layer for Sender - MAC header
    EthHeader *eth = (EthHeader *) datagram;

    // Network Layer for Sender - IP header
    struct iphdr *iph = (struct iphdr *) (datagram + sizeof(EthHeader));

    // Transport Layer for Sender - UDP header
    struct udphdr *udph = (struct udphdr *) (datagram + sizeof(EthHeader) + sizeof(struct iphdr));

    //Data part
    char *data = (char *) (datagram + sizeof(EthHeader) + sizeof(struct iphdr) + sizeof(struct udphdr));

    frame->eth = *eth;
    // frame->packet = iph;
    // frame->packet->iph = *iph;
    // frame->packet->segment = udph;
    // frame->packet->segment->udph = *udph;
    // frame->packet->segment->data = data;
    // frame->packet->iph.tot_len = iph->tot_len;

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

    frame->packet = packet;
    packet->segment = segment;
    segment->data = data;

    // ftok to generate unique key
    key_t key = ftok("shmfile",65);

    // shmget returns an identifier in shmid
    int shmid = shmget(key,4096,0666|IPC_CREAT);

    // shmat to attach to shared memory
    char *str = (char*) shmat(shmid,(void*)0,0);

    memset(datagram, 0, 4096);
    memcpy(datagram, str, 4096);

    // printf("Data read from memory: %s\n",datagram + sizeof(EthHeader) + sizeof(struct iphdr) + sizeof(struct udphdr));

    // convert array in shared memory to frame
    array_to_frame(datagram, frame);

    receive_file(frame, &message);
    printf("%s: Receiving message - %s\n", __func__, datagram + sizeof(EthHeader) + sizeof(struct iphdr) + sizeof(struct udphdr));

    // printf("%s: Receiving message - '%s'\n", __func__, message);

    free(data);
    free(segment);
    free(packet);
    free(frame);

    //detach from shared memory
    shmdt(str);

    // destroy the shared memory
    shmctl(shmid,IPC_RMID,NULL);
    return 0;
}
