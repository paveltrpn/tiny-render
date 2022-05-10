
export const fEPS: number = 0.000001;

export function degToRad(deg: number): number {
	return deg * Math.PI/180.0;
}

export function idRw(i: number, j: number, n: number): number {
	return (i*n + j);
};

export function idCw(i: number, j: number, n: number): number {
	return (j*n + i);
};
