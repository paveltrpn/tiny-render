
#include <array>
#include <format>
#include <iostream>
#include <map>
#include <string>
#include <thread>

#define GLEW_STATIC
#include <GL/glew.h>
#include <GL/gl.h>
#include <GL/glu.h>
#include <GLFW/glfw3.h>

#include "apputils.h"
#include "camera.h"
#include "font_string.h"
#include "mesh.h"
#include "mtrx4.h"
#include "screen_text.h"
#include "timing.h"
#include "vec3.h"

GLFWwindow *g_appWindow;
GLFWmonitor *g_appMonitor;

std::string oglRenderString;
std::string oglVersionString;
std::string oglslVersionString;

CAppState g_AppState;
CPerspCamera g_textCamera;
CPerspLookAtCamera g_Camera;
CScreenText g_screenText;
std::map<std::string, BasicBody> g_BodyList;
CTime g_Timer;

//На расстоянии Х пикселей от границ окна находятся зоны, в которых курсор двигает
constexpr uint32_t c_moveZoneDst = 32;

//Скорости вращения и перемещения камеры при 60 fps
constexpr float c_cmrMoveSpd = 0.4f;
constexpr float c_cmrRotnSpd = 50.0f;

double g_curPositionX{};
double g_curPositionY{};

bool g_rightButtonClick{ false };

void windowInit() {
    g_AppState = CAppState();
    g_AppState.showCurrentAppState();

    if (glfwInit() != GLFW_TRUE) {
        std::cout << "windowInit(): glfwInit() return - GLFW_FALSE!"
                  << "\n";
        std::exit(1);
    }

    auto errorCallback
      = [](int, const char *err_str) { std::cout << "GLFW Error: " << err_str << std::endl; };
    glfwSetErrorCallback(errorCallback);

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 2);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 1);
    glfwWindowHint(GLFW_DOUBLEBUFFER, GL_TRUE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

    g_appWindow = glfwCreateWindow(g_AppState.appWindowWidth,
                                   g_AppState.appWindowHeight,
                                   g_AppState.appName.c_str(),
                                   nullptr,
                                   nullptr);
    if (g_appWindow == nullptr) {
        std::cout << "windowInit(): Failed to create GLFW window" << std::endl;
        glfwTerminate();
        std::exit(1);
    };

    glfwMakeContextCurrent(g_appWindow);

    glewExperimental = GL_TRUE;

    if (glewInit() != GLEW_OK) {
        std::cout << "windowInit(): Failed to initialize GLEW" << std::endl;
        std::exit(1);
    };

    // ВКЛ-ВЫКЛ вертикальную синхронизацию (VSYNC)
    // Лок на 60 фпс
    glfwSwapInterval(true);

    oglRenderString = (const char *)glGetString(GL_RENDERER);
    oglVersionString = (const char *)glGetString(GL_VERSION);
    oglslVersionString = (const char *)glGetString(GL_SHADING_LANGUAGE_VERSION);

    std::cout << std::format(
      "windowInit():\n  oglRenderString - {}\n  oglVersionString - {}\n  oglslVersionString - {}\n",
      oglRenderString,
      oglVersionString,
      oglslVersionString);
}

void registerGLFWCallbacks() {
    auto keyCallback = [](GLFWwindow *window, int key, int scancode, int action, int mods) {
        if (key == GLFW_KEY_ESCAPE) {
            glfwSetWindowShouldClose(window, GLFW_TRUE);
        }

        if (key == GLFW_KEY_Y && GLFW_PRESS) {
            g_Camera.setUpVec(vec3(0.0f, 1.0f, 0.0f));
        }

        if (key == GLFW_KEY_Z && GLFW_PRESS) {
            g_Camera.setUpVec(vec3(0.0f, 0.0f, 1.0f));
        }

        if (key == GLFW_KEY_X && GLFW_PRESS) {
            g_Camera.setUpVec(vec3(1.0f, 0.0f, 0.0f));
        }
    };
    glfwSetKeyCallback(g_appWindow, keyCallback);

    auto mouseButtonCallback = [](GLFWwindow *window, int button, int action, int mods) {
        if (button == GLFW_MOUSE_BUTTON_RIGHT && action == GLFW_RELEASE) {
            g_rightButtonClick = false;
        }

        if (button == GLFW_MOUSE_BUTTON_RIGHT && action == GLFW_PRESS) {
            g_rightButtonClick = true;
        }
    };
    glfwSetMouseButtonCallback(g_appWindow, mouseButtonCallback);

    auto cursorPosCallback = [](GLFWwindow *window, double posX, double posY) {
        // g_curPositionX = posX;
        // g_curPositionY = posY;
    };
    glfwSetCursorPosCallback(g_appWindow, cursorPosCallback);

    auto cursorEnterCallback = [](GLFWwindow *window, int entered) {
        if (entered) {
            // The cursor entered the content area of the window
        } else {
            // The cursor left the content area of the window
        }
    };
    glfwSetCursorEnterCallback(g_appWindow, cursorEnterCallback);
}

