const BOX_VERTICES = [
    -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, -1.0,
    0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.0, -1.0,
    0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 0.0, -1.0,
    0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 0.0, -1.0,
    -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.0, -1.0,
    -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.0, -1.0,

    -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0,
    0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.0, 1.0,
    0.5, 0.5, 0.5, 1.0, 1.0, 0.0, 0.0, 1.0,
    0.5, 0.5, 0.5, 1.0, 1.0, 0.0, 0.0, 1.0,
    -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
    -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0,

    -0.5, 0.5, 0.5, 1.0, 0.0, -1.0, 0.0, 0.0,
    -0.5, 0.5, -0.5, 1.0, 1.0, -1.0, 0.0, 0.0,
    -0.5, -0.5, -0.5, 0.0, 1.0, -1.0, 0.0, 0.0,
    -0.5, -0.5, -0.5, 0.0, 1.0, -1.0, 0.0, 0.0,
    -0.5, -0.5, 0.5, 0.0, 0.0, -1.0, 0.0, 0.0,
    -0.5, 0.5, 0.5, 1.0, 0.0, -1.0, 0.0, 0.0,

    0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0,
    0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
    0.5, -0.5, -0.5, 0.0, 1.0, 1.0, 0.0, 0.0,
    0.5, -0.5, -0.5, 0.0, 1.0, 1.0, 0.0, 0.0,
    0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.0,
    0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.0, 0.0,

    -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, -1.0, 0.0,
    0.5, -0.5, -0.5, 1.0, 1.0, 0.0, -1.0, 0.0,
    0.5, -0.5, 0.5, 1.0, 0.0, 0.0, -1.0, 0.0,
    0.5, -0.5, 0.5, 1.0, 0.0, 0.0, -1.0, 0.0,
    -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, -1.0, 0.0,
    -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, -1.0, 0.0,

    -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0,
    0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 1.0, 0.0,
    0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0,
    0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, 0.0,
    -0.5, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0, 0.0,
    -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 0.0
];

const BOX_VERTICES_NO_NORM = [
    -0.5, -0.5, -0.5, 0.0, 0.0,
    0.5, -0.5, -0.5, 1.0, 0.0,
    0.5, 0.5, -0.5, 1.0, 1.0,
    0.5, 0.5, -0.5, 1.0, 1.0,
    -0.5, 0.5, -0.5, 0.0, 1.0,
    -0.5, -0.5, -0.5, 0.0, 0.0,

    -0.5, -0.5, 0.5, 0.0, 0.0,
    0.5, -0.5, 0.5, 1.0, 0.0,
    0.5, 0.5, 0.5, 1.0, 1.0,
    0.5, 0.5, 0.5, 1.0, 1.0,
    -0.5, 0.5, 0.5, 0.0, 1.0,
    -0.5, -0.5, 0.5, 0.0, 0.0,

    -0.5, 0.5, 0.5, 1.0, 0.0,
    -0.5, 0.5, -0.5, 1.0, 1.0,
    -0.5, -0.5, -0.5, 0.0, 1.0,
    -0.5, -0.5, -0.5, 0.0, 1.0,
    -0.5, -0.5, 0.5, 0.0, 0.0,
    -0.5, 0.5, 0.5, 1.0, 0.0,

    0.5, 0.5, 0.5, 1.0, 0.0,
    0.5, 0.5, -0.5, 1.0, 1.0,
    0.5, -0.5, -0.5, 0.0, 1.0,
    0.5, -0.5, -0.5, 0.0, 1.0,
    0.5, -0.5, 0.5, 0.0, 0.0,
    0.5, 0.5, 0.5, 1.0, 0.0,

    -0.5, -0.5, -0.5, 0.0, 1.0,
    0.5, -0.5, -0.5, 1.0, 1.0,
    0.5, -0.5, 0.5, 1.0, 0.0,
    0.5, -0.5, 0.5, 1.0, 0.0,
    -0.5, -0.5, 0.5, 0.0, 0.0,
    -0.5, -0.5, -0.5, 0.0, 1.0,

    -0.5, 0.5, -0.5, 0.0, 1.0,
    0.5, 0.5, -0.5, 1.0, 1.0,
    0.5, 0.5, 0.5, 1.0, 0.0,
    0.5, 0.5, 0.5, 1.0, 0.0,
    -0.5, 0.5, 0.5, 0.0, 0.0,
    -0.5, 0.5, -0.5, 0.0, 1.0,
];