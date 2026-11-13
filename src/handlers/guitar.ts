import { body, validationResult } from "express-validator";
import { Request, Response } from "express";
import Guitar from "../models/Guitar.model";

export const getGuitars = async (_req: Request, res: Response) => {
    try {
        const guitars = await Guitar.findAll({ order: [["id", "ASC"]] });
        return res.json(guitars);
    } catch (error) {
        console.error("Error al consultar guitarras:", error);
        return res.status(500).json({ message: "No se pudo cargar el catalogo." });
    }
};



export const createGuitar = async (req: Request, res: Response) => {
    try {

        //Las validaciones logicamente son antes de crear el producto
        await body('name')
            .isString().withMessage('El nombre de la guitarra debe ser texto')
            .bail()
            .trim()
            .notEmpty().withMessage('El nombre de la guitarra no puede ir vacio')
            .run(req);

        await body('image')
            .isString().withMessage('La imagen debe ser texto')
            .bail()
            .trim()
            .notEmpty().withMessage('La imagen es obligatoria')
            .run(req);

        await body('description')
            .isString().withMessage('La descripcion debe ser texto')
            .bail()
            .trim()
            .notEmpty().withMessage('La descripcion es obligatoria')
            .run(req);

        await body('price')
            .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que 0')
            .custom((value) => {
                const decimals = (value.toString().split('.')[1] || '').length;
                if (decimals > 2) {
                    throw new Error('El precio no puede tener más de 2 decimales');
                }
                return true;
            })
            .run(req);




        //Indicacion de errores
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array().map(error => error.msg).join(" "),
            });
        }


        //Creacion del producto
        const guitar = await Guitar.create({
            name: req.body.name.trim(),
            image: req.body.image.trim(),
            description: req.body.description.trim(),
            price: Number(req.body.price),
        });
        return res.status(201).json(guitar);

    } catch (error) {
        console.error("Error al guardar guitarra:", error);
        return res.status(500).json({ message: "No se pudo guardar la guitarra." });
    }
}
