
import * as alg from "./algebra/algebra.js"
import { glProgram_c } from "./shaders.js"
import * as gmtry from "./geometry.js"

let gl_vert_buf: WebGLBuffer;
let gl_normal_buf: WebGLBuffer;
let gl_color_buf: WebGLBuffer;

let prog: glProgram_c

class appState_c {
    glc: WebGL2RenderingContext
    width: number
    height: number
    aspect: number
}

// Глобальный WebGL контекст
let gl: WebGL2RenderingContext;
let globAppState: appState_c = new appState_c()

async function initGlobalAppState(state: appState_c) {
    const canvas_id: string = "#glcanvas"
    const text_field: string = "log_out"

    let html_canvas: HTMLCanvasElement = document.querySelector(canvas_id);
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
}

async function initWGLState(state: appState_c) {
    gl.viewport(0, 0, state.width, state.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clearDepth(1.0);

    prog = new glProgram_c(gl)
    await prog.initShaderProgram("vert.glsl", "frag.glsl");

    let box: gmtry.gmtryInstance_c = new gmtry.gmtryInstance_c()
    box.dummyInit()

    gl_vert_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_vert_buf);
    gl.bufferData(gl.ARRAY_BUFFER, box.vertices, gl.STATIC_DRAW);

    // Normal buffer
    gl_normal_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_normal_buf);
    gl.bufferData(gl.ARRAY_BUFFER, box.normals, gl.STATIC_DRAW);

    // Now set up the colors for the vertices
    gl_color_buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_color_buf);
    gl.bufferData(gl.ARRAY_BUFFER, box.colors, gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    let vertexPosition = gl.getAttribLocation(prog.program, 'aVertexPosition')
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_vert_buf);
    gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    let vertexNormal = gl.getAttribLocation(prog.program, 'aVertexNormal')
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_normal_buf);
    gl.vertexAttribPointer(vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexNormal)
       
    let vertexColor = gl.getAttribLocation(prog.program, 'aVertexColor')
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_color_buf);
    gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColor);
}

(async function main() {
    let then: number = 0.0;
    let squareRotation: number = 0.0;
    
    await initGlobalAppState(globAppState)
    await initWGLState(globAppState)

    let projectionMatrix: alg.mtrx4 = new alg.mtrx4();
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

    function loop(now: any) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
        
        fooQtnn.setAxisAngl(new alg.vec3(0.1, 0.4, 0.3), squareRotation);
        rot.fromQtnn(fooQtnn);
        modelViewMatrix.mult(rot);
        normalMatrix.fromMtrx4(modelViewMatrix)
        normalMatrix.transpose();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        prog.use()

        prog.passMatrix4fv('uProjectionMatrix', projectionMatrix)
        prog.passMatrix4fv('uModelViewMatrix', modelViewMatrix)
        prog.passMatrix4fv('uNormalMatrix', normalMatrix)

        gl.drawArrays(gl.TRIANGLES, 0, 36);

        squareRotation += deltaTime;

        modelViewMatrix.setIdtt()
        modelViewMatrix.mult(transMtrx);
        
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})()
