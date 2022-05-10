export const fEPS = 0.000001;
export function degToRad(deg) {
    return deg * Math.PI / 180.0;
}
export function idRw(i, j, n) {
    return (i * n + j);
}
;
export function idCw(i, j, n) {
    return (j * n + i);
}
;
