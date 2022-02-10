import {applicationState, currentNode, networkManager} from "../Store";
import {PacketOutRequestApplicationData} from "../network/packet/out/PacketOutRequestApplicationData";
import {ApplicationDataIds} from "../enums/ApplicationDataIds";

export function updateWorkerState() {
    networkManager.update(value => {
        currentNode.update(nodeId => {
            let node = value.nodeManager.getNodeById(nodeId);
            node.request("applicationState", new PacketOutRequestApplicationData([ApplicationDataIds.applicationState])).then(value1 => {
                if(value1 != undefined) {
                    // @ts-ignore
                    applicationState.set(value1.document.data.applicationState);
                }
            });
            return nodeId;
        });
        return value;
    });
}
