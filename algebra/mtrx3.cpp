
#include <iostream>
#include <tuple>
#include <cmath>

#include "mtrx3.h"

using namespace std;

/* DEBUG !!!! */
mtrx3::mtrx3(float yaw, float pitch, float roll) {
	float cosy, siny, cosp, sinp, cosr, sinr;
	
	cosy = cosf(degToRad(yaw));
	siny = sinf(degToRad(yaw));
	cosp = cosf(degToRad(pitch));
	sinp = sinf(degToRad(pitch));
	cosr = cosf(degToRad(roll));
	sinr = sinf(degToRad(roll));

	data[0] = cosy*cosr - siny*cosp*sinr;
	data[1] = -cosy*sinr - siny*cosp*cosr;
	data[2] = siny * sinp;

	data[3] = siny*cosr + cosy*cosp*sinr;
	data[4] = -siny*sinr + cosy*cosp*cosr;
	data[5] = -cosy * sinp;

	data[6] = sinp * sinr;
	data[7] = sinp * cosr;
	data[8] = cosp;
}

/* DEBUG !!!! */
mtrx3::mtrx3(const vec3 &ax, float phi) {
	float cosphi, sinphi, vxvy, vxvz, vyvz, vx, vy, vz;

	cosphi = cosf(degToRad(phi));
	sinphi = sinf(degToRad(phi));
	vxvy = ax[_XC] * ax[_YC];
	vxvz = ax[_XC] * ax[_ZC];
	vyvz = ax[_YC] * ax[_ZC];
	vx = ax[_XC];
	vy = ax[_YC];
	vz = ax[_ZC];

	data[0] = cosphi + (1.0f-cosphi)*vx*vx;
	data[1] = (1.0f-cosphi)*vxvy - sinphi*vz;
	data[2] = (1.0f-cosphi)*vxvz + sinphi*vy;

	data[3] = (1.0f-cosphi)*vxvy + sinphi*vz;
	data[4] = cosphi + (1.0f-cosphi)*vy*vy;
	data[5] = (1.0f-cosphi)*vyvz - sinphi*vz;

	data[6] = (1.0f-cosphi)*vxvz - sinphi*vy;
	data[7] = (1.0f-cosphi)*vyvz + sinphi*vx;
	data[8] = cosphi + (1.0f-cosphi)*vz*vz;
}

mtrx3 mtrx3_idtt() {
	mtrx3 rt;
    constexpr int mrange = 3;
	int i, j;

	for (i = 0; i < mrange; i++) {
		for (j = 0; j < mrange; j++) {
			if (i == j) {
				rt[idRw(i, j, mrange)] = 1.0f;
			} else {
				rt[idRw(i, j, mrange)] = 0.0f;
			}
		}
	}

	return rt;
}

mtrx3 mtrx3_set(float m[9]) {
    mtrx3 rt;
	constexpr int mrange = 3;
	int	i, j;

	for (i = 0; i < mrange; i++) {
		for (j = 0; j < mrange; j++) {
			rt[idRw(i, j, mrange)] = m[idRw(i, j, mrange)];
		}
	}

	return rt;
}

mtrx3 mtrx3_set_float(float a00, float a01, float a02,
	                    float a10, float a11, float a12,
	                    float a20, float a21, float a22) {
    mtrx3 rt;

	rt[0] = a00;
	rt[1] = a01;
	rt[2] = a02;

	rt[3] = a10;
	rt[4] = a11;
	rt[5] = a12;

	rt[6] = a20;
	rt[7] = a21;
	rt[8] = a22;

	return rt;
}

mtrx3 mtrx3_set_yaw(float angl) {
	float sa, ca;
	mtrx3 rt;

	sa = sinf(degToRad(angl));
	ca = cosf(degToRad(angl));

	rt[0] = ca;   rt[1] = -sa;  rt[2] = 0.0f;
	rt[3] = sa;   rt[4] =  ca;  rt[5] = 0.0f;
	rt[6] = 0.0f; rt[7] = 0.0f; rt[8] = 1.0f;

	return rt;
}

