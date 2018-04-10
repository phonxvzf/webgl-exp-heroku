attribute vec2 in_position;
attribute vec2 in_tex_coords;

uniform mat4 u_flip_mat;

varying vec2 v_tex_coords;

void main() {
    v_tex_coords = in_tex_coords;
    gl_Position = u_flip_mat * vec4(in_position, 0.0, 1.0);
}
