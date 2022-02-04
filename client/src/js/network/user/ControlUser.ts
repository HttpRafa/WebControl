export class ControlUser {

    username: string
    session: string

    constructor(username: string, session: string) {
        this.username = username;
        this.session = session;
    }

    set(username: string, session: string) {
        this.username = username;
        this.session = session;
    }

    delete() {
        this.username = null;
        this.session = null;
    }

    exists(): boolean {
        return !(this.username == null && this.session == null);
    }

}