mtrx3 mtrx3_set_pitch(float angl) {
	float sa, ca;
	mtrx3 rt;

	sa = sinf(degToRad(angl));
	ca = cosf(degToRad(angl));

	rt[0] = 1.0f; rt[1] = 0.0f; rt[2] = 0.0f;
	rt[3] = 0.0f; rt[4] = ca;   rt[5] = -sa;
	rt[6] = 0.0f; rt[7] = sa;   rt[8] = ca;

	return rt;
}

mtrx3 mtrx3_set_roll(float angl)
{
	float sa, ca;
	mtrx3 rt;

	sa = sinf(degToRad(angl));
	ca = cosf(degToRad(angl));

	rt[0] = ca;   rt[1] = 0.0f; rt[2] = sa;
	rt[3] = 0.0f; rt[4] = 1.0f; rt[5] = 0.0f;
	rt[6] = -sa;  rt[7] = 0.0f; rt[8] = ca;

	return rt;
}

void mtrx3_show(mtrx3 m) {
	printf("%5.2f %5.2f %5.2f\n", m[0], m[1], m[2]);
	printf("%5.2f %5.2f %5.2f\n", m[3], m[4], m[5]);
    printf("%5.2f %5.2f %5.2f\n", m[6], m[7], m[8]);
}

float mtrx3_det(mtrx3 m) {
	return m[0]*m[4]*m[8] +
		   m[6]*m[1]*m[5] +
		   m[2]*m[3]*m[7] -
		   m[0]*m[7]*m[5] -
		   m[8]*m[3]*m[1];
}

float mtrx3_det_lu(mtrx3 m) {
	constexpr int mrange = 3;
	int		i;         
	mtrx3 l, u;
	tuple<mtrx3, mtrx3> lu;
	float 	l_det, u_det;
	
	lu = mtrx3_lu(m);

	l_det = get<0>(lu)[0];
	u_det = get<1>(lu)[0];

	for (i = 1; i < mrange; i++) {
		l_det *= l[idRw(i, i, mrange)];
		u_det *= u[idRw(i, i, mrange)];
	}

	return l_det * u_det;
}

mtrx3 mtrx3_mult(mtrx3 a, mtrx3 b) {
	constexpr int mrange = 3;
	int i, j, k;
	float tmp;
    mtrx3 rt;

	for (i = 0; i < mrange; i++) {
		for (j = 0; j < mrange; j++) {
			tmp = 0.0;
			for (k = 0; k < mrange; k++) {
				tmp = tmp + a[idRw(k, j, mrange)]*b[idRw(i, k, mrange)];
			}
			rt[idRw(i, j, mrange)] = tmp;
		}
	}

	return rt;
}

vec3 mtrx3_mult_vec(mtrx3 m, vec3 v) {
	constexpr int mrange = 3;
	int		i, j;
	float	tmp;
	vec3	rt;

	for (i = 0; i < mrange; i++) {
		tmp = 0;
		for (j = 0; j < mrange; j++) {
			tmp = tmp + m[idRw(i, j, mrange)]*v[j];
		}
		rt[i] = tmp;
	}

	return rt;
}

/*
	Нижнетреугольная (L, lm) матрица имеет единицы по диагонали
*/

tuple<mtrx3, mtrx3> mtrx3_lu(mtrx3 m) {
	constexpr int mrange = 3;
	mtrx3 lm, um; 
	int i, j, k;
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

	return {lm, um};
}

