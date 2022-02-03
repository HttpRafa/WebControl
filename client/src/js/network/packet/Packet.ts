import * as uuid from 'uuid';

export class Packet {

    readonly id: number
    readonly uuid: string
    readonly document: {data: {}}

    constructor(id: number, data: {}) {
        this.id = id;
        this.uuid = uuid.v4();
        this.document = {data: data};
    }

}