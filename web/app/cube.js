const vsSource = `
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec3 vLighting;
varying lowp vec4 vColor;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0, 0, 1));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
    //vLighting = vec3(0.5, 0.5, 0.5);
}
`;
const fsSource = `
varying highp vec3 vLighting;
varying lowp vec4 vColor;

void main(void) {
    gl_FragColor = vec4(vColor.rgb * vLighting, 1.0);
}
`;
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
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
];
let gl;
class cube_c {
    constructor() {
        this.squareRotation = 0.0;
    }
    setup(canvas, text_field) {
        let html_canvas = document.querySelector(canvas);
        gl = html_canvas.getContext('webgl2', { antialias: true, depth: true });
        this.wnd_width = gl.drawingBufferWidth;
        this.wnd_height = gl.drawingBufferHeight;
        this.aspect = this.wnd_width / this.wnd_height;
        if (!gl) {
            alert('cube_c::setup(): Unable to initialize WebGL. Your browser or machine may not support it.');
            return;
        }
        this.gl_shader = this.initShaderProgram(vsSource, fsSource);
        this.gl_programinfo = {
            program: this.gl_shader,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(this.gl_shader, 'aVertexPosition'),
                vertexNormal: gl.getAttribLocation(this.gl_shader, 'aVertexNormal'),
                vertexColor: gl.getAttribLocation(this.gl_shader, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(this.gl_shader, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(this.gl_shader, 'uModelViewMatrix'),
                normalMatrix: gl.getUniformLocation(this.gl_shader, 'uNormalMatrix'),
            },
        };
        let log_out = document.getElementById(text_field);
        log_out.innerText = gl.getParameter(gl.VERSION) + "; " +
            gl.getParameter(gl.SHADING_LANGUAGE_VERSION) + "; " +
            gl.getParameter(gl.VENDOR);
        let gl_ext = gl.getSupportedExtensions();
        for (let i = 0; i < gl_ext.length; i++) {
            log_out.innerText = log_out.innerText + (gl_ext[i]) + " ;";
        }
        this.initBuffers();
    }
    render(deltaTime) {
        gl.viewport(0, 0, this.wnd_width, this.wnd_height);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        let projectionMatrix = new mtrx4();
        projectionMatrix.setPerspective(degToRad(45), this.aspect, 0.1, 100.0);
        let modelViewMatrix = new mtrx4();
        let transMtrx = new mtrx4;
        transMtrx.setTranslate(new vec3(0.0, 0.0, -7.0));
        modelViewMatrix.mult(transMtrx);
        let fooQtnn = new qtnn();
        fooQtnn.setAxisAngl(new vec3(0.1, 0.4, 0.3), this.squareRotation);
        let rot = new mtrx4();
        rot.fromQtnn(fooQtnn);
        modelViewMatrix.mult(rot);
        let normalMatrix = new mtrx4(modelViewMatrix);
        normalMatrix.transpose();
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.gl_vert_buf);
            gl.vertexAttribPointer(this.gl_programinfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(this.gl_programinfo.attribLocations.vertexPosition);
        }
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.gl_normal_buf);
            gl.vertexAttribPointer(1, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(1);
        }
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.gl_color_buf);
            gl.vertexAttribPointer(this.gl_programinfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(this.gl_programinfo.attribLocations.vertexColor);
        }
        gl.useProgram(this.gl_programinfo.program);
        gl.uniformMatrix4fv(this.gl_programinfo.uniformLocations.projectionMatrix, false, projectionMatrix.data);
        gl.uniformMatrix4fv(this.gl_programinfo.uniformLocations.modelViewMatrix, false, modelViewMatrix.data);
        gl.uniformMatrix4fv(this.gl_programinfo.uniformLocations.normalMatrix, false, normalMatrix.data);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        this.squareRotation += deltaTime;
    }
    initBuffers() {
        this.gl_vert_buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gl_vert_buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        this.gl_normal_buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gl_normal_buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.gl_color_buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gl_color_buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    }
    initShaderProgram(vsSource, fsSource) {
        const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
    }
    loadShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
}
function onLoad(rq) {
    console.log("Nice load");
}
function loadWorld() {
    var request = new XMLHttpRequest();
    request.open("GET", "README.md");
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            onLoad(request.responseText);
        }
    };
    request.send();
}
function loadWorldFetch() {
    fetch('../README.md', { mode: 'no-cors' })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}
