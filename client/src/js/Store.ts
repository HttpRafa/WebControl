import { writable } from "svelte/store";

import {NetworkManager} from "./network/NetworkManager";
import {UserData} from "./data/UserData";

import type {ApplicationError} from "./ApplicationError";
import {ApplicationStates} from "./enums/ApplicationStates";
import {PageIds} from "./enums/PageIds";
import {update} from "./application/Application";

export const darkMode = writable<boolean>(window.localStorage.getItem("darkMode") ? Boolean(JSON.parse(window.localStorage.getItem("darkMode"))) : false);
export const currentNode = writable<number>(window.localStorage.getItem("currentNode") ? Number(JSON.parse(window.localStorage.getItem("currentNode"))) : 0);

export const currentError = writable<ApplicationError>(undefined);
export const networkManager = writable<NetworkManager>(new NetworkManager());

export const pageId = writable<number>(PageIds.loading);

export const userData = writable<UserData>(new UserData(undefined, []));

export const applicationState = writable<number>(ApplicationStates.stopped);
export const applicationType = writable<string>(undefined);
export const applicationUptime = writable<number>(undefined);
export const applicationCpuLoad = writable<number>(undefined);
export const applicationMemoryUsage = writable<number[]>(undefined);
export const applicationDescription = writable<number>(undefined);

export const applicationOptions = writable<{ name: string, value: string }[]>(undefined);

export const applicationConsoleMessages = writable<string[]>(undefined);


currentError.subscribe(value => {
    if(value != undefined) {
        console.log("Error[id: " + value.id + "] " + value.message);
    }
})

currentNode.subscribe(value => {
    window.localStorage.setItem("currentNode", JSON.stringify(value));
})

darkMode.subscribe(value => {
    localStorage.setItem("darkMode", JSON.stringify(value))
});

pageId.subscribe(value => {
    update(value);
})
