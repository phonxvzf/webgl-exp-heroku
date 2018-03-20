var shaderCodes = {};
function loadShader(gl, type, src) {
    const shaderObject = gl.createShader(type);
    gl.shaderSource(shaderObject, src);
    gl.compileShader(shaderObject);
    if (!gl.getShaderParameter(shaderObject, gl.COMPILE_STATUS)) {
        alert("Shader compilation error: " + gl.getShaderInfoLog(shaderObject));
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
        alert("Shader program linking error: " + gl.getProgramInfoLog(shaderProgram));
    }
    return shaderProgram;
}