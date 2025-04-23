"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getMenor(req, res) {
    try {
        res.status(200).json({
            mensaje: 'Endpoint funcionando correctamente',
        });
    }
    catch (error) {
        console.log(error);
    }
}
async function postMenor(req, res) {
    {
        try {
            const { id, nombre, edad, grupo } = req.body;
            res.status(200).json({
                mensaje: 'El chaval ha sido recibido correctamente',
                menor: {
                    id,
                    nombre,
                    edad,
                    grupo
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.default = {
    getMenor,
    postMenor
};
