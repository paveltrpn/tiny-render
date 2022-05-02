
export class vec4 {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} w
     */ 
    constructor(x=0, y=0, z=0, w=0) {
        this.data = new Float32Array(4)

        this.data[0] = x
        this.data[1] = y
        this.data[2] = z
        this.data[3] = w
    }

    zero() {
        this.data[0] = 0.0
        this.data[1] = 0.0
        this.data[2] = 0.0
        this.data[3] = 0.0
    }
}