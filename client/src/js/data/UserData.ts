import type {SimpleApplication} from "../application/SimpleApplication";

export class UserData {

    applicationId: number
    applications: Array<SimpleApplication>

    constructor(applicationId: number, applications: Array<SimpleApplication>) {
        this.applicationId = applicationId;
        this.applications = applications;
    }

}