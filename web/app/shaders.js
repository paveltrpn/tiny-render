var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class glProgram_c {
    constructor(ctx) {
        this.gl_ctx = ctx;
    }
    fetchSourceFromServer(fname) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/plain',
                }
            };
            try {
                return fetch(fname, options).
                    then((response) => { return response.text(); });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    loadShader(type, fname) {
        return __awaiter(this, void 0, void 0, function* () {
            let source = yield this.fetchSourceFromServer(fname);
            const shader = this.gl_ctx.createShader(type);
            this.gl_ctx.shaderSource(shader, source);
            this.gl_ctx.compileShader(shader);
            if (!this.gl_ctx.getShaderParameter(shader, this.gl_ctx.COMPILE_STATUS)) {
                alert('An error occurred compiling the shaders: ' + this.gl_ctx.getShaderInfoLog(shader));
                this.gl_ctx.deleteShader(shader);
                return null;
            }
            return shader;
        });
    }
    initShaderProgram(vsSource, fsSource) {
        return __awaiter(this, void 0, void 0, function* () {
            const vertexShader = yield this.loadShader(this.gl_ctx.VERTEX_SHADER, vsSource);
            const fragmentShader = yield this.loadShader(this.gl_ctx.FRAGMENT_SHADER, fsSource);
            this.program = this.gl_ctx.createProgram();
            this.gl_ctx.attachShader(this.program, vertexShader);
            this.gl_ctx.attachShader(this.program, fragmentShader);
            this.gl_ctx.linkProgram(this.program);
            if (!this.gl_ctx.getProgramParameter(this.program, this.gl_ctx.LINK_STATUS)) {
                alert('Unable to initialize the shader program: ' + this.gl_ctx.getProgramInfoLog(this.program));
                return null;
            }
        });
    }
    use() {
        this.gl_ctx.useProgram(this.program);
    }
    passMatrix4fv(name, param) {
        let location = this.gl_ctx.getUniformLocation(this.program, name);
        this.gl_ctx.uniformMatrix4fv(location, false, param.data);
    }
}