tuple<mtrx3, vec3> mtrx3_ldlt(mtrx3 m) {
	constexpr int mrange = 3;
	mtrx3 lm;
	vec3 dv;
	int i, j, k;
	float sum;   

	for (i = 0; i < mrange; i++) {
		for (j = i; j < mrange; j++) {
			sum = m[idRw(j, i, mrange)];
			for (k = 0; k < i; k++) {
				sum = sum - lm[idRw(i, k, mrange)]*dv[k]*lm[idRw(j, k, mrange)];
				if (i == j) {
					if (sum <= 0) {
						printf("mtrx3_ldlt(): matrix is not positive deﬁnite");
						return {mtrx3_idtt(), vec3(0.0f, 0.0f, 0.0f)};
					}
					dv[i] = sum;
					lm[idRw(i, i, mrange)] = 1.0;
				} else {
					lm[idRw(j, i, mrange)] = sum / dv[i];
				}
			}
		}
	}

	return {lm, dv};
}

mtrx3 mtrx3_transpose(mtrx3 m) {
	constexpr int mrange = 3;
	int i, j;
	float tmp;
	mtrx3 rt;

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

mtrx3 mtrx3_invert(mtrx3 m) {
	mtrx3 inverse, rt;
	float det, invDet;

	inverse[0] = m[4]*m[8] - m[5]*m[7];
	inverse[3] = m[5]*m[6] - m[3]*m[8];
	inverse[6] = m[3]*m[7] - m[4]*m[6];

	det = m[0]*inverse[0] + m[1]*inverse[3] +
		m[2]*inverse[6];

	if (fabs(det) < f_eps) {
		printf("mtrx3_invert(): determinant is a zero!");
		return mtrx3();
	}

	invDet = 1.0 / det;

	inverse[1] = m[2]*m[7] - m[1]*m[8];
	inverse[2] = m[1]*m[5] - m[2]*m[4];
	inverse[4] = m[0]*m[8] - m[2]*m[6];
	inverse[5] = m[2]*m[3] - m[0]*m[5];
	inverse[7] = m[1]*m[6] - m[0]*m[7];
	inverse[8] = m[0]*m[4] - m[1]*m[3];

	rt[0] = inverse[0] * invDet;
	rt[1] = inverse[1] * invDet;
	rt[2] = inverse[2] * invDet;

	rt[3] = inverse[3] * invDet;
	rt[4] = inverse[4] * invDet;
	rt[5] = inverse[5] * invDet;

	rt[6] = inverse[6] * invDet;
	rt[7] = inverse[7] * invDet;
	rt[8] = inverse[8] * invDet;

	return rt;
}

vec3 mtrx3_solve_gauss(mtrx3 m, vec3 v) {
	constexpr int mrange = 3;
	int i, j, k;
	float a[mrange][mrange + 1], t;
	vec3 rt;

	for (i = 0; i < mrange; i++) { //было ++i
		for (j = 0; j < mrange; j++) { //было ++j
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
			t = a[j][k-1] / a[k-1][k-1];
			for (i = 0; i < mrange+1; i++) {
				a[j][i] = a[j][i] - t*a[k-1][i];
			}
		}
	}

	/* обратный ход */
	for (i = mrange - 1; i >= 0; i--) {
		rt[i] = a[i][mrange] / a[i][i];
		for (j = mrange - 1; j > i; j--) {
			rt[i] = rt[i] - a[i][j]*rt[j]/a[i][i];
		}
	}

	return rt;
}

mtrx3 mtrx3_insert_cmn(mtrx3 m, vec3 v, int cmn) {
	constexpr int mrange = 3;
	int i, j= 0;
	mtrx3 rt;

	rt = m;

	for (i = cmn; i < mrange*mrange; i += mrange) {
		rt[i] = v[j];
		j++;
	}

	return rt;
}

vec3 mtrx3_solve_kramer(mtrx3 m, vec3 v) {
	constexpr int mrange = 3;
	int i;
	float det;
	mtrx3 kr_mtrx;
	vec3 rt;

	det = mtrx3_det(m);

	if (fabs(det) < f_eps) {
		printf("mtrx3_solve_kramer(): system has no solve");
		return vec3(0.0, 0.0, 0.0);
	}

	for (i = 0; i < mrange; i++) {
		kr_mtrx = mtrx3_insert_cmn(m, v, i);
		rt[i] = mtrx3_det(kr_mtrx) / det;
	}

	return rt;
}
