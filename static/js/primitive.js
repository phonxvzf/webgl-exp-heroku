class WorldEntity {
    constructor(position) {
        this.modelMatrix = mat4.create();
        this.pos = position;
    }

    get position() {
        return this.pos;
    }

    set position(newPos) {
        this.pos = newPos;
        mat4.fromTranslation(this.modelMatrix, newPos);
    }
}

class Box extends WorldEntity {
    constructor(gl, position, programInfo, texture, vertices) {
        super(position);
        this.buffer = gl.createBuffer();
        this.programInfo = programInfo;
        this.texture = texture;
        const program = programInfo.program;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }
}

class NormalBox extends Box {
    constructor(gl, position, programInfo, texture, vertices) {
        super(gl, position, programInfo, texture, vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        const program = programInfo.program;
        const positionLoc = gl.getAttribLocation(program, "in_position");
        const texCoordLoc = gl.getAttribLocation(program, "in_tex_coords");
        const normLoc = gl.getAttribLocation(program, "in_normal");
        // position
        gl.vertexAttribPointer(
            positionLoc,
            3,
            gl.FLOAT,
            false,
            32,
            0
        );
        gl.enableVertexAttribArray(positionLoc);
        // texture coordinates
        gl.vertexAttribPointer(
            texCoordLoc,
            2,
            gl.FLOAT,
            false,
            32,
            12
        );
        gl.enableVertexAttribArray(texCoordLoc);
        // normal vectors
        gl.vertexAttribPointer(
            normLoc,
            3,
            gl.FLOAT,
            false,
            32,
            20
        );
        gl.enableVertexAttribArray(normLoc);
    }

    draw(gl, camera, lamp) {
        const programInfo = this.programInfo;
        gl.useProgram(programInfo.program);

        gl.uniform1i(programInfo.u_sampler_loc, 0);
        gl.uniformMatrix4fv(programInfo.u_model_loc, false, this.modelMatrix);
        gl.uniformMatrix4fv(programInfo.u_view_loc, false, camera.viewMatrix);
        gl.uniformMatrix4fv(programInfo.u_proj_loc, false, camera.projMatrix);
        gl.uniform4fv(programInfo.u_light_clr_loc, lamp.lightColor);
        gl.uniform3fv(programInfo.u_light_pos_loc, lamp.position);
        gl.uniform3fv(programInfo.u_cam_pos_loc, camera.position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
}

class Lamp extends Box {
    constructor(gl, position, programInfo, vertices, lightColor) {
        super(gl, position, programInfo, new Texture(gl, null, lightColor), vertices);
        this.color = lightColor;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        const program = programInfo.program;
        const positionLoc = gl.getAttribLocation(program, "in_position");
        const texCoordLoc = gl.getAttribLocation(program, "in_tex_coords");
        // position
        gl.vertexAttribPointer(
            positionLoc,
            3,
            gl.FLOAT,
            false,
            20,
            0
        );
        gl.enableVertexAttribArray(positionLoc);
        // texture coordinates
        gl.vertexAttribPointer(
            texCoordLoc,
            2,
            gl.FLOAT,
            false,
            20,
            12
        );
        gl.enableVertexAttribArray(texCoordLoc);
    }

    get lightColor() { return this.color.map(clr => clr / 255); }

    draw(gl, camera) {
        const programInfo = this.programInfo;
        gl.useProgram(programInfo.program);

        gl.uniform1i(programInfo.u_sampler_loc, 0);
        gl.uniformMatrix4fv(programInfo.u_model_loc, false, this.modelMatrix);
        gl.uniformMatrix4fv(programInfo.u_view_loc, false, camera.viewMatrix);
        gl.uniformMatrix4fv(programInfo.u_proj_loc, false, camera.projMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawArrays(gl.TRIANGLES, 0, 36); // 36 vertices!
    }
}