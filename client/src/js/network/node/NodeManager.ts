import {ControlNode, StoredControlNode} from "./ControlNode";
import {currentError, currentNode} from "../../Store";
import {ApplicationError} from "../../ApplicationError";
import {ControlUser} from "../user/ControlUser";
import {ErrorIds} from "../../enums/ErrorIds";

export class NodeManager {

    private readonly _nodes: Array<ControlNode>

    constructor() {
        this._nodes = [];
    }

    connect(resultCallback: (result: number, node: ControlNode) => void) {
        currentNode.update(nodeId => {
            let node = this.getNodeById(nodeId);
            node.connect().then(result => {
                if(result == -1) {
                    currentError.set(new ApplicationError(ErrorIds.node_connect, "Error while connecting to the node[" + node.host + ":" + node.port + "]"));
                }
                resultCallback(result, node);
            });
            return nodeId;
        });
    }

    loadNodes() {
        const storedData: Array<StoredControlNode> = window.localStorage.getItem("nodes") ? JSON.parse(window.localStorage.getItem("nodes")) : [];
        for (let i = 0; i < storedData.length; i++) {
            const storedNode = storedData[i];
            if(storedNode.user == undefined) {
                this._nodes.push(new ControlNode(storedNode.id, storedNode.host, storedNode.port, new ControlUser(undefined, undefined)));
            } else {
                this._nodes.push(new ControlNode(storedNode.id, storedNode.host, storedNode.port, new ControlUser(storedNode.user.username, storedNode.user.session)));
            }
        }
        console.log("Loaded " + this._nodes.length + " Nodes.");
    }

    storeNodes() {
        const storedData: Array<StoredControlNode> = [];
        for (let i = 0; i < this._nodes.length; i++) {
            let node = this._nodes[i];
            storedData.push(new StoredControlNode(node.id, node.host, node.port, node.user));
        }
        window.localStorage.setItem("nodes", JSON.stringify(storedData));
    }

    addNode(host: string, port: number): number {
        const id = this.findNewId();

        console.log("Added node[" + host + ":" + port + "]")
        this._nodes.push(new ControlNode(id, host, port, new ControlUser(undefined, undefined)));
        this.storeNodes();
        return id;
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

}