"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const menor_route_1 = __importDefault(require("./routes/menor_route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, menor_route_1.default)(app);
// Ruta de prueba
app.get('/', (req, res) => {
    res.send('✅ API  de Menores funcionando');
});
// Recibir un menor
// app.post('/', (req, res) => {
//   const menor = req.body
//   console.log('Chaval recibido:', menor)
//   res.status(200).json({
//     mensaje: 'El chaval ha sido recibido correctamente',
//     menor: {
//       id: menor.id,
//       nombre: menor.nombre,
//       edad: menor.edad,
//       grupo: menor.grupo
//     }
//   })
// })
// Conectar a la base de datos
//connectDB()
// Levantar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
