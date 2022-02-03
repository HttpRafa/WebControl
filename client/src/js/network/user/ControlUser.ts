export class ControlUser {

    username: string
    session: string

    constructor(username: string, session: string) {
        this.username = username;
        this.session = session;
    }

    exists(): boolean {
        return false;
    }

}