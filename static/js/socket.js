class CustomSocket extends JSMpeg.Source.WebSocket {
    constructor(url, options) {
        super(url, options);
        this.onConnect = null;
    }
    onOpen() {
        super.onOpen();
        if (this.onConnect) this.onConnect();
    }
}
