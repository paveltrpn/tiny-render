
#ifndef __sf_canvas_h__
#define __sf_canvas_h__

#include <stdint.h>

typedef struct canvas_s {
    uint8_t *data;

    int32_t width;
    int32_t height;

    uint8_t depth;

    int32_t pen_size;

    uint8_t pen_color_r;
    uint8_t pen_color_g;
    uint8_t pen_color_b;
} canvas_s;


void canvasMake(canvas_s *cnvs, int wdt, int hgt, int bpp);
void canvasFree(canvas_s *cnvs);

#endif