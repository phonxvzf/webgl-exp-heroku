const glMatrix = require('gl-matrix');
class Camera {
    constructor(position, fov, aspect, near, far) {
        this.viewMatrix = glMatrix.mat4.create();
        this.projMatrix = glMatrix.mat4.create();
        this.pos = position;
        this.position = position;
        glMatrix.mat4.perspective(
            this.projMatrix,
            glMatrix.glMatrix.toRadian(fov),
            aspect,
            near,
            far
        );
    }

    get position() { return this.pos; }

    set position(newPos) {
        this.pos = newPos;
        glMatrix.mat4.lookAt(this.viewMatrix, newPos, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    }
}

module.exports = Camera;
