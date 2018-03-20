class Texture {
    constructor(gl, url, defaultColor = [255, 0, 0, 255]) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        // default texture
        // use color red until the image is loaded
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array(defaultColor)
        );

        if (url) {
            var image;
            function initTexture(img, tx) {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.bindTexture(gl.TEXTURE_2D, tx);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    img
                );

                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            if (typeof url == "string") {
                image = new Image();
                image.src = url;
                image.onload = () => {
                    initTexture(image, this.texture);
                };
            }
            else {
                initTexture(url, this.texture);
            }
        }
    }

    bind() {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
}