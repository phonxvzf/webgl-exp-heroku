const BUFFER_WIDTH = 640, BUFFER_HEIGHT = 480;
const gl = require('gl')(BUFFER_WIDTH, BUFFER_HEIGHT);
const glMatrix = require('gl-matrix');
const fs = require('fs');
const PNG = require('node-png').PNG;

function loadShader(gl, type, src) {
    const shaderObject = gl.createShader(type);
    gl.shaderSource(shaderObject, src);
    gl.compileShader(shaderObject);
    if (!gl.getShaderParameter(shaderObject, gl.COMPILE_STATUS)) {
        console.log("Shader compilation error: " + gl.getShaderInfoLog(shaderObject));
        gl.deleteShader(shaderObject);
        return null;
    }
    return shaderObject;
}

function loadShaderProgram(gl, vert, frag) {
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vert);
    gl.attachShader(shaderProgram, frag);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("Shader program linking error: " + gl.getProgramInfoLog(shaderProgram));
    }
    return shaderProgram;
}

renderer = {
    vertexSampleCode: null,
    fragmentSampleCode: null,
    TRIANGLE_ATTRIBS: [
        0.0, 1.0, 0.0, 1.0, 0.0, 0.0,
        -1.0, -1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, -1.0, 0.0, 0.0, 0.0, 1.0
    ],
    FLIP_MATRIX: glMatrix.mat4.fromScaling(glMatrix.mat4.create(), [1, -1, 1]),
    trianglePGI: {
        program: null,
        a_position_loc: null,
    },
    renderTriangle: function() {
        gl.viewport(0, 0, BUFFER_WIDTH, BUFFER_HEIGHT);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.TRIANGLE_ATTRIBS), gl.STATIC_DRAW);
        gl.vertexAttribPointer(
            this.trianglePGI.a_position_loc,
            3,
            gl.FLOAT,
            false,
            24,
            0
        );
        gl.vertexAttribPointer(
            this.trianglePGI.a_color_loc,
            3,
            gl.FLOAT,
            false,
            24,
            12
        );
        gl.enableVertexAttribArray(this.trianglePGI.a_position_loc);
        gl.enableVertexAttribArray(this.trianglePGI.a_color_loc);

        gl.useProgram(this.trianglePGI.program);
        gl.uniformMatrix4fv(this.trianglePGI.u_scale_mat_loc, false, this.FLIP_MATRIX);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
        var pixels = new Uint8Array(BUFFER_WIDTH * BUFFER_HEIGHT * 4); // {r,g,b,a} -> 4 components per pixel
        gl.readPixels(0, 0, BUFFER_WIDTH, BUFFER_HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        gl.deleteBuffer(buffer);

        var png = new PNG({width: BUFFER_WIDTH, height: BUFFER_HEIGHT});
        png.data = Buffer.from(pixels);
        return png.pack();
    },
}

module.exports = function() {
    console.log('GL_VERSION: ', gl.getParameter(gl.GL_VERSION));
    console.log('GL_VENDOR: ', gl.getParameter(gl.GL_VENDOR));
    console.log('GL_SHADING_LANGUAGE_VERSION: ', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    renderer.vertexSampleCode = fs.readFileSync('static/shader/triangle.vert').toString();
    renderer.fragmentSampleCode = fs.readFileSync('static/shader/triangle.frag').toString();
    var program = loadShaderProgram(
        gl,
        loadShader(gl, gl.VERTEX_SHADER, renderer.vertexSampleCode),
        loadShader(gl, gl.FRAGMENT_SHADER, renderer.fragmentSampleCode)
    );
    renderer.trianglePGI.program = program;
    renderer.trianglePGI.a_position_loc = gl.getAttribLocation(program, "a_position");
    renderer.trianglePGI.a_color_loc = gl.getAttribLocation(program, "a_color");
    renderer.trianglePGI.u_scale_mat_loc = gl.getUniformLocation(program, "u_scale_mat");
    return renderer;
}

