import {SimpleApplication} from "./SimpleApplication";
import {WorkerStates} from "../enums/WorkerStates";

export class Application extends SimpleApplication {

    workerState: number

    constructor() {
        super();
        this.workerState = WorkerStates.stopped;
    }

}