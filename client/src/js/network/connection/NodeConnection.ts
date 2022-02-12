import type {ControlNode} from "../node/ControlNode";
import type {Packet} from "../packet/Packet";
import {
    applicationAccessUsers,
    applicationCpuLoad,
    applicationDescription,
    applicationMemoryUsage, applicationOptions,
    applicationState, applicationType,
    applicationUptime
} from "../../Store";

export class NodeConnection {

    private readonly _node: ControlNode

    private _webSocket: WebSocket

    private _packetHandler: ((packet: Packet) => void)[] = [];

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

    handleMessage(event: MessageEvent) {
        let data: Packet = JSON.parse(event.data);
        console.table(data);
        if(data.id === 5) {
            // @ts-ignore
            if(data.document.data.applicationState != undefined) {
                // @ts-ignore
                applicationState.set(data.document.data.applicationState);
            }
            // @ts-ignore
            if(data.document.data.applicationType != undefined) {
                // @ts-ignore
                applicationType.set(data.document.data.applicationType);
            }
            // @ts-ignore
            if(data.document.data.applicationUptime != undefined) {
                // @ts-ignore
                applicationUptime.set(data.document.data.applicationUptime);
            }
            // @ts-ignore
            if(data.document.data.applicationCpuLoad != undefined) {
                // @ts-ignore
                applicationCpuLoad.set(data.document.data.applicationCpuLoad);
            }
            // @ts-ignore
            if(data.document.data.applicationMemoryUsage != undefined) {
                // @ts-ignore
                applicationMemoryUsage.set(data.document.data.applicationMemoryUsage);
            }
            // @ts-ignore
            if(data.document.data.applicationDescription != undefined) {
                // @ts-ignore
                applicationDescription.set(data.document.data.applicationDescription);
            }
            // @ts-ignore
            if(data.document.data.applicationOptions != undefined) {
                // @ts-ignore
                applicationOptions.set(data.document.data.applicationOptions);
            }
            // @ts-ignore
            if(data.document.data.applicationAccessUsers != undefined) {
                // @ts-ignore
                applicationAccessUsers.set(data.document.data.applicationAccessUsers);
            }
        } else {
            for (let i = 0; i < this._packetHandler.length; i++) {
                this._packetHandler[i](data);
            }
        }
    }

    addHandler(handler: (packet: Packet) => void): number {
        return this._packetHandler.push(handler) - 1;
    }

    removeHandler(index: number) {
        this._packetHandler.splice(index, 1);
    }

    get node(): ControlNode {
        return this._node;
    }

    get webSocket(): WebSocket {
        return this._webSocket;
    }

}
