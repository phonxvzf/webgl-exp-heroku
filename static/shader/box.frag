precision highp float;
varying vec2 v_tex_coords;
varying vec3 v_normal;
varying vec3 v_frag_pos;
uniform sampler2D u_sampler;
uniform vec3 u_light_clr;
uniform vec3 u_light_pos;
uniform vec3 u_cam_pos;
void main() {
    vec3 light_dir = normalize(u_light_pos - v_frag_pos);
    vec3 view_dir = normalize(u_cam_pos - v_frag_pos);
    vec3 normal = normalize(v_normal);
    float ambient_str = 0.2;
    float specular_str = 0.3;
    vec3 ambient = ambient_str * u_light_clr;
    vec3 diffuse = max(dot(normal, light_dir), 0.0) * u_light_clr;
    vec3 specular = specular_str * pow(max(dot(view_dir, reflect(-light_dir, normal)), 0.0), 128.0) * u_light_clr;
    gl_FragColor = vec4(ambient + diffuse + specular, 1.0) * texture2D(u_sampler, v_tex_coords);
}
