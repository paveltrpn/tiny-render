
#include <cmath>
#include <iostream>
#include <numbers>
#include <tuple>

#include "mtrx4.h"
#include "vec4.h"

using namespace std;

constexpr size_t mrange = 4;

mtrx4 mtrx4::operator*(mtrx4 &arg) {
    mtrx4 rt = { 0.0f };

    for (size_t i = 0; i < mrange; i++) {
        for (size_t j = 0; j < mrange; j++) {
            for (size_t k = 0; k < mrange; k++) {
                rt[idRw(i, j, mrange)] += (*this)[idRw(k, j, mrange)] * arg[idRw(i, k, mrange)];
            }
        }
    }

    return rt;
};

mtrx4 mtrx4FromIdtt() {
    mtrx4 rt;
    size_t i, j;

    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (i == j) {
                rt[idRw(i, j, 4)] = 1.0f;
            } else {
                rt[idRw(i, j, 4)] = 0.0f;
            }
        }
    }

    return rt;
}

mtrx4 mtrx4FromRtnYaw(float angl) {
    mtrx4 rt = mtrx4FromIdtt();
    float sa, ca;

    sincosf(degToRad(angl), &sa, &ca);

    rt[5] = ca;
    rt[6] = -sa;
    rt[9] = sa;
    rt[10] = ca;

    return rt;
}

mtrx4 mtrx4FromRtnPitch(float angl) {
    mtrx4 rt = mtrx4FromIdtt();
    float sa, ca;

    sincosf(degToRad(angl), &sa, &ca);

    rt[0] = ca;
    rt[2] = sa;
    rt[8] = -sa;
    rt[10] = ca;

    return rt;
}

mtrx4 mtrx4FromRtnRoll(float angl) {
    mtrx4 rt = mtrx4FromIdtt();
    float sa, ca;

    sincosf(degToRad(angl), &sa, &ca);

    rt[0] = ca;
    rt[1] = -sa;
    rt[4] = sa;
    rt[5] = ca;

    return rt;
}

/* Почему-то работает не проавильно, вращает вокруг yaw так-же как и вокруг roll
mtrx4 mtrx4FromEuler(float yaw, float pitch, float roll){
    float cosy, siny, cosp, sinp, cosr, sinr;
    mtrx4 rt;

    // cosy = cosf(degToRad(yaw));
    // siny = sinf(degToRad(yaw));
    // cosp = cosf(degToRad(pitch));
    // sinp = sinf(degToRad(pitch));
    // cosr = cosf(degToRad(roll));
    // sinr = sinf(degToRad(roll));

    sincosf32(degToRad(yaw),   &siny, &cosy);
    sincosf32(degToRad(pitch), &sinp, &cosp);
    sincosf32(degToRad(roll),  &sinr, &cosr);

    rt[0]  =  cosy*cosr - siny*cosp*sinr;
    rt[1]  = -cosy*sinr - siny*cosp*cosr;
    rt[2]  =  siny*sinp;
    rt[3]  = 0.0f;
    rt[4]  =  siny*cosr + cosy*cosp*sinr;
    rt[5]  = -siny*sinr + cosy*cosp*cosr;
    rt[6]  = -cosy*sinp;
    rt[7]  = 0.0f;
    rt[8]  =  sinp*sinr;
    rt[9]  =  sinp*cosr;
    rt[10] =  cosp;
    rt[11] = 0.0f;
    rt[12] = 0.0f;
    rt[13] = 0.0f;
    rt[14] = 0.0f;
    rt[15] = 1.0f;

    return rt;
}
*/

mtrx4 mtrx4FromEuler(float yaw, float pitch, float roll) {
    mtrx4 yawMtrx, pitchMtrx, rollMtrx;

    yawMtrx = mtrx4FromRtnYaw(yaw);
    pitchMtrx = mtrx4FromRtnPitch(pitch);
    rollMtrx = mtrx4FromRtnRoll(roll);

    return yawMtrx * pitchMtrx * rollMtrx;
}

