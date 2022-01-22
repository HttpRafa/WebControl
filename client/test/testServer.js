const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3388 });

wss.on('connection', (ws) => {
    ws.onmessage = (event) => {
        const packet = JSON.parse(event.data);
        if(packet.id === 1) {
            console.log("Creating new login session[" + packet.data._username + "]");
            setTimeout(() => {
                ws.send(JSON.stringify({id: 2, status: 1, data: { _username: packet.data._username, _session: makeid(20) }}));
            }, 2000);
        } else if(packet.id === 0) {
            console.log("New verify session request[" + packet.data._username + "]");
            setTimeout(() => {
                ws.send(JSON.stringify({id: 1, data: packet.data._username === "HttpRafa" ? 1 : -1 }));
            }, 2000);
        }
    };
    ws.onclose = event => {
        console.log("Client disconnected");
    };
    console.log("Client connected");
    setTimeout(() => {
        ws.send(JSON.stringify({id: 0, data: undefined}));
    }, 2000);
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}