import { Request, Response, NextFunction } from 'express'
import { Menor } from '../models/menor_model'
import { get } from 'mongoose'
import BadRequestError from '../server/errors/BadRequestError'

async function getMenor(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        throw new Error('error de prueba')
        res.status(200).json({
            mensaje: 'Endpoint funcionando correctamente',
        })
    } catch (error) {
        next(error)
        console.log(error)
    }
}

async function postMenor(
    req: Request,
    res: Response,
    next: NextFunction
) {
    {
        try {
            const { nombre, apellido, edad, grupo } = req.body

            const menor = new Menor({ nombre, apellido, edad, grupo })
            const menorGuardado = await menor.save()

            res.status(200).json({
                mensaje: 'El chaval ha sido guardado correctamente',
                menor: menorGuardado
            })
        } catch (error) {
            console.log(error)
            next(error)
            // res.status(500).json({
            //     mensaje: 'Error al guardar el chaval'
            // })
        }
    }
}

async function getListaMenores(
    req: Request,
    res: Response
) {
    try {
        const menores = await Menor.find()

        res.status(200).json({
            mensaje: "Lista de menores correcta",
            menores
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: 'Error al listar menores'
        })
    }
}

export async function buscarMenorPorGrupo(req: Request, res: Response) {
    try {
      const { nombreGrupo } = req.params
  
      const menores = await Menor.find({ grupo: nombreGrupo })
  
      res.status(200).json({
        mensaje: `Menores del grupo ${nombreGrupo}`,
        menores
      })
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al buscar por grupo',
        error
      })
    }
  }

  export async function buscarMenorPorApellido(req: Request, res: Response) {
    try{
        const { apellido } = req.params
        
        const menores = await Menor.find({ apellido })

        res.status(200).json({
            mensaje: `Menores con apellido ${apellido}`,
            menores
        })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al buscar por apellido',
            error
        })
    }
  }

export default {
    getMenor,
    postMenor,
    getListaMenores,
    buscarMenorPorGrupo,
    buscarMenorPorApellido
}