const BUFFER_WIDTH = 720, BUFFER_HEIGHT = 480;
const gl = require('gl')(BUFFER_WIDTH, BUFFER_HEIGHT, {preserveDrawingBuffer: true});
const cp = require('child_process');
const glMatrix = require('gl-matrix');
const fs = require('fs');
const PNG = require('node-png').PNG;
const glDebug = require('webgl-debug');

const Camera = require('./renderer/camera.js');
const Texture = require('./renderer/texture.js');

const primitive = require('./renderer/primitive.js');
const Shader = require('./renderer/shader.js');
const attribs = require('./renderer/attribs.js');

shaderCode = {
    TRIANGLE_VERT: null,
    TRIANGLE_FRAG: null,
    BOX_VERT: null,
    BOX_FRAG: null,
    LAMP_VERT: null,
    LAMP_FRAG: null,
    FRAME_VERT: null,
    FRAME_FRAG: null,
}

shaders = {
    TRIANGLE: {},
    BOX: {},
    LAMP: {},
    FRAME: {},
}

frame = {
    init: function() {
        this.buffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, BUFFER_WIDTH, BUFFER_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

        this.renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, BUFFER_WIDTH, BUFFER_HEIGHT);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            console.log(glDebug.glEnumToString(gl.checkFramebufferStatus(gl.FRAMEBUFFER)));
            throw new Error("GL ERROR: Framebuffer is not complete.");
        }
        else {
            console.log("Framebuffer is complete.");
        }
        renderer.clearBuffer();
        this.quad = new primitive.FrameQuad(gl, shaders.FRAME.pgi, attribs.FRAME_VERTICES);
        this.bindDefaultBuffer();
    },
    bindBuffer: function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.buffer);
    },
    bindDefaultBuffer: function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    postProcess: function() {
        this.bindDefaultBuffer();
        renderer.clearBuffer();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        this.quad.draw(gl);
    }
}

objects = {
    init: function() {
        this.triangle = new primitive.Triangle(
            gl,
            shaders.TRIANGLE.pgi,
            attribs.TRIANGLE_ATTRIBS
        );
        this.lamp = new primitive.Lamp(
            gl,
            [-2,0,2],
            shaders.LAMP.pgi,
            attribs.LAMP_ATTRIBS,
            [255,255,255]
        );
        this.box = new primitive.NormalBox(
            gl,
            [0,0,0],
            shaders.BOX.pgi, 
            new Texture(gl, 'static/img/marble_res.png'), 
            attribs.BOX_VERTICES
        );
    }
}

