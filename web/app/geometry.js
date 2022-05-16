const positions = [
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0,
    1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
    -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
    -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0,
    1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
    1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0
];
const normals = [
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0
];
const colors = [
    0.5, 0.7, 0.5, 0.5, 0.7, 0.5, 0.5, 0.7, 0.5,
    0.5, 0.7, 0.5, 0.5, 0.7, 0.5, 0.5, 0.7, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
];
export class gmtryInstance_c {
    vertices;
    indeces;
    normals;
    colors;
    vertices_count;
    indeces_count;
    constructor() {
    }
    dummyInit() {
        this.vertices = Float32Array.from(positions);
        this.normals = Float32Array.from(normals);
        this.colors = Float32Array.from(colors);
        this.vertices_count = this.vertices.length;
    }
    fetchFromCSV(fname) {
    }
    applyVec3Sum(vec) {
        for (let i = 0; i < this.vertices_count; i = i + 3) {
            this.vertices[i + 0] = this.vertices[i + 0] + vec.data[0];
            this.vertices[i + 1] = this.vertices[i + 1] + vec.data[1];
            this.vertices[i + 2] = this.vertices[i + 2] + vec.data[2];
        }
    }
    applyMtrx4ToVerts(A) {
        for (let i = 0; i < this.vertices_count; i = i + 3) {
            let x = this.vertices[i + 0];
            let y = this.vertices[i + 1];
            let z = this.vertices[i + 2];
            let w = A.data[3] * x + A.data[7] * y + A.data[11] * z + A.data[15];
            if (w < 0.00001) {
                w = 1.0;
            }
            this.vertices[i + 0] = (A.data[0] * x + A.data[4] * y + A.data[8] * z + A.data[12]) / w;
            this.vertices[i + 1] = (A.data[1] * x + A.data[5] * y + A.data[9] * z + A.data[13]) / w;
            this.vertices[i + 2] = (A.data[2] * x + A.data[6] * y + A.data[10] * z + A.data[14]) / w;
        }
    }
    applyMtrx4ToNormals(A) {
        for (let i = 0; i < this.vertices_count; i = i + 3) {
            let nx = this.normals[i + 0];
            let ny = this.normals[i + 1];
            let nz = this.normals[i + 2];
            let w = A.data[3] * nx + A.data[7] * ny + A.data[11] * nz + A.data[15];
            if (w < 0.00001) {
                w = 1.0;
            }
            this.normals[i + 0] = (A.data[0] * nx + A.data[4] * ny + A.data[8] * nz + A.data[12]) / w;
            this.normals[i + 1] = (A.data[1] * nx + A.data[5] * ny + A.data[9] * nz + A.data[13]) / w;
            this.normals[i + 2] = (A.data[2] * nx + A.data[6] * ny + A.data[10] * nz + A.data[14]) / w;
        }
    }
}
