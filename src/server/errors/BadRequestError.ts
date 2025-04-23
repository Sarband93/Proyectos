import HttpError from "./HttpError";
import HttpCodes from "../HttpCodes";

export default class BadRequestError extends HttpError {
    constructor(message?: string) {
        super(HttpCodes.BAD_REQUEST, message)
    }
}