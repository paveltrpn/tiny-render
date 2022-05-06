
#include <stdio.h>
#include <stdbool.h>
#include "SDL.h"

bool is_run = true;

typedef struct sf_appState_s {
    SDL_Window* window;
    SDL_Renderer* renderer;

    int wnd_width;
    int wnd_height;

    bool is_run;
} sf_appState_s;

/** 
 * Init global application state
 * @param state Global application state instance. Pretend to be singlton
*/
void sf_initAppSate(sf_appState_s *sate) {

}

void sf_destroyAppSate(sf_appState_s *sate) {

}

int main(int argc, char** argv) {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
		printf("Couldn't initialize SDL: %s\n", SDL_GetError());
		exit(1);
	}

    SDL_Window* window;
    window = SDL_CreateWindow("Software", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, 512, 512, SDL_WINDOW_SHOWN);
	if (!window)	{
		printf("Failed to open window: %s\n", SDL_GetError());
		exit(1);
	}

	// SDL_SetHint(SDL_HINT_RENDER_SCALE_QUALITY, "linear");

    SDL_Renderer* renderer;
	renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_SOFTWARE);

	if (!renderer) {
		printf("Failed to create renderer: %s\n", SDL_GetError());
		exit(1);
	}

    SDL_Event event;
    while (is_run)
	{
		SDL_SetRenderDrawColor(renderer, 96, 128, 255, 255);
	    SDL_RenderClear(renderer);

	    while (SDL_PollEvent(&event)) {
			switch(event.type) { 
				case SDL_QUIT: 
					is_run = false;
					break;

				case SDL_KEYDOWN: 
					switch(event.key.keysym.sym) {
						case SDLK_ESCAPE: 
						is_run = false; 
						break;
					}
				break;
			}
		}

		SDL_RenderPresent(renderer);
	}

    return 0;
}