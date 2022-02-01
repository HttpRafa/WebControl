import { writable } from "svelte/store";

export const darkMode = writable(window.localStorage.getItem("darkMode") ? Boolean(JSON.parse(window.localStorage.getItem("darkMode"))) : false);

darkMode.subscribe(value => {
    localStorage.setItem("darkMode", JSON.stringify(value))
});