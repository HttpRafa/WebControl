import {NodeConnection} from "../connection/NodeConnection";
import {PacketOutLogin} from "../packet/out/PacketOutLogin";

import type {ControlUser} from "../user/ControlUser";
import {PacketOutRequestSession} from "../packet/out/PacketOutRequestSession";
import {currentError, networkManager} from "../../Store";
import {ApplicationError} from "../../ApplicationError";
import {ErrorIds} from "../../ids/ErrorIds";
import app from "../../../main";
import {PacketOutCreateAccount} from "../packet/out/PacketOutCreateAccount";
import {PacketOutRequestUserData} from "../packet/out/PacketOutRequestUserData";

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

    createAccount(username: string, password: string, token: string): Promise<number> {
        return new Promise(resolve => {
            let handled = false;

            let handlerId = this._nodeConnection.addHandler(packet => {
                if(packet.id == 3) {
                    // @ts-ignore
                    let result: boolean = packet.document.data.result;

                    this._nodeConnection.removeHandler(handlerId);
                    handled = true;
                    resolve(result ? 1 : 0);
                }
            });
            this._nodeConnection.sendPacket(new PacketOutCreateAccount(username, password, token));
            setTimeout(() => {
                if(!handled) {
                    this._nodeConnection.removeHandler(handlerId);
                    currentError.set(new ApplicationError(ErrorIds.create_account, "Account creation took to long"));
                    resolve(-1);
                }
            }, 5000);
        });
    }

    requestUserData(): Promise<any> {
        return new Promise<any>(resolve => {
        });
    }

    requestLogin(): Promise<number> {
        return new Promise<number>(resolve => {
            let handled = false;

            let handlerId = this._nodeConnection.addHandler(packet => {
                if(packet.id == 1) {
                    // @ts-ignore
                    let result: boolean = packet.document.data.result;

                    this._nodeConnection.removeHandler(handlerId);
                    handled = true;
                    resolve(result ? 1 : 0);
                }
            });
            this._nodeConnection.sendPacket(new PacketOutLogin(this._user.username, this._user.session));
            setTimeout(() => {
                if(!handled) {
                    this._nodeConnection.removeHandler(handlerId);
                    currentError.set(new ApplicationError(ErrorIds.session_outdated, "Session check took to long"));
                    resolve(-1);
                }
            }, 5000);
        });
    }

    requestLoginSession(username: string, password: string, save: boolean): Promise<string> {
        return new Promise<string>(resolve => {

            let handled = false;

            let handlerId = this._nodeConnection.addHandler(packet => {
                if(packet.id == 2) {
                    // @ts-ignore
                    let result: boolean = packet.document.data.result;
                    // @ts-ignore
                    let session: string = packet.document.data.session;

                    this._nodeConnection.removeHandler(handlerId);
                    handled = true;
                    resolve(result ? session : undefined);
                }
            });
            this._nodeConnection.sendPacket(new PacketOutRequestSession(username, password));
            setTimeout(() => {
                if(!handled) {
                    this._nodeConnection.removeHandler(handlerId);
                    currentError.set(new ApplicationError(ErrorIds.create_session, "Creating a session took too long"));
                    resolve(undefined);
                }
            }, 5000);
        });
    }

    hasUser(): boolean {
        return this._user.exists();
    }

    saveUser(username: string, session: string) {
        this._user.set(username, session);
        networkManager.update(value => {
            value.nodeManager.storeNodes();
            return value;
        })
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