import {NodeManager} from "./node/NodeManager";
import {currentNode, pageId} from "../Store";
import {update} from "../application/Application";

export class NetworkManager {

    private readonly _nodeManager: NodeManager;

    constructor() {
        this._nodeManager = new NodeManager();
        console.log("Initializing the networkManager...")

        setInterval(() => {
            currentNode.update(value => {
                let node = this._nodeManager.getNodeById(value);
                if(node != undefined) {
                    pageId.update(value1 => {
                        update(value1);
                        return value1;
                    })
                }
                return value;
            });
        }, 1000);
    }

    prepareManager() {
        this._nodeManager.loadNodes();
    }

    get nodeManager(): NodeManager {
        return this._nodeManager;
    }

}
