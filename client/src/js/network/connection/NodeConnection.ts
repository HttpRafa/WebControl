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

    createConnection() {
        this.closeConnection();
        this._webSocket = new WebSocket("ws://" + this._node.host + ":" + this._node.port);
    }

    get node(): ControlNode {
        return this._node;
    }

    get webSocket(): WebSocket {
        return this._webSocket;
    }

}