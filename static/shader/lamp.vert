#version 100
attribute vec3 in_position;
attribute vec2 in_tex_coords;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;
varying vec2 v_tex_coords;
void main() {
    v_tex_coords = in_tex_coords;
    gl_Position = u_proj * u_view * u_model * vec4(in_position, 1.0);
}