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
import { shader_c } from "./shaders.js";
import { positions, normals, colors } from "./geometry.js";
let gl;
class cube_c {
    constructor() {
        this.squareRotation = 0.0;
    }
    setup(canvas, text_field) {
        return __awaiter(this, void 0, void 0, function* () {
            let html_canvas = document.querySelector(canvas);
            gl = html_canvas.getContext('webgl2', { antialias: true, depth: true });
            this.wnd_width = gl.drawingBufferWidth;
            this.wnd_height = gl.drawingBufferHeight;
            this.aspect = this.wnd_width / this.wnd_height;
            if (!gl) {
                alert('cube_c::setup(): Unable to initialize WebGL. Your browser or machine may not support it.');
                return;
            }
            let vsSource = new shader_c();
            yield vsSource.fetchSourceFromServer("vert.glsl");
            let fsSource = new shader_c();
            yield fsSource.fetchSourceFromServer("frag.glsl");
            this.gl_shader = this.initShaderProgram(vsSource.source, fsSource.source);
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
        });
    }
    render(deltaTime) {
        gl.viewport(0, 0, this.wnd_width, this.wnd_height);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        let projectionMatrix = new alg.mtrx4();
        projectionMatrix.setPerspective(alg.degToRad(45), this.aspect, 0.1, 100.0);
        let modelViewMatrix = new alg.mtrx4();
        let transMtrx = new alg.mtrx4;
        transMtrx.setTranslate(new alg.vec3(0.0, 0.0, -7.0));
        modelViewMatrix.mult(transMtrx);
        let fooQtnn = new alg.qtnn();
        fooQtnn.setAxisAngl(new alg.vec3(0.1, 0.4, 0.3), this.squareRotation);
        let rot = new alg.mtrx4();
        rot.fromQtnn(fooQtnn);
        modelViewMatrix.mult(rot);
        let normalMatrix = new alg.mtrx4(modelViewMatrix);
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
(function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let app = new cube_c();
        let then = 0.0;
        yield app.setup("#glcanvas", "log_out");
        function render(now) {
            now *= 0.001;
            const deltaTime = now - then;
            then = now;
            app.render(deltaTime);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    });
})();
