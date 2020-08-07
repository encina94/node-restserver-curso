const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

module.exports = app;


// ==============
// Obtener productos
// ==============
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({}) //Con estos parametros en string digo cuales propiedades quiero del objeto total   
        .populate('usuario', 'nombre email') //Me trae los datos 'nombre email' de la tabla usuario , hace un join con el id usuario que se tiene
        .populate('categoria', 'descripcion')
        .skip(desde) //De la cantidad de registros quiero que me traigas todos a partir "de "
        .limit(limite) //Limite de registros que quiero que me traigas
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos,
            });

        });

});

// ===============
// OBTENER PRODUCTO POR ID
app.get('/productos/:id', verificaToken, (req, res) => {
    //actualizar una categoria del listado
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email') //Me trae los datos 'nombre email' de la tabla usuario , hace un join con el id usuario que se tiene
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            //Error de base de datos
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            //Error de que no se pudo crear la categoria por un mal request
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })
});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //Se toma el string 'termino' que va a formar parte de la buscada y se lo pone en una expresion regular
    //De manera que cualquier nombre que tenga una parte del termino que se ingreso va a ser devuelta, la 'i' es para que no distinga minuscula ni mayuscula
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex }) //Se dice que busca el nombre por la expresion regular formada
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })

        })

})


// ===============
// CREAR UN PRODUCTO
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario (tomr el usuario)
    //grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        //Error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Error de que no se pudo crear la producto por un mal request
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// ===============
// ACTUALIZAR PRODUCTO POR ID
app.put('/productos/:id', verificaToken, (req, res) => {
    //actualizar una categoria del listado
    let id = req.params.id;
    let body = req.body;


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        //Error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Error de que no se pudo crear la producto por un mal request
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

// ===============
// BORRAR UN PRODUCTO
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiaDisponibilidad = {
        disponible: false,
    }
    Producto.findByIdAndUpdate(id, cambiaDisponibilidad, { new: true }, (err, productoDB) => {
        //Error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Error de que no se pudo eliminar la producto por un mal request
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            message: 'producto borrado'
        })
    })
});