mtrx4 mtrx4FromAxisAngl(const vec3 &ax, float phi) {
    float cosphi, sinphi, vxvy, vxvz, vyvz, vx, vy, vz;
    mtrx4 rt;

    cosphi = cosf(degToRad(phi));
    sinphi = sinf(degToRad(phi));
    vxvy = ax[0] * ax[1];
    vxvz = ax[0] * ax[2];
    vyvz = ax[1] * ax[2];
    vx = ax[0];
    vy = ax[1];
    vz = ax[2];

    rt[0] = cosphi + (1.0 - cosphi) * vx * vx;
    rt[1] = (1.0 - cosphi) * vxvy - sinphi * vz;
    rt[2] = (1.0 - cosphi) * vxvz + sinphi * vy;
    rt[3] = 0.0f;

    rt[4] = (1.0 - cosphi) * vxvy + sinphi * vz;
    rt[5] = cosphi + (1.0 - cosphi) * vy * vy;
    rt[6] = (1.0 - cosphi) * vyvz - sinphi * vx;
    rt[7] = 0.0f;

    rt[8] = (1.0 - cosphi) * vxvz - sinphi * vy;
    rt[9] = (1.0 - cosphi) * vyvz + sinphi * vx;
    rt[10] = cosphi + (1.0 - cosphi) * vz * vz;
    rt[11] = 0.0f;

    rt[12] = 0.0f;
    rt[13] = 0.0f;
    rt[14] = 0.0f;
    rt[15] = 1.0f;

    return rt;
}

mtrx4 mtrx4FromOffset(const vec3 &src) {
    mtrx4 rt;

    rt[3] = src[0];
    rt[7] = src[1];
    rt[11] = src[2];

    return rt;
}

mtrx4 mtrx4FromScale(const vec3 &src) {
    mtrx4 rt;

    rt[0] = src[0];
    rt[5] = src[1];
    rt[10] = src[2];

    return rt;
}

mtrx4 mtrx4fromQtnn(const qtnn &src) {
    mtrx4 rt;
    float wx, wy, wz, xx, yy, yz, xy, xz, zz, x2, y2, z2;

    x2 = src[0] + src[0];
    y2 = src[1] + src[1];
    z2 = src[2] + src[2];
    xx = src[0] * x2;
    xy = src[0] * y2;
    xz = src[0] * z2;
    yy = src[1] * y2;
    yz = src[1] * z2;
    zz = src[2] * z2;
    wx = src[3] * x2;
    wy = src[3] * y2;
    wz = src[3] * z2;

    rt[0] = 1.0 - (yy + zz);
    rt[1] = xy - wz;
    rt[2] = xz + wy;
    rt[3] = 0.0;
    rt[4] = xy + wz;
    rt[5] = 1.0 - (xx + zz);
    rt[6] = yz - wx;
    rt[7] = 0.0;
    rt[8] = xz - wy;
    rt[9] = yz + wx;
    rt[10] = 1.0 - (xx + yy);
    rt[11] = 0.0;

    rt[12] = 0.0;
    rt[13] = 0.0;
    rt[14] = 0.0;
    rt[15] = 1.0;

    return rt;
};

mtrx4 mtrx4FromPerspective(float fovy, float aspect, float near, float far) {
    mtrx4 rt;
    float f = 1.0f / tanf(fovy / std::numbers::sqrt2_v<float>);
    float nf;

    rt[0] = f / aspect;
    rt[1] = 0.0f;
    rt[2] = 0.0f;
    rt[3] = 0.0f;
    rt[4] = 0.0f;
    rt[5] = f;
    rt[6] = 0.0f;
    rt[7] = 0.0f;
    rt[8] = 0.0f;
    rt[9] = 0.0f;
    rt[11] = -1.0f;
    rt[12] = 0.0f;
    rt[13] = 0.0f;
    rt[15] = 0.0f;

    if (far >= std::numeric_limits<float>::epsilon()) {
        nf = 1.0f / (near - far);
        rt[10] = (far + near) * nf;
        rt[14] = 2.0f * far * near * nf;
    } else {
        rt[10] = -1.0f;
        rt[14] = -2.0f * near;
    }

    return rt;
};

