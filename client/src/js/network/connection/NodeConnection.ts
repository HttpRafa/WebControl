import type {ControlNode} from "../node/ControlNode";
import type {Packet} from "../packet/Packet";

export class NodeConnection {

    private readonly _node: ControlNode

    private _webSocket: WebSocket

    constructor(node: ControlNode) {
        this._node = node;
        this._webSocket = undefined;
    }

    sendPacket(packet: Packet) {
        this._webSocket.send(JSON.stringify(packet));
    }

    closeConnection() {
        if(this._webSocket != undefined) {
            this._webSocket.close();
            this._webSocket = undefined;
        }
    }

    createConnection(): Promise<number> {
        return new Promise<number>(resolve => {
            this.closeConnection();
            this._webSocket = new WebSocket("ws://" + this._node.host + ":" + this._node.port);
            this._webSocket.addEventListener('open', event => {
                resolve(1);
            });
            this._webSocket.addEventListener('error', event => {
                resolve(-1);
            });
            this._webSocket.addEventListener('open', ev => {this.handleOpen(ev)})
            this._webSocket.addEventListener('error', ev => {this.handleError(ev)})
            this._webSocket.addEventListener('message', ev => {this.handleMessage(ev)})
        });
    }

    handleOpen(event: Event) {

    }

    handleError(event: Event) {

    }

    handleMessage(event: Event) {

    }

    get node(): ControlNode {
        return this._node;
    }

    get webSocket(): WebSocket {
        return this._webSocket;
    }

}