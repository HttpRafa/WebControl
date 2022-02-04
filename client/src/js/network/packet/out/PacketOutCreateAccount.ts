import {Packet} from "../Packet";

export class PacketOutCreateAccount extends Packet {

    constructor(username: string, password: string, token: string) {
        super(3, { username: username, password: password, token: token });
    }

}