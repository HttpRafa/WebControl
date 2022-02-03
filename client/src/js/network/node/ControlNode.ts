import {NodeConnection} from "../connection/NodeConnection";
import {PacketOutLogin} from "../packet/out/PacketOutLogin";

export class ControlNode {

    private _id: number

    private _host: string
    private _port: number

    private _nodeConnection: NodeConnection

    private _username: string = undefined;
    private _session: string = undefined;

    constructor(id: number, host: string, port: number, username: string, session: string) {
        this._id = id;
        this._host = host;
        this._port = port;
        this._username = username;
        this._session = session;
    }

    connect() {
        if(this._nodeConnection == undefined) {
            this._nodeConnection = new NodeConnection(this);
        }
        this._nodeConnection.createConnection();
    }

    destroyConnection() {
        if(this._nodeConnection != undefined) {
            this._nodeConnection.closeConnection();
        }
        this._nodeConnection = undefined;
    }

    login(): Promise<number> {
        return new Promise(resolve => {
            this._nodeConnection.sendPacket(new PacketOutLogin(this._username, this._session));
            resolve(1);
        });
    }

    isLoggedIn() {
        return this._username == undefined && this._session == undefined;
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

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get session(): string {
        return this._session;
    }

    set session(value: string) {
        this._session = value;
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

    username: string
    session: string

    constructor(id: number, host: string, port: number, username: string, session: string) {
        this.id = id;
        this.host = host;
        this.port = port;
        this.username = username;
        this.session = session;
    }

}