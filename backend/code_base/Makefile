CC = gcc
CFLAGS = -Iinclude -Wall
DEPS = include/data.h include/frame.h include/packet.h include/segment.h
OBJDIR = obj
BINDIR = bin
UPDIR = uploads
OBJ = $(OBJDIR)/layers/data.o $(OBJDIR)/layers/frame.o $(OBJDIR)/layers/packet.o $(OBJDIR)/layers/segment.o $(OBJDIR)/receiver.o $(OBJDIR)/sender.o
EXECUTABLES = $(BINDIR)/receiver $(BINDIR)/sender

all: directories $(EXECUTABLES)

directories: $(OBJDIR) $(BINDIR) $(OBJDIR)/layers $(UPDIR)

$(OBJDIR):
	mkdir -p $(OBJDIR)

$(BINDIR):
	mkdir -p $(BINDIR)

$(OBJDIR)/layers:
	mkdir -p $(OBJDIR)/layers

$(UPDIR):
	mkdir -p $(UPDIR)

$(OBJDIR)/layers/%.o: src/layers/%.c $(DEPS)
	[ -f $(UPDIR)/$*.o ] && cp $(UPDIR)/$*.o $@ || $(CC) -c -o $@ $< $(CFLAGS)

$(OBJDIR)/receiver.o: src/receiver.c $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

$(OBJDIR)/sender.o: src/sender.c $(DEPS)
	$(CC) -c -o $@ $< $(CFLAGS)

$(BINDIR)/receiver: $(OBJDIR)/receiver.o $(OBJDIR)/layers/data.o $(OBJDIR)/layers/frame.o $(OBJDIR)/layers/packet.o $(OBJDIR)/layers/segment.o
	$(CC) -o $@ $^ $(CFLAGS)

$(BINDIR)/sender: $(OBJDIR)/sender.o $(OBJDIR)/layers/data.o $(OBJDIR)/layers/frame.o $(OBJDIR)/layers/packet.o $(OBJDIR)/layers/segment.o
	$(CC) -o $@ $^ $(CFLAGS)

.PHONY: clean all

clean:
	rm -rf $(OBJDIR) *~ core $(INCDIR)/*~
	rm -rf $(BINDIR)
