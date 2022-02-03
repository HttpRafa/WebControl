import {NodeConnection} from "../connection/NodeConnection";
import {PacketOutLogin} from "../packet/out/PacketOutLogin";

import type {ControlUser} from "../user/ControlUser";

export class ControlNode {

    private _id: number

    private _host: string
    private _port: number

    private _nodeConnection: NodeConnection
    private _user: ControlUser;

    constructor(id: number, host: string, port: number, user: ControlUser) {
        this._id = id;
        this._host = host;
        this._port = port;
        this._user = user;
    }

    connect(): Promise<number> {
        if(this._nodeConnection == undefined) {
            this._nodeConnection = new NodeConnection(this);
        }
        return this._nodeConnection.createConnection();
    }

    destroyConnection() {
        if(this._nodeConnection != undefined) {
            this._nodeConnection.closeConnection();
        }
        this._nodeConnection = undefined;
    }

    login(): Promise<number> {
        return new Promise(resolve => {
            this._nodeConnection.sendPacket(new PacketOutLogin(this._user.username, this._user.session));
            resolve(1);
        });
    }

    hasUser(): boolean {
        return this._user.exists();
    }

    get nodeConnection(): NodeConnection {
        return this._nodeConnection;
    }

    get host(): string {
        return this._host;
    }

    set host(value: string) {
        this._host = value;
    }

    get port(): number {
        return this._port;
    }

    set port(value: number) {
        this._port = value;
    }

    get user(): ControlUser {
        return this._user;
    }

    set user(value: ControlUser) {
        this._user = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

}

export class StoredControlNode {

    id: number

    host: string
    port: number

    user: ControlUser

    constructor(id: number, host: string, port: number, user: ControlUser) {
        this.id = id;
        this.host = host;
        this.port = port;
        this.user = user;
    }

}