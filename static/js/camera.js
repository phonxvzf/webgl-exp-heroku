class Camera {
    constructor(position, fov, aspect, near, far) {
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
        this.pos = position;
        mat4.perspective(
            this.projMatrix,
            glMatrix.toRadian(fov),
            aspect,
            near,
            far
        );
    }

    get position() { return this.pos; }

    set position(newPos) {
        this.pos = newPos;
        mat4.lookAt(this.viewMatrix, newPos, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
    }
}