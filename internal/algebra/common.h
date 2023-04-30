#pragma once

#include <cmath>
#include <cstdint>
#include <numbers>
#include <tuple>

#define M_PI 3.14159265358979323846

constexpr float f_eps = 5.96e-08;
constexpr float degToRad(float deg) {
    return deg * M_PI / 180.0f;
}

/*	multidimensional array mapping, array[i][j]
    row-wise (C, C++):
    (0	1)
    (2	3)

    column-wise (Fortran, Matlab):
    (0	2)
    (1	3)
*/

constexpr int32_t idRw(int32_t i, int32_t j, int32_t n) {
    return (i * n + j);
};

constexpr int32_t idCw(int32_t i, int32_t j, int32_t n) {
    return (j * n + i);
};
