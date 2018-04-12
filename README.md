## WebGL & OpenGL HPC Experiment
This project is initially started for rendering 3D-scanned model with HDR in real-time which can be viewed on the browser, but unfortunately the implementation didn't go well with Apple's iOS webkit, so *we* have decided to instead build a HPC service for rendering and then stream the pixels to the client.

## How does it work?
The NodeJS server renders the graphics and have the rendered pixels encoded to MPEG Transport Stream (MPEG-TS), then the server streams the video via WebSocket to the client's browser.

The server uses stackgl's [headless-gl](https://github.com/stackgl/headless-gl) for graphics rendering whilst the client uses phoboslab's [jsmpeg](https://github.com/phoboslab/jsmpeg) to decode the video stream.

## Dependencies
- `FFmpeg`; make sure the binary is accessible via PATH environment variable.
- `NodeJS`
- `npm`

## Setting Up
Just clone this repository and call `npm install` to install all needed NodeJS dependencies, then you're all done.

## Running The Service & Service Access
1. `npm start` or `node index.js` to start the server.
2. The HPC service can be accessed at `http://localhost:8080/hpc`. Be noted that other services (e.g. client-side WebGL) are deprecated due to the use of currently modified shader code. If everything works correctly, you should see a light source revolving around a marble cube on black background. 

## Future Plans
To begin with, for the animation to be chronologically correct, I need to pass `-re` flag to `FFmpeg`. This causes `FFmpeg` to stall its input from `stdin` to achieve its *self-determined* correct frame rate, resulting less transcoding rate (from 100+ fps to 25 fps).

My guess is that piping raw pixels through `stdin` might be a bottleneck here since when I removed the `-re` flag, benchmarking reported 60 fps rendering speed (of course the animation timing was weird). 

So, I plan to move from `NodeJS` or at least create a plugin for it in C/C++ with `libavformat` and `libavcodec` so that I can encode the raw pixels directly. It also make senses to build a high performance service in C/C++. I could just say good bye to garbage collection and squeeze everything out of the hardware.
