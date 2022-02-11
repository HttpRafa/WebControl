import {
    applicationCpuLoad,
    applicationDescription,
    applicationMemoryUsage,
    applicationState,
    applicationType, applicationUptime,
    currentNode,
    networkManager
} from "../Store";
import {PacketOutRequestApplicationData} from "../network/packet/out/PacketOutRequestApplicationData";
import {ApplicationDataIds} from "../enums/ApplicationDataIds";
import {PageIds} from "../enums/PageIds";

export function update(pageId: number) {
    if(pageId == PageIds.application) {
        updateApplicationState();
        updateApplicationType();
        updateApplicationUptime();
        updateApplicationCpuLoad();
        updateApplicationDescription();
        updateApplicationMemoryUsage();
    }
}

export function updateApplicationState() {
    networkManager.update(value => {
        currentNode.update(nodeId => {
            let node = value.nodeManager.getNodeById(nodeId);
            node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationState]));
            return nodeId;
        });
        return value;
    });
}

export function updateApplicationType() {
    networkManager.update(value => {
        currentNode.update(nodeId => {
            let node = value.nodeManager.getNodeById(nodeId);
            node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationType]));
            return nodeId;
        });
        return value;
    });
}

export function updateApplicationUptime() {
    networkManager.update(value => {
        currentNode.update(nodeId => {
            let node = value.nodeManager.getNodeById(nodeId);
            node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationUptime]));
            return nodeId;
        });
        return value;
    });
}

export function updateApplicationCpuLoad() {
    networkManager.update(value => {
        currentNode.update(nodeId => {
            let node = value.nodeManager.getNodeById(nodeId);
            node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationCpuLoad]));
            return nodeId;
        });
        return value;
    });
}

export function updateApplicationMemoryUsage() {
    networkManager.update(value => {
        currentNode.update(nodeId => {
            let node = value.nodeManager.getNodeById(nodeId);
            node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationMemoryUsage]));
            return nodeId;
        });
        return value;
    });
}

export function updateApplicationDescription() {
    networkManager.update(value => {
        currentNode.update(nodeId => {
            let node = value.nodeManager.getNodeById(nodeId);
            node.request(new PacketOutRequestApplicationData([ApplicationDataIds.applicationDescription]));
            return nodeId;
        });
        return value;
    });
}
