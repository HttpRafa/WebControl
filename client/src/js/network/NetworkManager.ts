import {NodeManager} from "./node/NodeManager";

export class NetworkManager {

    private readonly _nodeManager: NodeManager;

    constructor() {
        this._nodeManager = new NodeManager();
        console.log("Initializing the networkManager...")
    }

    prepareManager() {
        this._nodeManager.loadNodes();
    }

    get nodeManager(): NodeManager {
        return this._nodeManager;
    }

}