function main() {
    let app = new cube_c();
    let then = 0.0;
    app.setup("#glcanvas", "log_out");
    loadWorldFetch();
    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;
        app.render(deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();
class mtrx4 {
    constructor(src) {
        this.order = 4;
        if ((src) || (src instanceof mtrx4)) {
            this.data = new Float32Array(16);
            this.fromMtrx4(src);
        }
        else if ((src) || (src instanceof Float32Array)) {
            this.data = new Float32Array(16);
            this.fromArray(src);
        }
        else {
            let i, j;
            this.data = new Float32Array(16);
            for (i = 0; i < this.order; i++) {
                for (j = 0; j < this.order; j++) {
                    if (i == j) {
                        this.data[idRw(i, j, this.order)] = 1.0;
                    }
                    else {
                        this.data[idRw(i, j, this.order)] = 0.0;
                    }
                }
            }
        }
    }
    setIdtt() {
        let i, j;
        for (i = 0; i < this.order; i++) {
            for (j = 0; j < this.order; j++) {
                if (i == j) {
                    this.data[idRw(i, j, this.order)] = 1.0;
                }
                else {
                    this.data[idRw(i, j, this.order)] = 0.0;
                }
            }
        }
    }
    fromMtrx4(src) {
        for (let i = 0; i < this.order * this.order; i++) {
            this.data[i] = src.data[i];
        }
    }
    fromArray(src) {
        for (let i = 0; i < this.order * this.order; i++) {
            this.data[i] = src[i];
        }
    }
    fromQtnn(src) {
        let wx, wy, wz, xx, yy, yz, xy, xz, zz, x2, y2, z2;
        x2 = src.data[0] + src.data[0];
        y2 = src.data[1] + src.data[1];
        z2 = src.data[2] + src.data[2];
        xx = src.data[0] * x2;
        xy = src.data[0] * y2;
        xz = src.data[0] * z2;
        yy = src.data[1] * y2;
        yz = src.data[1] * z2;
        zz = src.data[2] * z2;
        wx = src.data[3] * x2;
        wy = src.data[3] * y2;
        wz = src.data[3] * z2;
        this.data[0] = 1.0 - (yy + zz);
        this.data[1] = xy - wz;
        this.data[2] = xz + wy;
        this.data[3] = 0.0;
        this.data[4] = xy + wz;
        this.data[5] = 1.0 - (xx + zz);
        this.data[6] = yz - wx;
        this.data[7] = 0.0;
        this.data[8] = xz - wy;
        this.data[9] = yz + wx;
        this.data[10] = 1.0 - (xx + yy);
        this.data[11] = 0.0;
        this.data[12] = 0.0;
        this.data[13] = 0.0;
        this.data[14] = 0.0;
        this.data[15] = 1.0;
    }
    mult(a) {
        let i, j, k, tmp;
        let rt = new mtrx4();
        for (i = 0; i < this.order; i++) {
            for (j = 0; j < this.order; j++) {
                tmp = 0.0;
                for (k = 0; k < this.order; k++) {
                    tmp = tmp + this.data[(idRw(k, j, this.order))] * a.data[(idRw(i, k, this.order))];
                }
                rt.data[(idRw(i, j, this.order))] = tmp;
            }
        }
        this.fromMtrx4(rt);
    }
    setPerspective(fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(fovy / 2);
        let nf;
        this.data[0] = f / aspect;
        this.data[1] = 0;
        this.data[2] = 0;
        this.data[3] = 0;
        this.data[4] = 0;
        this.data[5] = f;
        this.data[6] = 0;
        this.data[7] = 0;
        this.data[8] = 0;
        this.data[9] = 0;
        this.data[11] = -1;
        this.data[12] = 0;
        this.data[13] = 0;
        this.data[15] = 0;
        if (far != null && far !== Infinity) {
            nf = 1 / (near - far);
            this.data[10] = (far + near) * nf;
            this.data[14] = 2 * far * near * nf;
        }
        else {
            this.data[10] = -1;
            this.data[14] = -2 * near;
        }
    }
    setTranslate(vec) {
        this.setIdtt();
        this.data[12] = vec.data[0];
        this.data[13] = vec.data[1];
        this.data[14] = vec.data[2];
    }
    invert() {
        let inv = new mtrx4();
        let i, det;
        inv.data[0] = this.data[5] * this.data[10] * this.data[15] -
            this.data[5] * this.data[11] * this.data[14] -
            this.data[9] * this.data[6] * this.data[15] +
            this.data[9] * this.data[7] * this.data[14] +
            this.data[13] * this.data[6] * this.data[11] -
            this.data[13] * this.data[7] * this.data[10];
        inv.data[4] = -this.data[4] * this.data[10] * this.data[15] +
            this.data[4] * this.data[11] * this.data[14] +
            this.data[8] * this.data[6] * this.data[15] -
            this.data[8] * this.data[7] * this.data[14] -
            this.data[12] * this.data[6] * this.data[11] +
            this.data[12] * this.data[7] * this.data[10];
        inv.data[8] = this.data[4] * this.data[9] * this.data[15] -
            this.data[4] * this.data[11] * this.data[13] -
            this.data[8] * this.data[5] * this.data[15] +
            this.data[8] * this.data[7] * this.data[13] +
            this.data[12] * this.data[5] * this.data[11] -
            this.data[12] * this.data[7] * this.data[9];
        inv.data[12] = -this.data[4] * this.data[9] * this.data[14] +
            this.data[4] * this.data[10] * this.data[13] +
            this.data[8] * this.data[5] * this.data[14] -
            this.data[8] * this.data[6] * this.data[13] -
            this.data[12] * this.data[5] * this.data[10] +
            this.data[12] * this.data[6] * this.data[9];
        inv.data[1] = -this.data[1] * this.data[10] * this.data[15] +
            this.data[1] * this.data[11] * this.data[14] +
            this.data[9] * this.data[2] * this.data[15] -
            this.data[9] * this.data[3] * this.data[14] -
            this.data[13] * this.data[2] * this.data[11] +
            this.data[13] * this.data[3] * this.data[10];
        inv.data[5] = this.data[0] * this.data[10] * this.data[15] -
            this.data[0] * this.data[11] * this.data[14] -
            this.data[8] * this.data[2] * this.data[15] +
            this.data[8] * this.data[3] * this.data[14] +
            this.data[12] * this.data[2] * this.data[11] -
            this.data[12] * this.data[3] * this.data[10];
        inv.data[9] = -this.data[0] * this.data[9] * this.data[15] +
            this.data[0] * this.data[11] * this.data[13] +
            this.data[8] * this.data[1] * this.data[15] -
            this.data[8] * this.data[3] * this.data[13] -
            this.data[12] * this.data[1] * this.data[11] +
            this.data[12] * this.data[3] * this.data[9];
        inv.data[13] = this.data[0] * this.data[9] * this.data[14] -
            this.data[0] * this.data[10] * this.data[13] -
            this.data[8] * this.data[1] * this.data[14] +
            this.data[8] * this.data[2] * this.data[13] +
            this.data[12] * this.data[1] * this.data[10] -
            this.data[12] * this.data[2] * this.data[9];
        inv.data[2] = this.data[1] * this.data[6] * this.data[15] -
            this.data[1] * this.data[7] * this.data[14] -
            this.data[5] * this.data[2] * this.data[15] +
            this.data[5] * this.data[3] * this.data[14] +
            this.data[13] * this.data[2] * this.data[7] -
            this.data[13] * this.data[3] * this.data[6];
        inv.data[6] = -this.data[0] * this.data[6] * this.data[15] +
            this.data[0] * this.data[7] * this.data[14] +
            this.data[4] * this.data[2] * this.data[15] -
            this.data[4] * this.data[3] * this.data[14] -
            this.data[12] * this.data[2] * this.data[7] +
            this.data[12] * this.data[3] * this.data[6];
        inv.data[10] = this.data[0] * this.data[5] * this.data[15] -
            this.data[0] * this.data[7] * this.data[13] -
            this.data[4] * this.data[1] * this.data[15] +
            this.data[4] * this.data[3] * this.data[13] +
            this.data[12] * this.data[1] * this.data[7] -
            this.data[12] * this.data[3] * this.data[5];
        inv.data[14] = -this.data[0] * this.data[5] * this.data[14] +
            this.data[0] * this.data[6] * this.data[13] +
            this.data[4] * this.data[1] * this.data[14] -
            this.data[4] * this.data[2] * this.data[13] -
            this.data[12] * this.data[1] * this.data[6] +
            this.data[12] * this.data[2] * this.data[5];
        inv.data[3] = -this.data[1] * this.data[6] * this.data[11] +
            this.data[1] * this.data[7] * this.data[10] +
            this.data[5] * this.data[2] * this.data[11] -
            this.data[5] * this.data[3] * this.data[10] -
            this.data[9] * this.data[2] * this.data[7] +
            this.data[9] * this.data[3] * this.data[6];
        inv.data[7] = this.data[0] * this.data[6] * this.data[11] -
            this.data[0] * this.data[7] * this.data[10] -
            this.data[4] * this.data[2] * this.data[11] +
            this.data[4] * this.data[3] * this.data[10] +
            this.data[8] * this.data[2] * this.data[7] -
            this.data[8] * this.data[3] * this.data[6];
        inv.data[11] = -this.data[0] * this.data[5] * this.data[11] +
            this.data[0] * this.data[7] * this.data[9] +
            this.data[4] * this.data[1] * this.data[11] -
            this.data[4] * this.data[3] * this.data[9] -
            this.data[8] * this.data[1] * this.data[7] +
            this.data[8] * this.data[3] * this.data[5];
        inv.data[15] = this.data[0] * this.data[5] * this.data[10] -
            this.data[0] * this.data[6] * this.data[9] -
            this.data[4] * this.data[1] * this.data[10] +
            this.data[4] * this.data[2] * this.data[9] +
            this.data[8] * this.data[1] * this.data[6] -
            this.data[8] * this.data[2] * this.data[5];
        det = this.data[0] * inv.data[0] + this.data[1] * inv.data[4] + this.data[2] * inv.data[8] + this.data[3] * inv.data[12];
        if (det == 0) {
            this.setIdtt();
            return;
        }
        det = 1.0 / det;
        for (i = 0; i < 16; i++)
            this.data[i] = inv.data[i] * det;
    }
    transpose() {
        let tmp = new mtrx4;
        tmp.data[0] = this.data[0];
        tmp.data[1] = this.data[4];
        tmp.data[2] = this.data[8];
        tmp.data[3] = this.data[12];
        tmp.data[4] = this.data[1];
        tmp.data[5] = this.data[5];
        tmp.data[6] = this.data[9];
        tmp.data[7] = this.data[13];
        tmp.data[8] = this.data[2];
        tmp.data[9] = this.data[6];
        tmp.data[10] = this.data[10];
        tmp.data[11] = this.data[14];
        tmp.data[12] = this.data[3];
        tmp.data[13] = this.data[7];
        tmp.data[14] = this.data[11];
        tmp.data[15] = this.data[15];
        for (let i = 0; i < 16; i++) {
            this.data[i] = tmp.data[i];
        }
    }
    setAxisAngl(axis, phi) {
        let cosphi, sinphi, vxvy, vxvz, vyvz, vx, vy, vz;
        let ax = new vec3();
        ax = vec3Normalize(axis);
        cosphi = Math.cos(phi);
        sinphi = Math.sin(phi);
        vxvy = ax.data[0] * ax.data[1];
        vxvz = ax.data[0] * ax.data[2];
        vyvz = ax.data[1] * ax.data[2];
        vx = ax.data[0];
        vy = ax.data[1];
        vz = ax.data[2];
        this.data[0] = cosphi + (1.0 - cosphi) * vx * vx;
        this.data[1] = (1.0 - cosphi) * vxvy - sinphi * vz;
        this.data[2] = (1.0 - cosphi) * vxvz + sinphi * vy;
        this.data[3] = 0.0;
        this.data[4] = (1.0 - cosphi) * vxvy + sinphi * vz;
        this.data[5] = cosphi + (1.0 - cosphi) * vy * vy;
        this.data[6] = (1.0 - cosphi) * vyvz - sinphi * vx;
        this.data[7] = 0.0;
        this.data[8] = (1.0 - cosphi) * vxvz - sinphi * vy;
        this.data[9] = (1.0 - cosphi) * vyvz + sinphi * vx;
        this.data[10] = cosphi + (1.0 - cosphi) * vz * vz;
        this.data[11] = 0.0;
        this.data[12] = 0.0;
        this.data[13] = 0.0;
        this.data[14] = 0.0;
        this.data[15] = 1.0;
    }
    setEuler(yaw, pitch, roll) {
        let cosy, siny, cosp, sinp, cosr, sinr;
        cosy = Math.cos(yaw);
        siny = Math.sin(yaw);
        cosp = Math.cos(pitch);
        sinp = Math.sin(pitch);
        cosr = Math.cos(roll);
        sinr = Math.sin(roll);
        this.data[0] = cosy * cosr - siny * cosp * sinr;
        this.data[1] = -cosy * sinr - siny * cosp * cosr;
        this.data[2] = siny * sinp;
        this.data[3] = 0.0;
        this.data[4] = siny * cosr + cosy * cosp * sinr;
        this.data[5] = -siny * sinr + cosy * cosp * cosr;
        this.data[6] = -cosy * sinp;
        this.data[7] = 0.0;
        this.data[8] = sinp * sinr;
        this.data[9] = sinp * cosr;
        this.data[10] = cosp;
        this.data[11] = 0.0;
        this.data[12] = 0.0;
        this.data[13] = 0.0;
        this.data[14] = 0.0;
        this.data[15] = 1.0;
    }
    multTranslate(a, v) {
        let x = v[0], y = v[1], z = v[2];
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        if (a.data === this.data) {
            this.data[12] = a.data[0] * x + a.data[4] * y + a.data[8] * z + a.data[12];
            this.data[13] = a.data[1] * x + a.data[5] * y + a.data[9] * z + a.data[13];
            this.data[14] = a.data[2] * x + a.data[6] * y + a.data[10] * z + a.data[14];
            this.data[15] = a.data[3] * x + a.data[7] * y + a.data[11] * z + a.data[15];
        }
        else {
            a00 = a.data[0];
            a01 = a.data[1];
            a02 = a.data[2];
            a03 = a.data[3];
            a10 = a.data[4];
            a11 = a.data[5];
            a12 = a.data[6];
            a13 = a.data[7];
            a20 = a.data[8];
            a21 = a.data[9];
            a22 = a.data[10];
            a23 = a.data[11];
            this.data[0] = a00;
            this.data[1] = a01;
            this.data[2] = a02;
            this.data[3] = a03;
            this.data[4] = a10;
            this.data[5] = a11;
            this.data[6] = a12;
            this.data[7] = a13;
            this.data[8] = a20;
            this.data[9] = a21;
            this.data[10] = a22;
            this.data[11] = a23;
            this.data[12] = a00 * x + a10 * y + a20 * z + a.data[12];
            this.data[13] = a01 * x + a11 * y + a21 * z + a.data[13];
            this.data[14] = a02 * x + a12 * y + a22 * z + a.data[14];
            this.data[15] = a03 * x + a13 * y + a23 * z + a.data[15];
        }
    }
}
function mtrx4Transpose(m) {
    const mrange = 4;
    let i, j, tmp;
    let rt = new mtrx4(m);
    for (i = 0; i < mrange; i++) {
        for (j = 0; j < i; j++) {
            tmp = rt.data[idRw(i, i, mrange)];
            rt.data[idRw(i, j, mrange)] = rt.data[idRw(j, i, mrange)];
            rt.data[idRw(j, i, mrange)] = tmp;
        }
    }
    return rt;
}
function mtrx4Mult(a, b) {
    const mrange = 4;
    let i, j, k, tmp;
    let rt = new mtrx4();
    for (i = 0; i < mrange; i++) {
        for (j = 0; j < mrange; j++) {
            tmp = 0.0;
            for (k = 0; k < mrange; k++) {
                tmp = tmp + a.data[(idRw(k, j, mrange))] * b.data[(idRw(i, k, mrange))];
            }
            rt.data[(idRw(i, j, mrange))] = tmp;
        }
    }
    return rt;
}
class vec2 {
    constructor(x, y) {
        this.order = 2;
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
function vec2Normalize(v) {
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
class vec3 {
    constructor(x, y, z) {
        this.order = 3;
        if (x instanceof vec3) {
            this.data = new Float32Array(3);
            this.fromVec3(x);
        }
        else {
            this.data = new Float32Array(3);
            this.data[0] = x || 0.0;
            this.data[1] = y || 0.0;
            this.data[2] = z || 0.0;
        }
    }
    fromVec3(src) {
        this.data[0] = src.data[0];
        this.data[1] = src.data[1];
        this.data[2] = src.data[2];
    }
    lenght() {
        return Math.sqrt(this.data[0] * this.data[0] +
            this.data[1] * this.data[1] +
            this.data[2] * this.data[2]);
    }
    normalize() {
        let len;
        len = this.lenght();
        if (len != 0.0) {
            this.data[0] = this.data[0] / len;
            this.data[1] = this.data[1] / len;
            this.data[2] = this.data[2] / len;
        }
    }
    scale(scale) {
        this.data[0] = this.data[0] * scale;
        this.data[1] = this.data[1] * scale;
        this.data[2] = this.data[2] * scale;
    }
    invert() {
        this.data[0] = -this.data[0];
        this.data[1] = -this.data[1];
        this.data[2] = -this.data[2];
    }
}
function vec3Set(x, y, z) {
    let rt = new vec3;
    rt.data[0] = x;
    rt.data[1] = y;
    rt.data[2] = z;
    return rt;
}
function vec3Cross(a, b) {
    let rt = new vec3();
    rt.data[0] = a.data[1] * b.data[2] - a.data[2] * b.data[1];
    rt.data[1] = a.data[2] * b.data[0] - a.data[0] * b.data[2];
    rt.data[2] = a.data[0] * b.data[1] - a.data[1] * b.data[0];
    return rt;
}
function vec3Normalize(v) {
    let rt = new vec3();
    let len;
    len = v.lenght();
    if (len > fEPS) {
        rt.data[0] = v.data[0] / len;
        rt.data[1] = v.data[1] / len;
        rt.data[2] = v.data[2] / len;
    }
    return rt;
}
function vec3Scale(v, scale) {
    let rt = new vec3();
    rt.data[0] = v.data[0] * scale;
    rt.data[1] = v.data[1] * scale;
    rt.data[2] = v.data[2] * scale;
    return rt;
}
function vec3Invert(v) {
    let rt = new vec3;
    rt.data[0] = -v.data[0];
    rt.data[1] = -v.data[1];
    rt.data[2] = -v.data[2];
    return rt;
}
function vec3Dot(a, b) {
    return a.data[0] * b.data[0] + a.data[1] * b.data[1] + a.data[2] * b.data[2];
}
function vec3Sum(a, b) {
    let rt = new vec3;
    rt.data[0] = a.data[0] + b.data[0];
    rt.data[1] = a.data[1] + b.data[1];
    rt.data[2] = a.data[2] + b.data[2];
    return rt;
}
function vec3Sub(a, b) {
    let rt = new vec3;
    rt.data[0] = a.data[0] - b.data[0];
    rt.data[1] = a.data[1] - b.data[1];
    rt.data[2] = a.data[2] - b.data[2];
    return rt;
}
class qtnn {
    constructor(x, y, z, w) {
        this.order = 4;
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
        let ax = new vec3();
        ax = vec3Normalize(axis);
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
const fEPS = 0.000001;
function degToRad(deg) {
    return deg * Math.PI / 180.0;
}
function idRw(i, j, n) {
    return (i * n + j);
}
;
function idCw(i, j, n) {
    return (j * n + i);
}
;
