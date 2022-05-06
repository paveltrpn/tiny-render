
#include <stdio.h>
#include "canvas.h"

/** 
 * canvas_s struct "constructor". Set all fields of canvas_s structure
 * according to function parameters. Field *data fills with zero values.
 * This function always replace all fields of canvas_s with new values
 * even when *cnvs has been initialize earlier. 
 * @param cnvs poiner to canvas_s instance
*/
void canvasMake(canvas_s *cnvs, int wdt, int hgt, int bpp) {

}

/** 
 * canvas_s struct "destructor". Free allocated memory and set structure 
 * fields to zero. 
 * @param cnvs poiner to canvas_s instance
*/
void canvasFree(canvas_s *cnvs) {

}