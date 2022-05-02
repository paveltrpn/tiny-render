
class vec3 {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */ 
    constructor(x=0, y=0, z=0) {
        this.data = new Float32Array(3)

        this.data[0] = x
        this.data[1] = y
        this.data[2] = z
    }

    zero() {
        this.data[0] = 0.0
        this.data[1] = 0.0
        this.data[2] = 0.0
    }
}

/**
 * 
 * @param {vec3} a 
 * @param {vec3} b 
 * @returns {vec3}
 */
function vec3Sum(a, b) {
    let rt = new vec3()

    rt.data[0] = a.data[0] + b.data[0]
    rt.data[1] = a.data[1] + b.data[1]
    rt.data[2] = a.data[2] + b.data[2]

    return rt
}

/**
 * 
 * @param {vec3} a 
 * @param {vec3} b 
 * @returns {vec3}
 */
 function vec3Sub(a, b) {
    let rt = new vec3()

    rt.data[0] = a.data[0] - b.data[0]
    rt.data[1] = a.data[1] - b.data[1]
    rt.data[2] = a.data[2] - b.data[2]

    return rt
}

/**
 * 
 * @param {vec3} a 
 * @param {vec3} b 
 * @returns 
 */
function vec3Dot(a, b) {
    return a.data[0]*b.data[0] + a.data[1]*b.data[1] + a.data[2]*b.data[2]
}