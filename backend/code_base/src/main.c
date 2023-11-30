#include <stdio.h>
#include <string.h>
#include <netinet/ether.h>

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

void receive_file(const Frame *frame, char *message) {
    char *dmac = "00:09:5b:56:5f:8b";
    // const char smac[] = {0x00, 0x09, 0x5b, 0x56, 0x5f, 0x8b};
    if (strcmp(frame->eth.dmac, dmac) == 0) {
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


int main(int argc, char const *argv[])
{
    char *file = "./src/test.txt";
    // char datagram[4096];
    Data *data = (Data *)malloc(sizeof(Data));
    Segment *segment = (Segment *)malloc(sizeof(Segment));
    Packet *packet = (Packet *)malloc(sizeof(Packet));
    Frame *frame = (Frame *)malloc(sizeof(Frame));
    char message [DATA_SIZE];

    send_file(file, data, segment, packet, frame);
    printf("%s: Sending message - '%s'\n", __func__, frame->packet->segment->data->filedata);

    // convert frame to array to store in shared memory
    // printf("%s: %s\n", __func__, datagram+sizeof (struct udphdr)+sizeof(struct iphdr)+sizeof(struct ether_header));

    receive_file(frame, &message);
    printf("%s: Receiving message - '%s'\n", __func__, message);

    free(data);
    free(segment);
    free(packet);
    free(frame);
    return 0;
}
