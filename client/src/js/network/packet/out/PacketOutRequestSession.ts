import {Packet} from "../Packet";

export class PacketOutRequestSession extends Packet {

    constructor(username: string, password: string) {
        super(2, { username: username, password: password });
    }

}