attribute vec3 a_position;
attribute vec3 a_color;
uniform mat4 u_scale_mat;
varying vec3 v_color;
void main() {
    v_color = a_color;
    gl_Position = u_scale_mat * vec4(a_position, 1.0);
}