renderer = {
    width: BUFFER_WIDTH,
    height: BUFFER_HEIGHT,
    FPS: 60,
    camera: new Camera([5,2,5], 45, BUFFER_WIDTH/BUFFER_HEIGHT, 0.1, 100),
    clearBuffer: function() {
        gl.viewport(0, 0, BUFFER_WIDTH, BUFFER_HEIGHT);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },
    clearBufferEx: function() {
        gl.viewport(0, 0, BUFFER_WIDTH, BUFFER_HEIGHT);
        gl.clearColor(0.0, 0.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },
    encodePNG: function(w, h, pixels) {
        var png = new PNG({width: w, height: h});
        png.data = Buffer.from(pixels);
        return png.pack();
    },
    readPixels: function(w = this.width, h = this.height) {
        var pixels = new Uint8Array(w * h * 4);
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        return pixels;
    },
    createPNG: function() {
        return this.encodePNG(BUFFER_WIDTH, BUFFER_HEIGHT, this.readPixels(BUFFER_WIDTH, BUFFER_HEIGHT));
    },
    createWebP: function() {
        var proc = cp.spawnSync('ffmpeg', [
            '-y', // overwrite output
            '-hide_banner',
            '-s', BUFFER_WIDTH + 'x' + BUFFER_HEIGHT,
            '-f', 'rawvideo',
            '-pix_fmt', 'rgba',
            '-i', '-',
            '-f', 'webp',
            '-'
        ],
        {
            maxBuffer: BUFFER_WIDTH * BUFFER_HEIGHT * 4,
            input: this.readPixels()
        });
        return proc.stdout;
    },
    spawnEncoder: function() {
        var proc = cp.spawn('ffmpeg', [
            '-hide_banner',
            '-loglevel', 'fatal',
            '-re',
            '-s', BUFFER_WIDTH + 'x' + BUFFER_HEIGHT,
            '-f', 'rawvideo',
            '-pix_fmt', 'rgba',
            '-i', '-',
            '-an', // disable audio
            '-threads', '0',
            '-preset', 'ultrafast',
            '-f', 'mpegts', // MPEG transport stream
            '-codec:v', 'mpeg1video', // This codec is required to be used with jsmpeg
            '-mbd', '2',
            '-r', this.FPS, // maximum frame rate
            '-b', '1024k', // maximum bitrate
            '-'
            ],
            {
                maxBuffer: BUFFER_WIDTH * BUFFER_HEIGHT * 4,
            });
        return proc;
    },
    renderBox: function() {
        frame.bindBuffer();
        objects.box.draw(gl, this.camera, objects.lamp);
        frame.postProcess();
        return this.createPNG(BUFFER_WIDTH, BUFFER_HEIGHT);
    },
    renderTriangle: function() {
        frame.bindBuffer();
        objects.triangle.draw(gl);
        frame.postProcess();
        return this.createPNG(BUFFER_WIDTH, BUFFER_HEIGHT);
    },
    renderScene: function(lampPosition, boxPosition) {
        frame.bindBuffer();
        this.clearBuffer();
        if (lampPosition) objects.lamp.position = lampPosition;
        if (boxPosition) objects.box.position = boxPosition;
        objects.lamp.draw(gl, this.camera);
        objects.box.draw(gl, this.camera, objects.lamp);
        frame.postProcess();
    },
    getError: function() {
        return glDebug.glEnumToString(gl.getError());
    },
}

module.exports = function() {
    if (!gl) {
        console.log("CRITICAL ERROR: Could not create GL context.");
        return null;
    }
    glDebug.init();
    console.log('GL_SHADING_LANGUAGE_VERSION: ', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    shaderCode.TRIANGLE_VERT = fs.readFileSync('static/shader/triangle.vert').toString();
    shaderCode.TRIANGLE_FRAG = fs.readFileSync('static/shader/triangle.frag').toString();
    shaderCode.BOX_VERT = fs.readFileSync('static/shader/box.vert').toString();
    shaderCode.BOX_FRAG = fs.readFileSync('static/shader/box.frag').toString();
    shaderCode.LAMP_VERT = fs.readFileSync('static/shader/lamp.vert').toString();
    shaderCode.LAMP_FRAG = fs.readFileSync('static/shader/lamp.frag').toString();
    shaderCode.FRAME_VERT = fs.readFileSync('static/shader/frame.vert').toString();
    shaderCode.FRAME_FRAG = fs.readFileSync('static/shader/frame.frag').toString();
    
    shaders.TRIANGLE = new Shader(gl, shaderCode.TRIANGLE_VERT, shaderCode.TRIANGLE_FRAG, 
        ["a_position","a_color"],
        ["u_scale_mat"]
    );
    shaders.BOX = new Shader(gl, shaderCode.BOX_VERT, shaderCode.BOX_FRAG,
        ["in_position","in_tex_coords","in_normal"],
        ["u_model","u_view","u_proj","u_sampler","u_light_clr","u_light_pos","u_cam_pos"]
    );
    shaders.LAMP = new Shader(gl, shaderCode.LAMP_VERT, shaderCode.LAMP_FRAG,
        ["in_position"],
        ["u_model","u_view","u_proj","u_color"]
    );
    shaders.FRAME = new Shader(gl, shaderCode.FRAME_VERT, shaderCode.FRAME_FRAG,
        ["in_position","in_tex_coords"],
        ["u_flip_mat","u_sampler","u_kernel"]
    );

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    frame.init();
    objects.init();

    renderer.clearBuffer();

    return renderer;
}

