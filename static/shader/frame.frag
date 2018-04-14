precision highp float;

uniform sampler2D u_sampler;
uniform mat3 u_kernel;

varying vec2 v_tex_coords;

const float OFFSET = 1.0/300.0;

ivec2 get_matrix_indices(const int i) {
    return ivec2(i / 3 , i - 3*int(floor(float(i)/3.0)));
}

void main() {
    vec2 offsets[9];
    offsets[0] = vec2(-OFFSET, OFFSET);
    offsets[1] = vec2(0.0, OFFSET);
    offsets[2] = vec2(OFFSET, OFFSET);
    offsets[3] = vec2(-OFFSET, 0);
    offsets[4] = vec2(0.0, 0.0);
    offsets[5] = vec2(OFFSET, 0);
    offsets[6] = vec2(-OFFSET, -OFFSET);
    offsets[7] = vec2(0.0, -OFFSET); 
    offsets[8] = vec2(OFFSET, -OFFSET);

    vec3 new = vec3(0.0, 0.0, 0.0);
    for (int i = 0; i < 9; ++i) {
        ivec2 indices = get_matrix_indices(i);
        vec3 tx_clr = texture2D(u_sampler, v_tex_coords.st + offsets[i]).rgb;
        new += u_kernel[indices.t][indices.s] * tx_clr;
    }

    gl_FragColor = vec4(new, 1.0);
}
