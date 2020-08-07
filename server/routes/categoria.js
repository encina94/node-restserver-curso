const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();

let Categoria = require('../models/categoria');

// ===================
//Mostrar todas las categorias
// ===================
app.get('/categoria', (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Categoria.find({}) //Con estos parametros en string digo cuales propiedades quiero del objeto total   
        .sort('descripcion') //Lo ordeno por descripcion 
        .populate('usuario', 'nombre email') //Me trae los datos 'nombre email' de la tabla usuario , hace un join con el id usuario que se tiene
        .skip(desde) //De la cantidad de registros quiero que me traigas todos a partir "de "
        .limit(limite) //Limite de registros que quiero que me traigas
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias,
            });

        });

});

// ===================
//Mostrar una categoria por ID
// ===================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        //Error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Error de que no se pudo crear la categoria por un mal request
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

// ===================
//Crear nueva categoria
// ===================
app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        //Error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Error de que no se pudo crear la categoria por un mal request
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ===================
//Mostrar todas las categorias
// ===================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        //Error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Error de que no se pudo crear la categoria por un mal request
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

// ===================
//Borrar una categoria
// ===================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        //Error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Error de que no se pudo eliminar la categoria por un mal request
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })
    })

});

module.exports = app;