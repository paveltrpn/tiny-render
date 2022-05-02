
export class vec2 {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */ 
    constructor(x=0, y=0) {
        this.data = new Float32Array(2)

        this.data[0] = x
        this.data[1] = y
    }

    zero() {
        this.data[0] = 0.0
        this.data[1] = 0.0
    }
}