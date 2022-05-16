import { fEPS } from "./common.js";
export class vec2 {
    data;
    order = 2;
    constructor(x, y) {
        if (x instanceof vec2) {
            this.data = new Float32Array(2);
            this.fromVec2(x);
        }
        else {
            this.data = new Float32Array(2);
            this.data[0] = x || 0.0;
            this.data[1] = y || 0.0;
        }
    }
    fromVec2(src) {
        this.data[0] = src.data[0];
        this.data[1] = src.data[1];
    }
    lenght() {
        return Math.sqrt(this.data[0] * this.data[0] +
            this.data[1] * this.data[1]);
    }
    normalize() {
        let len;
        len = this.lenght();
        if (len != 0.0) {
            this.data[0] = this.data[0] / len;
            this.data[1] = this.data[1] / len;
        }
    }
    scale(scale) {
        this.data[0] = this.data[0] * scale;
        this.data[1] = this.data[1] * scale;
    }
    invert() {
        this.data[0] = -this.data[0];
        this.data[1] = -this.data[1];
    }
}
;
export function vec2Normalize(v) {
    let rt = new vec2();
    let len;
    len = v.lenght();
    if (len > fEPS) {
        rt.data[0] = v.data[0] / len;
        rt.data[1] = v.data[1] / len;
    }
    return rt;
}
function vec2Scale(v, scale) {
    let rt = new vec2();
    rt.data[0] = v.data[0] * scale;
    rt.data[1] = v.data[1] * scale;
    return rt;
}
function vec2Invert(v) {
    let rt = new vec2;
    rt.data[0] = -v.data[0];
    rt.data[1] = -v.data[1];
    return rt;
}
function vec2Dot(a, b) {
    return a.data[0] * b.data[0] + a.data[1] * b.data[1] + a.data[2] * b.data[2];
}
function vec2Sum(a, b) {
    let rt = new vec2;
    rt.data[0] = a.data[0] + b.data[0];
    rt.data[1] = a.data[1] + b.data[1];
    return rt;
}
function vec2Sub(a, b) {
    let rt = new vec2;
    rt.data[0] = a.data[0] - b.data[0];
    rt.data[1] = a.data[1] - b.data[1];
    return rt;
}
