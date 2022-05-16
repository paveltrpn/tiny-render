import * as alg from "./algebra/algebra.js";
import { glProgram_c } from "./shaders.js";
import * as gmtry from "./geometry.js";
let gl_vert_buf;
let gl_normal_buf;
let gl_color_buf;
let prog;
export let gl;
let globAppState = {
    glc: null,
    width: 0,
    height: 0,
    aspect: 0
};
let box;
async function initGlobalAppState(state) {
    const canvas_id = "#glcanvas";
    const text_field = "log_out";
    let html_canvas = document.querySelector(canvas_id);
    state.glc = gl = html_canvas.getContext('webgl2', { antialias: true, depth: true });
    console.log(gl);
    state.width = gl.drawingBufferWidth;
    state.height = gl.drawingBufferHeight;
    state.aspect = state.width / state.height;
    if (!gl) {
        alert('cube_c::setup(): Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }
    let log_out = document.getElementById(text_field);
    log_out.innerText = gl.getParameter(gl.VERSION) + "; " +
        gl.getParameter(gl.SHADING_LANGUAGE_VERSION) + "; " +
        gl.getParameter(gl.VENDOR);
    let gl_ext = gl.getSupportedExtensions();
    for (let i = 0; i < gl_ext.length; i++) {
        log_out.innerText = log_out.innerText + (gl_ext[i]) + " ;";
    }
}
async function initWGLState(state) {
    gl.viewport(0, 0, state.width, state.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clearDepth(1.0);
    prog = new glProgram_c(gl);
    await prog.initShaderProgram("vert.glsl", "frag.glsl");
    box = new gmtry.gmtryInstance_c();
    box.dummyInit();
    gl_vert_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_vert_buf);
    gl.bufferData(gl.ARRAY_BUFFER, box.vertices, gl.STATIC_DRAW);
    let vertexPosition = gl.getAttribLocation(prog.program, 'aVertexPosition');
    gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);
    gl_normal_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_normal_buf);
    gl.bufferData(gl.ARRAY_BUFFER, box.normals, gl.STATIC_DRAW);
    let vertexNormal = gl.getAttribLocation(prog.program, 'aVertexNormal');
    gl.vertexAttribPointer(vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexNormal);
    gl_color_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_color_buf);
    gl.bufferData(gl.ARRAY_BUFFER, box.colors, gl.STATIC_DRAW);
    let vertexColor = gl.getAttribLocation(prog.program, 'aVertexColor');
    gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColor);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
}
(async function main() {
    await initGlobalAppState(globAppState);
    await initWGLState(globAppState);
    let projectionMatrix = new alg.mtrx4();
    projectionMatrix.setPerspective(alg.degToRad(45), globAppState.aspect, 0.1, 100.0);
    let transMtrx = new alg.mtrx4();
    transMtrx.setTranslate(new alg.vec3(0.0, 0.0, -7.0));
    projectionMatrix.mult(transMtrx);
    let fooQtnn = new alg.qtnn();
    fooQtnn.setAxisAngl(new alg.vec3(0.1, 0.4, 0.3), alg.degToRad(1));
    let rot = new alg.mtrx4();
    rot.fromQtnn(fooQtnn);
    let rot_trans = rot;
    function loop() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        prog.use();
        prog.passMatrix4fv('uProjectionMatrix', projectionMatrix);
        box.applyMtrx4ToVerts(rot);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl_vert_buf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, box.vertices);
        box.applyMtrx4ToNormals(rot_trans);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl_normal_buf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, box.normals);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();
