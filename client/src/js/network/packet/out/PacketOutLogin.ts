import {Packet} from "../Packet";

export class PacketOutLogin extends Packet {

    constructor(username: string, session: string) {
        super(1, { username: username, session: session });
    }

}