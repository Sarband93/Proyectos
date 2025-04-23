"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const HttpError_1 = __importDefault(require("./HttpError"));
const HttpCodes_1 = __importDefault(require("../HttpCodes"));
class BadRequestError extends HttpError_1.default {
  constructor(message) {
    super(HttpCodes_1.default.BAD_REQUEST, message);
  }
}
exports.default = BadRequestError;
