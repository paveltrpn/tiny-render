# tiny-render

- **SDL2** (git clone https://github.com/libsdl-org/SDL; sudo apt-get install libsdl2-dev)  
- **libjpeg** (git clone https://github.com/stohrendorf/libjpeg-cmake)
- **libtga** (git clone https://github.com/madebr/libtga) В ней нужно заменить 4-ре вхождения функции bzero() на memset(ptr, value, size) в *.c файлах  
