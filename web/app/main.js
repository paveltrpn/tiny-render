var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as alg from "./algebra/algebra.js";
import { glProgram_c } from "./shaders.js";
import * as gmtry from "./geometry.js";
let gl_vert_buf;
let gl_normal_buf;
let gl_color_buf;
let prog;
class appState_c {
}
let gl;
let globAppState = new appState_c();
function initGlobalAppState(state) {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas_id = "#glcanvas";
        const text_field = "log_out";
        let html_canvas = document.querySelector(canvas_id);
        state.glc = gl = html_canvas.getContext('webgl2', { antialias: true, depth: true });
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
    });
}
function initWGLState(state) {
    return __awaiter(this, void 0, void 0, function* () {
        gl.viewport(0, 0, state.width, state.height);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clearDepth(1.0);
        prog = new glProgram_c(gl);
        yield prog.initShaderProgram("vert.glsl", "frag.glsl");
        let box = new gmtry.gmtryInstance_c();
        box.dummyInit();
        gl_vert_buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gl_vert_buf);
        gl.bufferData(gl.ARRAY_BUFFER, box.vertices, gl.STATIC_DRAW);
        gl_normal_buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gl_normal_buf);
        gl.bufferData(gl.ARRAY_BUFFER, box.normals, gl.STATIC_DRAW);
        gl_color_buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gl_color_buf);
        gl.bufferData(gl.ARRAY_BUFFER, box.colors, gl.STATIC_DRAW);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        let vertexPosition = gl.getAttribLocation(prog.program, 'aVertexPosition');
        gl.bindBuffer(gl.ARRAY_BUFFER, gl_vert_buf);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPosition);
        let vertexNormal = gl.getAttribLocation(prog.program, 'aVertexNormal');
        gl.bindBuffer(gl.ARRAY_BUFFER, gl_normal_buf);
        gl.vertexAttribPointer(vertexNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexNormal);
        let vertexColor = gl.getAttribLocation(prog.program, 'aVertexColor');
        gl.bindBuffer(gl.ARRAY_BUFFER, gl_color_buf);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexColor);
    });
}
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let then = 0.0;
        let squareRotation = 0.0;
        yield initGlobalAppState(globAppState);
        yield initWGLState(globAppState);
        let projectionMatrix = new alg.mtrx4();
        projectionMatrix.setPerspective(alg.degToRad(45), globAppState.aspect, 0.1, 100.0);
        let modelViewMatrix = new alg.mtrx4();
        let transMtrx = new alg.mtrx4();
        transMtrx.setTranslate(new alg.vec3(0.0, 0.0, -7.0));
        modelViewMatrix.mult(transMtrx);
        let fooQtnn = new alg.qtnn();
        fooQtnn.setAxisAngl(new alg.vec3(0.1, 0.4, 0.3), squareRotation);
        let rot = new alg.mtrx4();
        rot.fromQtnn(fooQtnn);
        modelViewMatrix.mult(rot);
        let normalMatrix = new alg.mtrx4(modelViewMatrix);
        normalMatrix.transpose();
        function loop(now) {
            now *= 0.001;
            const deltaTime = now - then;
            then = now;
            fooQtnn.setAxisAngl(new alg.vec3(0.1, 0.4, 0.3), squareRotation);
            rot.fromQtnn(fooQtnn);
            modelViewMatrix.mult(rot);
            normalMatrix.fromMtrx4(modelViewMatrix);
            normalMatrix.transpose();
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            prog.use();
            prog.passMatrix4fv('uProjectionMatrix', projectionMatrix);
            prog.passMatrix4fv('uModelViewMatrix', modelViewMatrix);
            prog.passMatrix4fv('uNormalMatrix', normalMatrix);
            gl.drawArrays(gl.TRIANGLES, 0, 36);
            squareRotation += deltaTime;
            modelViewMatrix.setIdtt();
            modelViewMatrix.mult(transMtrx);
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    });
})();
