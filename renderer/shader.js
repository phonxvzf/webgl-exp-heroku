class Shader {
    loadShader(gl, type, src) {
        const shaderObject = gl.createShader(type);
        gl.shaderSource(shaderObject, src);
        gl.compileShader(shaderObject);
        if (!gl.getShaderParameter(shaderObject, gl.COMPILE_STATUS)) {
            var fname = this.vertPath;
            if (type == gl.FRAGMENT_SHADER) {
                fname = this.fragPath;
            }
            console.log("In file: " + fname);
            console.log("Shader compilation error: " + gl.getShaderInfoLog(shaderObject));
            gl.deleteShader(shaderObject);
            return null;
        }
        return shaderObject;
    }

    loadShaderProgram(gl, vert, frag) {
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vert);
        gl.attachShader(shaderProgram, frag);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.log("Shader program linking error: " + gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        return shaderProgram;
    }

    constructor(gl, vert, frag, attrList, uniList) {
        this.vertPath = vert;
        this.fragPath = frag;
        this.pgi = {};
        this.pgi.program = this.loadShaderProgram(
            gl,
            this.loadShader(gl, gl.VERTEX_SHADER, vert),
            this.loadShader(gl, gl.FRAGMENT_SHADER, frag)
        )
        // initialize token locations
        if (attrList) {
            attrList.forEach((item) => {
                this.pgi[item+"_loc"] = gl.getAttribLocation(this.pgi.program, item);
            });
        }
        if (uniList) {
            uniList.forEach((item) => {
                this.pgi[item+"_loc"] = gl.getUniformLocation(this.pgi.program, item);
            });
        }
    }
}

module.exports = Shader;
