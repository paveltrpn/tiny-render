
#ifndef __bitmap_h__
#define __bitmap_h__

#include <stdint.h>

typedef struct bitmap_s {
    uint8_t *data;
    int32_t width;
    int32_t height;
    uint8_t depth;
} bitmap_s;

int bitmapWriteJpeg(const char* fname, uint8_t* data, int wdt, int hdt, int dpth);

#endif
