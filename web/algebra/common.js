
export const fEPS = 0.000001;

/**
 * 
 * @param {number} deg 
 * @returns 
 */
export function degToRad(deg) {
	return deg * Math.PI/180.0;
}

/**
 *  multidimensional array mapping, array[i][j]
 *	row-wise (C, C++):
 *	(0	1)
 *	(2	3)
 * @param {number} i - row number
 * @param {number} j - column number
 * @param {number} n - range of square matrix
 * @returns 
 */
export function idRw(i, j, n) {
	return (i*n + j);
};

/**
 *  multidimensional array mapping, array[i][j]
 *	column-wise (Fortran, Matlab):
 *	(0	2)
 *	(1	3)
 * @param {number} i - row number
 * @param {number} j - column number
 * @param {number} n - range of square matrix
 * @returns 
 */
export function idCw(i, j, n) {
	return (j*n + i);
};
