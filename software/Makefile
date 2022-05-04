PKG_SDL_INCDIR = ../extern/SDL/include
PKG_SDL_LIBDIR = ../extern/SDL/build/src

CC       = cc
CFLAGS   = -Wall 
LFLAGS 	 = -lm -lSDL2

INCDIR	 = 	$(PKG_SDL_INCDIR)
LIBDIR	 = $(PKG_GLFW_LIBDIR)

VPATH = . ../algebra_c $(PKG_SDL_SRCDIR)

SRCS = alg_common.c vec2.c vec3.c vec4.c mtrx3.c mtrx4.c main.c

OBJS = $(patsubst %.c, build/%.o,$(SRCS))

#OBJS := $(SRCS:.cpp=.o)

.PHONY: clean all

all: $(OBJS) main

build/alg_common.o: alg_common.c
	$(CC) $(CFLAGS) $(addprefix -I,$(INCDIR)) -c $< -o $@

build/vec2.o: vec2.c
	$(CC) $(CFLAGS) $(addprefix -I,$(INCDIR)) -c $< -o $@

build/vec3.o: vec3.c
	$(CC) $(CFLAGS) $(addprefix -I,$(INCDIR)) -c $< -o $@

build/vec4.o: vec4.c
	$(CC) $(CFLAGS) $(addprefix -I,$(INCDIR)) -c $< -o $@

build/mtrx3.o: mtrx3.c
	$(CC) $(CFLAGS) $(addprefix -I,$(INCDIR)) -c $< -o $@

build/mtrx4.o: mtrx4.c
	$(CC) $(CFLAGS) $(addprefix -I,$(INCDIR)) -c $< -o $@

build/main.o: main.c
	$(CC) $(CFLAGS) $(addprefix -I,$(INCDIR)) -c $< -o $@

main: $(OBJS)
	$(CC) $(OBJS) $(addprefix -L,$(LIBDIR)) -o main $(LFLAGS)

clean:
	rm -f build/*.o main