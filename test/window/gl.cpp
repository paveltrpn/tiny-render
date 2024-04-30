
#include <iostream>
#include <format>
#include <print>
#include <memory>
#include <filesystem>

#include "subject.h"

#include "render/Render.h"
#include "render/RenderGL.h"
#include "config/Config.h"
#include "geometry/Point.h"
#include "geometry/Node.h"

#include "spdlog/spdlog.h"

int main(int argc, char **argv) {
    tire::Config config;
    try {
        config = tire::Config{ std::filesystem::path{ "../test/window/config.json" } };
    } catch (const std::exception &e) {
        spdlog::critical("caught exception: {}", e.what());
        return 0;
    }

    auto renderType = config.getString("render_type");

    std::unique_ptr<tire::Render> rndr;
    rndr = std::make_unique<tire::RenderGL>(config);

    rndr->displayRenderInfo();

    initSubject(rndr.get());

    rndr->run();

    return 0;
}
