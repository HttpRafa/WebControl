import { writable } from "svelte/store";

import {NetworkManager} from "./network/NetworkManager";
import type {ApplicationError} from "./ApplicationError";

export const darkMode = writable(window.localStorage.getItem("darkMode") ? Boolean(JSON.parse(window.localStorage.getItem("darkMode"))) : false);
export const currentNode = writable(window.localStorage.getItem("currentNode") ? Number(JSON.parse(window.localStorage.getItem("currentNode"))) : 0);

export const currentError = writable<ApplicationError>(undefined)
export const networkManager = writable(new NetworkManager());

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