void appSetup() {
    windowInit();
    registerGLFWCallbacks();

    glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
    glClearDepth(1.0);
    glDepthFunc(GL_LESS);
    glEnable(GL_DEPTH_TEST);

    glColorMaterial(GL_FRONT_AND_BACK, GL_DIFFUSE);
    glEnable(GL_COLOR_MATERIAL);

    std::vector<vec4> ambient = { { 0.0f, 0.0f, 0.0f, 1.0f }, { 0.0f, 0.0f, 0.0f, 1.0f } };
    std::vector<vec4> diffuse = { { 1.0f, 1.0f, 1.0f, 1.0f }, { 0.3f, 0.3f, 0.3f, 1.0f } };
    std::vector<vec4> lightPosition
      = { { 5.0f, 10.0f, 5.0f, 1.0f }, { -35.0f, -5.0f, -20.0f, 1.0f } };
    glEnable(GL_LIGHTING);
    glShadeModel(GL_SMOOTH);
    glLightfv(GL_LIGHT0, GL_AMBIENT, &ambient[0][0]);
    glLightfv(GL_LIGHT0, GL_DIFFUSE, &diffuse[0][0]);
    glLightfv(GL_LIGHT0, GL_POSITION, &lightPosition[0][0]);

    glLightfv(GL_LIGHT1, GL_AMBIENT, &ambient[1][0]);
    glLightfv(GL_LIGHT1, GL_DIFFUSE, &diffuse[1][0]);
    glLightfv(GL_LIGHT1, GL_POSITION, &lightPosition[1][0]);

    g_Timer = CTime();

    g_Camera.setLookPoints({ 0.0f, 12.0f, 20.0f }, { 0.0f, 0.0f, 0.0f });
    g_Camera.setViewParameters(45.0f, g_AppState.appWindowAspect, 0.01f, 100.0f);

    g_textCamera.setCameraPosition({ 0.0f, 0.0f, -20.0f });
    g_textCamera.setViewParameters(45.0f, g_AppState.appWindowAspect, 0.01f, 100.0f);
    g_textCamera.updateViewMatrix();

    g_screenText.loadFromFile("../../../assets/img_fonts/RobotoMono-2048-1024-64-128.jpg");

    g_BodyList.insert({ "PRISM", BasicBody(BasicBody::PRISM, { 3.0f, 3.0f, 3.0f }) });
    g_BodyList.find("PRISM")->second.setOffset({ 2.0f, 0.0f, 3.2f });

    g_BodyList.insert({ "ICOSAHEDRON", BasicBody(BasicBody::ICOSAHEDRON, { 3.0f, 3.0f, 3.0f }) });
    g_BodyList.find("ICOSAHEDRON")->second.setOffset({ 2.0f, 0.0f, -3.2f });

    g_BodyList.insert({ "BOX", BasicBody(BasicBody::BOX, { 2.0f, 2.0f, 2.0f }) });
    g_BodyList.find("BOX")->second.setOffset({ -3.0f, 0.0f, 0.0f });

    g_BodyList.insert({ "FLOOR", BasicBody(BasicBody::BOX, { 10.0f, 0.2f, 10.0f }) });
    g_BodyList.find("FLOOR")->second.setOffset({ 0.0f, -2.7f, 0.0f });
}

