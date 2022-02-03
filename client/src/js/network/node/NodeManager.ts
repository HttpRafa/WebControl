import {ControlNode, StoredControlNode} from "./ControlNode";
import {writable} from "svelte/store";

export class NodeManager {

    private readonly _nodes: Array<ControlNode>
    private _connectNode: ControlNode

    constructor() {
        this._nodes = [];
    }

    connect(node: ControlNode): Promise<number> {
        return new Promise<number>(resolve => {
            node.connect();
            node.nodeConnection.webSocket.onopen = event => {
                this._connectNode = node;
                resolve(1);
            };
            node.nodeConnection.webSocket.onerror = event => {
                resolve(-1);
            }
        });
    }

    loadNodes() {
        const storedData: Array<StoredControlNode> = window.localStorage.getItem("nodes") ? JSON.parse(window.localStorage.getItem("nodes")) : [];
        for (let i = 0; i < storedData.length; i++) {
            const storedNode = storedData[i];
            this._nodes.push(new ControlNode(storedNode.id, storedNode.host, storedNode.port, storedNode.username, storedNode.session));
        }
        console.log("Loaded " + this._nodes.length + " Nodes.");
    }

    storeNodes() {
        const storedData: Array<StoredControlNode> = [];
        for (let i = 0; i < this._nodes.length; i++) {
            let node = this._nodes[i];
            storedData.push(new StoredControlNode(node.id, node.host, node.port, node.username, node.session));
        }
        window.localStorage.setItem("nodes", JSON.stringify(storedData));
    }

    addNode(host: string, port: number) {
        console.log("Added node[" + host + ":" + port + "]")
        this._nodes.push(new ControlNode(this.findNewId(), host, port, undefined, undefined));
        this.storeNodes();
    }

    getNodeById(id: number): ControlNode {
        for (let i = 0; i < this._nodes.length; i++) {
            if(this._nodes[i].id == id) {
                return this._nodes[i];
            }
        }
        return undefined;
    }

    findNewId(): number {
        let id = 0;
        while(this.getNodeById(id) != undefined) {
            id++;
        }
        return id;
    }

    testNode(host: string, port: number, successCallback: () => void, errorCallback: () => void) {
        let testSocket = new WebSocket("ws://" + host + ":" + port);
        let success = false;

        testSocket.onerror = event => {
            errorCallback();
        }
        testSocket.onopen = event => {
            setTimeout(() => {
                if(!success) {
                    testSocket.close();
                    errorCallback();
                }
            }, 5000);
        }
        testSocket.onmessage = event => {
            testSocket.close();
            success = true;
            successCallback();
        }
    }

    get nodes(): Array<ControlNode> {
        return this._nodes;
    }

    get connectNode(): ControlNode {
        return this._connectNode;
    }

}

export const currentNode = writable(window.localStorage.getItem("currentNode") ? Number(JSON.parse(window.localStorage.getItem("currentNode"))) : 0);

currentNode.subscribe(value => {
    window.localStorage.setItem("currentNode", JSON.stringify(value));
})