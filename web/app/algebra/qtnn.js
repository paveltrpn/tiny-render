import * as vec3 from "./vec3.js";
import { fEPS } from "./common.js";
export class qtnn {
    data;
    order = 4;
    constructor(x, y, z, w) {
        if (x instanceof qtnn) {
            this.data = new Float32Array(this.order);
            this.fromQtnn(x);
        }
        else {
            this.data = new Float32Array(this.order);
            this.data[0] = x || 0.0;
            this.data[1] = y || 0.0;
            this.data[2] = z || 0.0;
            this.data[3] = w || 1.0;
        }
    }
    fromQtnn(src) {
        this.data[0] = src.data[0];
        this.data[1] = src.data[1];
        this.data[2] = src.data[2];
        this.data[3] = src.data[3];
    }
    lenght() {
        return Math.sqrt(this.data[0] * this.data[0] +
            this.data[1] * this.data[1] +
            this.data[2] * this.data[2] +
            this.data[3] * this.data[3]);
    }
    normalize() {
        let len;
        len = this.lenght();
        if (len > fEPS) {
            this.data[0] = this.data[0] / len;
            this.data[1] = this.data[1] / len;
            this.data[2] = this.data[2] / len;
            this.data[3] = this.data[3] / len;
        }
    }
    scale(scale) {
        this.data[0] = this.data[0] * scale;
        this.data[1] = this.data[1] * scale;
        this.data[2] = this.data[2] * scale;
        this.data[3] = this.data[3] * scale;
    }
    invert() {
        this.data[0] = -this.data[0];
        this.data[1] = -this.data[1];
        this.data[2] = -this.data[2];
        this.data[3] = this.data[3];
    }
    setRtnX(phi) {
        let halfPhi = phi / 2.0;
        this.data[3] = Math.cos(halfPhi);
        this.data[0] = Math.sin(halfPhi);
        this.data[1] = 0.0;
        this.data[2] = 0.0;
    }
    setRtnY(phi) {
        let halfPhi = phi / 2.0;
        this.data[3] = Math.cos(halfPhi);
        this.data[0] = 0.0;
        this.data[1] = Math.sin(halfPhi);
        this.data[2] = 0.0;
    }
    setRtnZ(phi) {
        let halfPhi = phi / 2.0;
        this.data[3] = Math.cos(halfPhi);
        this.data[0] = 0.0;
        this.data[1] = 0.0;
        this.data[2] = Math.sin(halfPhi);
    }
    setAxisAngl(axis, phi) {
        let halfPhiSin = Math.sin(phi / 2.0);
        let ax = new vec3.vec3();
        ax = vec3.vec3Normalize(axis);
        this.data[3] = Math.cos(phi / 2.0);
        this.data[0] = ax.data[0] * halfPhiSin;
        this.data[1] = ax.data[1] * halfPhiSin;
        this.data[2] = ax.data[2] * halfPhiSin;
    }
}
function qtnnDot(a, b) {
    return a.data[0] * b.data[0] +
        a.data[1] * b.data[1] +
        a.data[2] * b.data[2] +
        a.data[3] * b.data[3];
}
function qtnnMult(a, b) {
    let rt = new qtnn;
    rt.data[3] = a.data[3] * b.data[3] - a.data[0] * b.data[0] - a.data[1] * b.data[1] - a.data[2] * b.data[2];
    rt.data[0] = a.data[3] * b.data[0] + a.data[0] * b.data[3] + a.data[1] * b.data[2] - a.data[2] * b.data[1];
    rt.data[1] = a.data[3] * b.data[1] - a.data[0] * b.data[2] + a.data[1] * b.data[3] + a.data[2] * b.data[0];
    rt.data[2] = a.data[3] * b.data[2] + a.data[0] * b.data[1] - a.data[1] * b.data[0] + a.data[2] * b.data[3];
    return rt;
}
function qtnnSlerp(from, to, t) {
    let rt;
    let p1;
    let omega, cosom, sinom, scale0, scale1;
    cosom = qtnnDot(from, to);
    if (cosom < 0.0) {
        cosom = -cosom;
        p1[0] = -to.data[0];
        p1[1] = -to.data[1];
        p1[2] = -to.data[2];
        p1[3] = -to.data[3];
    }
    else {
        p1[0] = to.data[0];
        p1[1] = to.data[1];
        p1[2] = to.data[2];
        p1[3] = to.data[3];
    }
    if ((1.0 - cosom) > fEPS) {
        omega = Math.acos(cosom);
        sinom = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    }
    else {
        scale0 = 1.0 - t;
        scale1 = t;
    }
    rt.data[0] = scale0 * from.data[0] + scale1 * p1[0];
    rt.data[1] = scale0 * from.data[1] + scale1 * p1[1];
    rt.data[2] = scale0 * from.data[2] + scale1 * p1[2];
    rt.data[3] = scale0 * from.data[3] + scale1 * p1[3];
    return rt;
}
