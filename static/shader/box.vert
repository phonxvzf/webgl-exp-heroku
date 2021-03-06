attribute vec3 in_position;
attribute vec2 in_tex_coords;
attribute vec3 in_normal;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;
varying vec2 v_tex_coords;
varying vec3 v_normal;
varying vec3 v_frag_pos;
void main() {
    v_tex_coords = in_tex_coords;
    v_normal = (u_model * vec4(in_normal, 1.0)).xyz;
    v_frag_pos = (u_model * vec4(in_position, 1.0)).xyz;
    gl_Position = u_proj * u_view * u_model * vec4(in_position, 1.0);
}
