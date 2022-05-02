
export class mtrx2 {
    constructor() {
        this.data = new Float32Array(4)
        this.setIdtt()
    }

    setIdtt() {
        for (let i = 0; i < 4; i++) {
            if ((i % 3) == 0) {
                this.data[i] = 1.0
            } else {
                this.data[i] = 0.0
            }
        }
    }
}