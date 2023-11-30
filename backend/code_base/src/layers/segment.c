#include "segment.h"

// /*
//     Generic checksum calculation function
// */
// unsigned short csum(unsigned short *ptr,int nbytes) {
//     register long sum;
//     unsigned short oddbyte;
//     register short answer;

//     sum=0;
//     while(nbytes>1) {
//         sum+=*ptr++;
//         nbytes-=2;
//     }
//     if(nbytes==1) {
//         oddbyte=0;
//         *((u_char*)&oddbyte)=*(u_char*)ptr;
//         sum+=oddbyte;
//     }

//     sum = (sum>>16)+(sum & 0xffff);
//     sum = sum + (sum>>16);
//     answer=(short)~sum;

//     return(answer);
// };

void create_segment(const Data *data, Segment *segment){

    // memset(segment, 0, SEG_SIZE);

    // // Transport Layer for Sender - UDP header
    // struct udphdr *udph = (struct udphdr *) (segment);

    // //Data part
    // char *data = (char *) (segment + sizeof(struct udphdr));
    // memcpy(data, buf, DATA_SIZE);

    // printf("%s: %ld\n", __func__, strlen(data));

    segment->data = data;
    //UDP header
    segment->udph.source = htons(6666);
    segment->udph.dest = htons(8622);
    segment->udph.len = htons(sizeof(struct udphdr) + sizeof(data)); //tcp header size
    segment->udph.check = 0; //leave checksum 0 now, filled later by pseudo header

    // printf("%s: %s\n", __func__, segment+4*sizeof(uint16_t));

    // // check for segment values
    // printf("%s: %d\n", __func__, ntohs(udph->source));
    // printf("%s: %d\n", __func__, ntohs(udph->dest));
    // printf("%s: %d\n", __func__, ntohs(udph->len));
    // printf("%s: %d\n", __func__, udph->check);

    // struct pseudo_header psh;
    // char source_ip[32], dest_ip[32], *pseudogram;
    // //some address resolution
    // strcpy(source_ip , "192.168.1.2");
    // strcpy(dest_ip , "192.168.1.1");
    // //Now the UDP checksum using the pseudo header
    // psh.source_address = inet_addr(source_ip);
    // psh.dest_address = inet_addr(dest_ip);
    // psh.placeholder = 0;
    // psh.protocol = IPPROTO_UDP;
    // psh.udp_length = htons(sizeof(struct udphdr) + strlen(data));

    // int psize = sizeof(struct pseudo_header) + sizeof(struct udphdr) + strlen(data);
    // pseudogram = malloc(psize);

    // memcpy(pseudogram , (char*) &psh , sizeof (struct pseudo_header));
    // memcpy(pseudogram + sizeof(struct pseudo_header) , udph , sizeof(struct udphdr) + strlen(buf));

    // udph->check = csum( (unsigned short*) pseudogram , psize);

    // Data data;
    // string_to_data(buf, &data);

    // // header
    // Segment seg;
    // seg.data = data;
    // seg.header.source = htons(6666);
    // seg.header.dest = htons(8888);
    // seg.header.len = htons(8 + strlen(buf));
    // seg.header.check = 0;




};