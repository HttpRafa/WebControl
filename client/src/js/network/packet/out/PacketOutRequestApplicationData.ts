import {Packet} from "../Packet";

export class PacketOutRequestApplicationData extends Packet {

    constructor(dataIds: number[]) {
        super(5, { dataIds: dataIds });
    }

}