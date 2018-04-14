const APP_PORT = process.env.PORT || 8080;

const WebSocket = require('ws');
const express = require('express');
const app = express();
const server = require('http').createServer(app, { path: '/render' });
const wss = new WebSocket.Server({ server });
const body_parser = require('body-parser');
const renderer = require('./renderer')();
const glMatrix = require('gl-matrix');

const MS_PER_FRAME = 1000/renderer.FPS;
const RADIUS = 3;
const OMEGA = 120; // degrees per second

app.use(express.static('static'))
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.get('/', function(req, res) {
    res.redirect('/test.html');
});

app.get('/hpc', function(req, res) {
    res.redirect('/testhpc.html');
});

wss.on('connection', function(socket, req) {
    function logip(msg) {
        console.log("("+req.connection.remoteAddress+") " + msg);
    }
    logip("Client connected");
    var stop = false;
    var encoder = renderer.spawnEncoder();
    encoder.stderr.pipe(process.stdout);
    encoder.stdout.on('data', function(data) {
        try {
            socket.send(data);
        } catch (e) {
            logip("Unable to send data: " + e);
            stop = true;
            encoder.stdin.end();
        }
    });
    socket.on('message', function(data) {
        switch(data) {
            case 'post_none':
                renderer.setKernel(renderer.kernels.KERNEL_NONE);
            break;
            case 'post_blur':
                renderer.setKernel(renderer.kernels.KERNEL_BLUR);
            break;
            case 'post_sharpen':
                renderer.setKernel(renderer.kernels.KERNEL_SHARPEN);
            break;
            case 'post_detect_edge':
                renderer.setKernel(renderer.kernels.KERNEL_EDGE_DETECTION);
            break;
            default:
                logip('Error: Unknown operation code');
            break;
        }
    });
    socket.on('close', function(reason) {
        logip("Client disconnected (reason: " + reason + ")");
        stop = true;
        encoder.stdin.end();
    });
    var bStartTime = new Date().getTime();
    var frameCount = 0;
    var lampPosition = [0, 0, RADIUS];
    render();
    function render() {
        if (stop) return;

        var startTime = new Date().getTime();

        renderer.renderScene(lampPosition);
        encoder.stdin.write(renderer.readPixels(), () => {
            var now = new Date().getTime();
            var dt = now - startTime;
            // animate objects
            glMatrix.vec3.rotateY(lampPosition, lampPosition, [0, 0, 0], glMatrix.glMatrix.toRadian(OMEGA * dt / 1000));

            // record and report benchmark
            ++frameCount;
            if (now - bStartTime >= 5000) {
                logip("Render rate: " + (frameCount/5).toFixed(2) + " fps ");
                bStartTime = now;
                frameCount = 0;
            }
            // call next frame
            if (dt < MS_PER_FRAME) {
                setTimeout(render, MS_PER_FRAME - dt);
            }
            else {
                render();
            }
        });
    }
});

app.post('/debug', function(req, res) {
    console.log('someone posted: ');
    console.log(req.body);
});

app.use(function(req, res) {
    res.status(404);
    res.send('404 File not found.');
    res.end();
});

server.listen(APP_PORT, function() {
    console.log('Server started at port ' + APP_PORT);
});
