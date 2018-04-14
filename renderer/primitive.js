const glMatrix = require('gl-matrix');
const Texture = require('./texture.js');

matrices = {
    FLIP_MATRIX: glMatrix.mat4.fromScaling(glMatrix.mat4.create(), [2, -2, 1]),
    KERNEL_NONE: new Float32Array([
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ]),
    KERNEL_SHARPEN: new Float32Array([
        -1, -1, -1,
        -1, 9, -1,
        -1, -1, -1
    ]),
    KERNEL_BLUR: new Float32Array([
        1/16, 2/16, 1/16,
        2/16, 4/16, 2/16,
        1/16, 2/16, 1/16
    ]),
    KERNEL_GAUSSIAN_BLUR: new Float32Array([
        0.111108,	0.111113,	0.111108,
        0.111113,	0.111118,	0.111113,
        0.111108,	0.111113,	0.111108,
    ]),
    KERNEL_EDGE_DETECTION: new Float32Array([
        1, 1, 1,
        1, -8, 1,
        1, 1, 1,
    ]),
}

class WorldEntity {
    constructor(position) {
        this.modelMatrix = glMatrix.mat4.create();
        this.pos = position;
        this.position = position;
    }

    get position() {
        return this.pos;
    }

    set position(newPos) {
        this.pos = newPos;
        glMatrix.mat4.fromTranslation(this.modelMatrix, newPos);
    }
}

class Triangle {
    constructor(gl, pgi, vertices) {
        this.buffer = gl.createBuffer();
        this.pgi = pgi;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(
            this.pgi.a_position_loc,
            3,
            gl.FLOAT,
            false,
            24,
            0
        );
        gl.enableVertexAttribArray(this.pgi.a_position_loc);
        gl.vertexAttribPointer(
            this.pgi.a_color_loc,
            3,
            gl.FLOAT,
            false,
            24,
            12
        );
        gl.enableVertexAttribArray(this.pgi.a_color_loc);
    }

    draw(gl) {
        gl.useProgram(this.pgi.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.uniformMatrix4fv(this.pgi.u_scale_mat_loc, false, matrices.FLIP_MATRIX);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

class Box extends WorldEntity {
    constructor(gl, position, pgi, texture, vertices) {
        super(position);
        this.buffer = gl.createBuffer();
        this.pgi = pgi;
        this.texture = texture;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }
}

class NormalBox extends Box {
    constructor(gl, position, pgi, texture, vertices) {
        super(gl, position, pgi, texture, vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        // position
        gl.vertexAttribPointer(
            pgi.in_position_loc,
            3,
            gl.FLOAT,
            false,
            32,
            0
        );
        gl.enableVertexAttribArray(pgi.in_position_loc);
        // texture coordinates
        gl.vertexAttribPointer(
            pgi.in_tex_coords_loc,
            2,
            gl.FLOAT,
            false,
            32,
            12
        );
        gl.enableVertexAttribArray(pgi.in_tex_coords_loc);
        // normal vectors
        gl.vertexAttribPointer(
            pgi.in_normal_loc,
            3,
            gl.FLOAT,
            false,
            32,
            20
        );
        gl.enableVertexAttribArray(pgi.in_normal_loc);
    }

    draw(gl, camera, lamp) {
        gl.useProgram(this.pgi.program);

        gl.uniform1i(this.pgi.u_sampler_loc, 0);
        gl.uniformMatrix4fv(this.pgi.u_model_loc, false, this.modelMatrix);
        gl.uniformMatrix4fv(this.pgi.u_view_loc, false, camera.viewMatrix);
        gl.uniformMatrix4fv(this.pgi.u_proj_loc, false, camera.projMatrix);
        gl.uniform3fv(this.pgi.u_light_clr_loc, lamp.lightColor);
        gl.uniform3fv(this.pgi.u_light_pos_loc, lamp.position);
        gl.uniform3fv(this.pgi.u_cam_pos_loc, camera.position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.activeTexture(gl.TEXTURE0);
        this.texture.bind(gl);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}

class Lamp extends Box {
    constructor(gl, position, pgi, vertices, lightColor) {
        super(gl, position, pgi, null, vertices);
        this.color = lightColor;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        // position
        gl.vertexAttribPointer(
            pgi.in_position_loc,
            3,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(pgi.in_position_loc);
    }

    get lightColor() { return this.color.map(clr => clr / 255); }

    draw(gl, camera) {
        gl.useProgram(this.pgi.program);

        gl.uniformMatrix4fv(this.pgi.u_model_loc, false, this.modelMatrix);
        gl.uniformMatrix4fv(this.pgi.u_view_loc, false, camera.viewMatrix);
        gl.uniformMatrix4fv(this.pgi.u_proj_loc, false, camera.projMatrix);
        gl.uniform3fv(this.pgi.u_color_loc, this.lightColor);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.drawArrays(gl.TRIANGLES, 0, 36); // 36 vertices!
    }
}

class FrameQuad {
    constructor(gl, pgi, vertices) {
        this.buffer = gl.createBuffer();
        this.pgi = pgi;
        this.kernel = matrices.KERNEL_NONE;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        // position
        gl.vertexAttribPointer(
            pgi.in_position_loc,
            2,
            gl.FLOAT,
            false,
            16,
            0
        );
        gl.enableVertexAttribArray(pgi.in_position_loc);
        // texture coordinates
        gl.vertexAttribPointer(
            pgi.in_tex_coords_loc,
            2,
            gl.FLOAT,
            false,
            16,
            8
        );
        gl.enableVertexAttribArray(pgi.in_tex_coords_loc);
    }

    draw(gl) {
        gl.useProgram(this.pgi.program);

        gl.uniform1i(this.pgi.u_sampler_loc, 0);
        gl.uniformMatrix4fv(this.pgi.u_flip_mat_loc, false, matrices.FLIP_MATRIX);
        gl.uniformMatrix3fv(this.pgi.u_kernel_loc, false, this.kernel);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

module.exports = {
    WorldEntity : WorldEntity,
    Box : Box,
    NormalBox : NormalBox,
    Lamp : Lamp,
    Triangle : Triangle,
    FrameQuad : FrameQuad,
    MATRICES : matrices,
}
