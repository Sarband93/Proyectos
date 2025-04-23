"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const menor_route_1 = __importDefault(require("./routes/menor_route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, menor_route_1.default)(app);
// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ API  de Menores funcionando");
});
// Conectar a la base de datos
(0, database_1.connectDB)();
// Levantar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
function errorHandler(err, req, res, next) {
  res.status(err.status) || 500;
  res.json({ error: 1, message: err.message });
}
// function errorHandler(
//   err: Error & { status?: number },
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void {
//   const statusCode = err.status ?? 500 // ⬅ si no hay status, usamos 500
//   res.status(statusCode).json({
//     error: 1,
//     message: err.message || 'Error interno del servidor'
//   })
// }
app.use(errorHandler);
