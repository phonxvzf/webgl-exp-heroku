const PNG = require('node-png').PNG;
const fs = require('fs');

class Texture {
    constructor(gl, path, defaultColor = [255, 0, 0, 255]) {
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
        var this_tx = this;
        if (path) {
            var image;
            function initTexture(img, tx) {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.bindTexture(gl.TEXTURE_2D, tx.texture);
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    img.width,
                    img.height,
                    0,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    img.data
                );
                if (tx.isPowOf2(img.width) && tx.isPowOf2(img.height))
                    gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            if (typeof path == "string") {
                fs.createReadStream(path)
                    .pipe(
                        new PNG()
                    )
                    .on('parsed', function() {
                        initTexture({data: new Uint8Array(this.data), width: this.width, height: this.height}, this_tx);
                    });
            }
            else {
                initTexture(path, this);
            }
        }
    }

    bind(gl) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }

    isPowOf2(num) {
        return (num != 0) && (num & (num-1) == 0);
    }
}

module.exports = Texture;
