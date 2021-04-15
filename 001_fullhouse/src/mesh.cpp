
#include <tuple>
#include "mesh.h"
#include "algebra2.h"

using namespace std;

vec3 x_ax = vec3(1.0f, 0.0f, 0.0f);
vec3 y_ax = vec3(0.0f, 1.0f, 0.0f);
vec3 z_ax = vec3(0.0f, 0.0f, 1.0f);
mtrx3 m_rtn;
qtnn q_rtn; 

void draw_decart(float scale) {
	
	glBegin(GL_LINES);
	glColor3f(1.0f, 0.0f, 0.0f);
	glVertex3f(0.0f, 0.0f, 0.0f);
	glVertex3f(scale, 0.0f, 0.0f);
	glEnd();

	glBegin(GL_LINES);
	glColor3f(0.0f, 1.0f, 0.0f);
	glVertex3f(0.0f, 0.0f, 0.0f);
	glVertex3f(0.0f, scale, 0.0f);
	glEnd();

	glBegin(GL_LINES);
	glColor3f(0.0f, 0.0f, 1.0f);
	glVertex3f(0.0f, 0.0f, 0.0f);
	glVertex3f(0.0f, 0.0f, scale);
	glEnd();
	
}

void box_c::append(const vec3 &pos, const mtrx3 &spd) {
	orientation.push_back({pos, spd, mtrx3()});
}

void box_c::show() {
	uint8_t j;

	for (auto &it : orientation) {

		for (j = 0; j < 8; j++) {
			/* поворачиваем, умножая вершину на матрицу положения */
			clone[j] = mtrx3_mult_vec(get<2>(it), base[j]);
			/* переносим, склалдывая вершину с вектором смещения */ 
			clone[j] = vec3Sum(get<0>(it), clone[j]);
		}

		for (j = 0; j < 6; j++) {
			/* поворачиваем, умножая вершину на матрицу положения */
			clone_normal[j] = mtrx3_mult_vec(get<2>(it), base_normal[j]);
		}

		/* изменяем положение, умножая матрицу положения на матрицу скорости вращения */ 
		get<2>(it) = mtrx3_mult(get<2>(it),
								get<1>(it));

		glBegin(GL_QUADS);

		glColor3f(0.1f, 0.6f, 0.1f);
		glNormal3fv(&clone_normal[0][0]);
		glTexCoord2f(0.0f, 0.0f); glVertex3fv(&clone[0][0]);
		glTexCoord2f(1.0f, 0.0f); glVertex3fv(&clone[1][0]);
		glTexCoord2f(1.0f, 1.0f); glVertex3fv(&clone[2][0]);
		glTexCoord2f(0.0f, 1.0f); glVertex3fv(&clone[3][0]);

		glColor3f(0.8f, 0.9f, 0.1f);
		glNormal3fv(&clone_normal[1][0]);
		glTexCoord2f(0.0f, 0.0f); glVertex3fv(&clone[4][0]);
		glTexCoord2f(1.0f, 0.0f); glVertex3fv(&clone[5][0]);
		glTexCoord2f(1.0f, 1.0f); glVertex3fv(&clone[6][0]);
		glTexCoord2f(0.0f, 1.0f); glVertex3fv(&clone[7][0]);

		glColor3f(0.0f, 1.0f, 1.0f);
		glNormal3fv(&clone_normal[2][0]);
		glTexCoord2f(0.0f, 0.0f); glVertex3fv(&clone[0][0]);
		glTexCoord2f(1.0f, 0.0f); glVertex3fv(&clone[1][0]);
		glTexCoord2f(1.0f, 1.0f); glVertex3fv(&clone[5][0]);
		glTexCoord2f(0.0f, 1.0f); glVertex3fv(&clone[4][0]);

		glColor3f(0.93f, 0.11f, 0.23f);
		glNormal3fv(&clone_normal[3][0]);
		glTexCoord2f(0.0f, 0.0f); glVertex3fv(&clone[2][0]);
		glTexCoord2f(1.0f, 0.0f); glVertex3fv(&clone[3][0]);
		glTexCoord2f(1.0f, 1.0f); glVertex3fv(&clone[7][0]);
		glTexCoord2f(0.0f, 1.0f); glVertex3fv(&clone[6][0]);

		glColor3f(0.1f, 0.15f, 0.75f);
		glNormal3fv(&clone_normal[4][0]);
		glTexCoord2f(0.0f, 0.0f);glVertex3fv(&clone[0][0]);
		glTexCoord2f(1.0f, 0.0f);glVertex3fv(&clone[4][0]);
		glTexCoord2f(1.0f, 1.0f);glVertex3fv(&clone[7][0]);
		glTexCoord2f(0.0f, 1.0f);glVertex3fv(&clone[3][0]);

		glColor3f(0.8f, 0.2f, 0.98f);
		glNormal3fv(&clone_normal[5][0]);
		glTexCoord2f(0.0f, 0.0f); glVertex3fv(&clone[1][0]);
		glTexCoord2f(1.0f, 0.0f); glVertex3fv(&clone[5][0]);
		glTexCoord2f(1.0f, 1.0f); glVertex3fv(&clone[6][0]);
		glTexCoord2f(0.0f, 1.0f); glVertex3fv(&clone[2][0]);

		glEnd();
	}
}