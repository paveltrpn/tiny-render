export class glProgram_c {
    gl_ctx;
    program;
    constructor(ctx) {
        this.gl_ctx = ctx;
    }
    async fetchSourceFromServer(fname) {
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
    }
    async loadShader(type, fname) {
        let source = await this.fetchSourceFromServer(fname);
        const shader = this.gl_ctx.createShader(type);
        this.gl_ctx.shaderSource(shader, source);
        this.gl_ctx.compileShader(shader);
        if (!this.gl_ctx.getShaderParameter(shader, this.gl_ctx.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + this.gl_ctx.getShaderInfoLog(shader));
            this.gl_ctx.deleteShader(shader);
            return null;
        }
        return shader;
    }
    async initShaderProgram(vsSource, fsSource) {
        const vertexShader = await this.loadShader(this.gl_ctx.VERTEX_SHADER, vsSource);
        const fragmentShader = await this.loadShader(this.gl_ctx.FRAGMENT_SHADER, fsSource);
        this.program = this.gl_ctx.createProgram();
        this.gl_ctx.attachShader(this.program, vertexShader);
        this.gl_ctx.attachShader(this.program, fragmentShader);
        this.gl_ctx.linkProgram(this.program);
        if (!this.gl_ctx.getProgramParameter(this.program, this.gl_ctx.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + this.gl_ctx.getProgramInfoLog(this.program));
            return null;
        }
    }
    use() {
        this.gl_ctx.useProgram(this.program);
    }
    passMatrix4fv(name, param) {
        let location = this.gl_ctx.getUniformLocation(this.program, name);
        this.gl_ctx.uniformMatrix4fv(location, false, param.data);
    }
}