void appLoop() {
    uint64_t frameBeginTime{};
    float v_frameTime{};
    uint32_t frameCount{}, v_fps{};
    CTimeDelay oneSecondDelay(1000);

    while (!glfwWindowShouldClose(g_appWindow)) {
        frameBeginTime = g_Timer.getMs();
        frameCount++;

        glfwGetCursorPos(g_appWindow, &g_curPositionX, &g_curPositionY);
        if (g_rightButtonClick) {
            if (g_curPositionX < c_moveZoneDst) {
                g_Camera.rotateEyeUp(-c_cmrRotnSpd);
            }

            if (g_curPositionX > (g_AppState.appWindowWidth - c_moveZoneDst)) {
                g_Camera.rotateEyeUp(c_cmrRotnSpd);
            }
        } else {
            if (g_curPositionX < c_moveZoneDst) {
                g_Camera.moveViewPointsSideway(-c_cmrMoveSpd);
            }

            if (g_curPositionX > (g_AppState.appWindowWidth - c_moveZoneDst)) {
                g_Camera.moveViewPointsSideway(c_cmrMoveSpd);
            }
        }

        if (g_curPositionY < c_moveZoneDst) {
            g_Camera.moveViewPointsForward(c_cmrMoveSpd);
        }

        if (g_curPositionY > (g_AppState.appWindowHeight - c_moveZoneDst)) {
            g_Camera.moveViewPointsForward(-c_cmrMoveSpd);
        }

        glfwPollEvents();

        // -----------------------------------------------------------
        // Отрисовка тел из BodyList
        // -----------------------------------------------------------

        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        glEnable(GL_DEPTH_TEST);
        glDisable(GL_BLEND);

        glMatrixMode(GL_PROJECTION);
        g_Camera.updateViewMatrix();
        glLoadMatrixf(g_Camera.getCmrMatrixPointer());

        glMatrixMode(GL_MODELVIEW);
        glLoadIdentity();

        glDisable(GL_TEXTURE_2D);
        glEnable(GL_LIGHTING);
        glEnable(GL_LIGHT0);
        glEnable(GL_LIGHT1);
        // glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

        for (auto &bdy : g_BodyList) {
            if (bdy.first == "BOX") {
                bdy.second.bodyRotate(0.5f, 0.0f, 0.0f);
            }

            if (bdy.first == "ICOSAHEDRON") {
                bdy.second.bodyRotate(0.0f, 0.5f, 0.0f);
            }

            if (bdy.first == "PRISM") {
                bdy.second.bodyRotate(0.0f, 0.0f, 0.5f);
            }
            bdy.second.updateAndDraw();
        };

        // -----------------------------------------------------------
        // Отрисовка текста
        // -----------------------------------------------------------

        glDisable(GL_LIGHTING);
        glDisable(GL_DEPTH_TEST);
        // glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
        glMatrixMode(GL_PROJECTION);
        glLoadMatrixf(g_textCamera.getCmrMatrixPointer());

        g_screenText.setTextPosition(-11.0f, 8.0f);
        g_screenText.drawString(std::format("frame time = {}", v_frameTime));

        g_screenText.setTextPosition(-11.0f, 7.3f);
        g_screenText.drawString(std::format("frames per second = {}", v_fps));

        g_screenText.setTextPosition(-11.0f, 6.6f);
        g_screenText.drawString(std::format(
          "pos X = {}, pos Y = {}", static_cast<float>(g_curPositionX), g_curPositionY));
        // -----------------------------------------------------------

        glfwSwapBuffers(g_appWindow);

        if (oneSecondDelay.isPassed()) {
            v_fps = frameCount;
            frameCount = 0;
            oneSecondDelay.reset();
        }

        v_frameTime = static_cast<float>(g_Timer.getMs() - frameBeginTime) / 1000.0f;
        frameBeginTime = 0;
    }
}

void appDefer() {
    glfwDestroyWindow(g_appWindow);
    glfwTerminate();
}

int main(int argc, char *argv[]) {
    appSetup();

    appLoop();

    appDefer();

    return 0;
}
