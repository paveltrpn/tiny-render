
export class mtrx3 {
    constructor() {
        this.data = new Float32Array(9)
        this.setIdtt()
    }

    setIdtt() {
        for (let i = 0; i < 9; i++) {
            if ((i % 4) == 0) {
                this.data[i] = 1.0
            } else {
                this.data[i] = 0.0
            }
        }
    }
}