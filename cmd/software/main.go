package main

import (
	"image"
	"image/jpeg"
	"os"
	"tiny-render-go/internal/service"

	"github.com/veandco/go-sdl2/sdl"
)

func loadImage(fname string) image.Image {
	imagefile, err := os.Open(fname)
	if err != nil {
		println(err)
		panic(0)
	}
	defer imagefile.Close()

	imageData, err := jpeg.Decode(imagefile)
	if err != nil {
		println(err)
		panic(0)
	}

	return imageData
}

func imageToRGB(img image.Image) []uint8 {
	sz := img.Bounds()
	raw := make([]uint8, (sz.Max.X-sz.Min.X)*(sz.Max.Y-sz.Min.Y)*3)
	idx := 0
	for y := sz.Min.Y; y < sz.Max.Y; y++ {
		for x := sz.Min.X; x < sz.Max.X; x++ {
			r, g, b, _ := img.At(x, y).RGBA()
			raw[idx], raw[idx+1], raw[idx+2] = uint8(r), uint8(g), uint8(b)
			idx += 3
		}
	}
	return raw
}

func main() {
	// imageData := loadImage("brick-wall.jpg")

	if err := sdl.Init(sdl.INIT_EVERYTHING); err != nil {
		panic(err)
	}
	defer sdl.Quit()

	window, err := sdl.CreateWindow("test", sdl.WINDOWPOS_UNDEFINED, sdl.WINDOWPOS_UNDEFINED,
		800, 600, sdl.WINDOW_SHOWN)
	if err != nil {
		panic(err)
	}
	defer window.Destroy()

	surface, err := window.GetSurface()

	if err != nil {
		panic(err)
	}
	surface.FillRect(nil, 100)

	cnvs, _ := service.BuildCanvas(512, 512, 3)
	cnvs.BrasenhamLine(10, 10, 512, 512)

	rect := sdl.Rect{0, 0, int32(cnvs.GetWidth()), int32(cnvs.GetHeight())}

	render, _ := sdl.CreateRenderer(window, -1, sdl.RENDERER_SOFTWARE)

	texture, _ := render.CreateTexture(sdl.PIXELFORMAT_RGB24,
		sdl.TEXTUREACCESS_TARGET, int32(cnvs.GetWidth()), int32(cnvs.GetHeight()))
	defer texture.Destroy()

	texture.Update(&rect, cnvs.GetDataPtr(), cnvs.GetWidth()*3)

	window.UpdateSurface()

	running := true
	for running {
		for event := sdl.PollEvent(); event != nil; event = sdl.PollEvent() {
			switch t := event.(type) {
			case *sdl.QuitEvent:
				println("Quit")
				running = false

			case *sdl.KeyboardEvent:
				if t.Keysym.Sym == sdl.K_ESCAPE {
					println("Quit")
					running = false
				}
			}
		}

		render.Copy(texture, nil, &rect)
		render.Present()
	}
}
