"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const menor_controller_1 = __importDefault(require("../controllers/menor_controller"));
function routing(app) {
    // GET CONTROLLER ROUTE
    app.get('/', menor_controller_1.default.getMenor);
    // POST CONTROLLER ROUTE
    app.post('/', menor_controller_1.default.postMenor);
}
exports.default = routing;