mtrx4 mtrx4FromLookAt(vec3 eye, vec3 center, vec3 up) {
    mtrx4 out = mtrx4FromIdtt();
    vec3 eyeDir;

    constexpr float floatEps = std::numeric_limits<float>::epsilon();
    if (std::fabs(eye[0] - center[0]) < floatEps && std::fabs(eye[1] - center[1]) < floatEps
        && std::fabs(eye[2] - center[2]) < floatEps) {
        return out;
    }

    float z0 = eye[0] - center[0];
    float z1 = eye[1] - center[1];
    float z2 = eye[2] - center[2];

    float len = 1.0f / std::hypot(z0, z1, z2);  //??? было просто hypot
    z0 *= len;
    z1 *= len;
    z2 *= len;

    float x0 = up[1] * z2 - up[2] * z1;
    float x1 = up[2] * z0 - up[0] * z2;
    float x2 = up[0] * z1 - up[1] * z0;
    len = std::hypot(x0, x1, x2);
    if (len == 0.0f) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1.0f / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    float y0 = z1 * x2 - z2 * x1;
    float y1 = z2 * x0 - z0 * x2;
    float y2 = z0 * x1 - z1 * x0;

    len = std::hypot(y0, y1, y2);
    if (len == 0.0f) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1.0f / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0.0f;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0.0f;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0.0f;
    out[12] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]);
    out[13] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]);
    out[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]);
    out[15] = 1.0f;

    return out;
}

mtrx4 mtrx4FromOrthographic(float left,
                            float right,
                            float bottom,
                            float top,
                            float near,
                            float far) {
    mtrx4 rt;

    rt[0] = 2.0f / (right - left);
    rt[1] = 0;
    rt[2] = 0;
    rt[3] = 0;

    rt[4] = 0;
    rt[5] = 2.0f / (top - bottom);
    rt[6] = 0;
    rt[7] = 0;

    rt[8] = 0;
    rt[9] = 0;
    rt[10] = -2.0f / (far - near);
    rt[11] = 0;

    rt[12] = -(right + left) / (right - left);
    rt[13] = -(top + bottom) / (top - bottom);
    rt[14] = -(far + near) / (far - near);
    rt[15] = 1.0f;

    return rt;
}

float mtrx4DetLU(const mtrx4 &m) {
    mtrx4 l, u;
    tuple<mtrx4, mtrx4> lu;
    float l_det, u_det;

    lu = mtrx4LU(m);

    l_det = get<0>(lu)[0];
    u_det = get<1>(lu)[0];

    for (size_t i = 1; i < mrange; i++) {
        l_det *= l[idRw(i, i, mrange)];
        u_det *= u[idRw(i, i, mrange)];
    }

    return l_det * u_det;
}

mtrx4 mtrx4Mult(const mtrx4 &a, const mtrx4 &b) {
    mtrx4 rt = { 0.0f };

    for (size_t i = 0; i < mrange; i++) {
        for (size_t j = 0; j < mrange; j++) {
            for (size_t k = 0; k < mrange; k++) {
                rt[idRw(i, j, mrange)] += a[idRw(k, j, mrange)] * b[idRw(i, k, mrange)];
            }
        }
    }

    return rt;
}

vec4 mtrx4MultVec(const mtrx4 &m, const vec4 &v) {
    vec4 rt;

    for (size_t i = 0; i < mrange; i++) {
        for (size_t j = 0; j < mrange; j++) {
            rt[i] += m[idRw(i, j, mrange)] * v[j];
        }
    }

    return rt;
}

vec3 mtrx4MultVec3(const mtrx4 &m, const vec3 &v) {
    vec3 rt;
    float w;

    // vec4 tmp, mv = {v[0], v[1], v[2], 1.0f};

    // tmp = mtrx4MultVec(m, mv);
    //
    // return vec3(tmp[0], tmp[1], tmp[2]);

    rt[0] = v[0] * m[0] + v[1] * m[1] + v[2] * m[2] + m[3];
    rt[1] = v[0] * m[4] + v[1] * m[5] + v[2] * m[6] + m[7];
    rt[2] = v[0] * m[8] + v[1] * m[9] + v[2] * m[10] + m[11];
    w = v[0] * m[12] + v[1] * m[13] + v[2] * m[14] + m[15];

    // normalize if w is different than 1 (convert from homogeneous to Cartesian coordinates)
    if (w != 1.0f) {
        rt[0] /= w;
        rt[1] /= w;
        rt[2] /= w;
    }

    return rt;
}

/*
    Нижнетреугольная (L, lm) матрица имеет единицы по диагонали
*/

tuple<mtrx4, mtrx4> mtrx4LU(const mtrx4 &m) {
    mtrx4 lm, um;
    size_t i, j, k;
    float sum;

    for (i = 0; i < mrange; i++) {
        for (k = i; k < mrange; k++) {
            sum = 0;
            for (j = 0; j < i; j++) {
                sum += (lm[idRw(i, j, mrange)] * um[idRw(j, k, mrange)]);
            }
            um[idRw(i, k, mrange)] = m[idRw(i, k, mrange)] - sum;
        }

        for (k = i; k < mrange; k++) {
            if (i == k) {
                lm[idRw(i, i, mrange)] = 1.0;
            } else {
                sum = 0;
                for (j = 0; j < i; j++) {
                    sum += lm[idRw(k, j, mrange)] * um[idRw(j, i, mrange)];
                }
                lm[idRw(k, i, mrange)] = (m[idRw(k, i, mrange)] - sum) / um[idRw(i, i, mrange)];
            }
        }
    }

    return { lm, um };
}

