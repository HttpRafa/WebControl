import { writable } from "svelte/store";

import {NetworkManager} from "./js/network/NetworkManager";
import type {ApplicationError} from "./js/ApplicationError";

export const darkMode = writable(window.localStorage.getItem("darkMode") ? Boolean(JSON.parse(window.localStorage.getItem("darkMode"))) : false);

export const currentError = writable<ApplicationError>(undefined)
export const networkManager = writable(new NetworkManager());

darkMode.subscribe(value => {
    localStorage.setItem("darkMode", JSON.stringify(value))
});