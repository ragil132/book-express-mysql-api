const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../lib/database');

router.get('/books', function (req, res) {

    connection.query('SELECT * FROM books ORDER BY id desc', function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data Books',
                data: rows
            })
        }
    });
});

router.post('/books', [

    body('title').notEmpty(),
    body('content').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let formData = {
        title: req.body.title,
        content: req.body.content
    }

    connection.query('INSERT INTO books SET ?', formData, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                status: true,
                message: 'Success! Data added',
                data: rows[0]
            })
        }
    })

});

router.get('/books/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM books WHERE id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Book Not Found!',
            })
        }
        else {
            return res.status(200).json({
                status: true,
                message: `Detail Data Book with id = ${id}`,
                data: rows[0]
            })
        }
    })
})

router.patch('/books/:id', [

    body('title').notEmpty(),
    body('content').notEmpty()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    let id = req.params.id;

    let formData = {
        title: req.body.title,
        content: req.body.content
    }

    connection.query(`SELECT * FROM books WHERE id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Book Not Found!',
            })
        }
        else {
            connection.query(`UPDATE books SET ? WHERE id = ${id}`, formData, function (err, rows) {

                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                    })
                }
                else {
                    return res.status(200).json({
                        status: true,
                        message: 'Data updated!'
                    })
                }
            })
        }
    })

});

router.delete('/books/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM books WHERE id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Book Not Found!',
            })
        }
        else {
            connection.query(`DELETE FROM books WHERE id = ${id}`, function (err, rows) {

                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                    })
                }
                else {
                    return res.status(200).json({
                        status: true,
                        message: 'Data Deleted!',
                    })
                }

            })
        }
    })

});

module.exports = router;