tuple<mtrx4, vec4> mtrx4LDLT(const mtrx4 &m) {
    mtrx4 lm;
    vec4 dv;
    size_t i, j, k;
    float sum;

    for (i = 0; i < mrange; i++) {
        for (j = i; j < mrange; j++) {
            sum = m[idRw(j, i, mrange)];
            for (k = 0; k < i; k++) {
                sum = sum - lm[idRw(i, k, mrange)] * dv[k] * lm[idRw(j, k, mrange)];
                if (i == j) {
                    if (sum <= 0) {
                        std::cout << "mtrx4LDLT(): matrix is not positive deﬁnite";
                        return { mtrx4(), vec4(0.0, 0.0, 0.0, 0.0) };
                    }
                    dv[i] = sum;
                    lm[idRw(i, i, mrange)] = 1.0;
                } else {
                    lm[idRw(j, i, mrange)] = sum / dv[i];
                }
            }
        }
    }

    return { lm, dv };
}

mtrx4 mtrx4GetTranspose(const mtrx4 &m) {
    size_t i, j;
    float tmp;
    mtrx4 rt;

    rt = m;

    for (i = 0; i < mrange; i++) {
        for (j = 0; j < i; j++) {
            tmp = rt[idRw(i, i, mrange)];
            rt[idRw(i, j, mrange)] = rt[idRw(j, i, mrange)];
            rt[idRw(j, i, mrange)] = tmp;
        }
    }

    return rt;
}

vec4 mtrx4SolveGauss(const mtrx4 &m, const vec4 &v) {
    size_t i, j, k;
    // float a[mrange][mrange + 1];
    float t;
    std::array<std::array<float, mrange + 1>, mrange> a;
    vec4 rt;

    for (i = 0; i < mrange; i++) {      //было ++i
        for (j = 0; j < mrange; j++) {  //было ++j
            a[i][j] = m[idRw(i, j, mrange)];
            a[i][mrange] = v[i];
        }
    }

    /* Pivotisation */
    for (i = 0; i < mrange; i++) {
        for (k = i + 1; k < mrange; k++) {
            if (fabs(a[i][i]) < fabs(a[k][i])) {
                for (j = 0; j <= mrange; j++) {
                    t = a[i][j];
                    a[i][j] = a[k][j];
                    a[k][j] = t;
                }
            }
        }
    }

    /* прямой ход */
    for (k = 1; k < mrange; k++) {
        for (j = k; j < mrange; j++) {
            t = a[j][k - 1] / a[k - 1][k - 1];
            for (i = 0; i < mrange + 1; i++) {
                a[j][i] = a[j][i] - t * a[k - 1][i];
            }
        }
    }

    /* обратный ход */
    for (i = mrange - 1; i > 0; i--) {
        rt[i] = a[i][mrange] / a[i][i];
        for (j = mrange - 1; j > i; j--) {
            rt[i] = rt[i] - a[i][j] * rt[j] / a[i][i];
        }
    }

    return rt;
}

mtrx4 mtrx4InsertCmn(const mtrx4 &m, const vec4 &v, int cmn) {
    size_t i, j = 0;
    mtrx4 rt;

    rt = m;

    for (i = cmn; i < mrange * mrange; i += mrange) {
        rt[i] = v[j];
        j++;
    }

    return rt;
}

vec4 mtrx4SolveKramer(const mtrx4 &m, const vec4 &v) {
    float det;
    mtrx4 kr_mtrx;
    vec4 rt;

    det = mtrx4DetLU(m);

    if (fabs(det) < f_eps) {
        std::cout << "mtrx4SolveKramer(): system has no solve";
        return vec4(0.0, 0.0, 0.0, 0.0);
    }

    for (size_t i = 0; i < mrange; i++) {
        kr_mtrx = mtrx4InsertCmn(m, v, i);
        rt[i] = mtrx4DetLU(kr_mtrx) / det;
    }

    return rt;
}
