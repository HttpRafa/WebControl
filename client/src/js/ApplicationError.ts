export class ApplicationError {

    private readonly _id: number
    private readonly _message: string

    constructor(id: number, message: string) {
        this._id = id;
        this._message = message;
    }

    get id(): number {
        return this._id;
    }

    get message(): string {
        return this._message;
    }

}