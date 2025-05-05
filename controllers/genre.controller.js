const db = require("../models");
const genre = db.genre;
const { handleFileUpload } = require("../utils/fileHandler");

exports.getGenreList = async (req, res) => {
    try {
        const genres = await genre.findAll();
        res.send(genres);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener los géneros",
            error: error.message
        });
    }
};

exports.getGenreById = async (req, res) => {
    try {
        const { id } = req.params;
        const genreData = await genre.findByPk(id);
        if (!genreData) {
            return res.status(404).send({ message: 'Género no encontrado' });
        }
        res.send(genreData);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener el género",
            error: error.message
        });
    }
};

exports.postGenreCreate = async (req, res) => {
    try {
        const { errors } = validateGenreRequest(req);
        if (errors) {
            return res.status(400).send({ errors });
        }

        const imagePath = await handleFileUpload(req.files.image, 'genre');
        const genreData = {
            name: req.body.name,
            image: imagePath
        };

        const genreCreated = await genre.create(genreData);
        if (!genreCreated) {
            return res.status(500).send({ message: "Error al crear el género" });
        }
        res.status(201).send(genreCreated);
    } catch (error) {
        res.status(500).send({
            message: "Error al crear el género",
            error: error.message
        });
    }
};

exports.patchGenreUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const genreToUpdate = await genre.findByPk(id);
        if (!genreToUpdate) {
            return res.status(404).send({ message: 'Género no encontrado' });
        }
        const { name, image } = req.body;
        if (name) {
            genreToUpdate.name = name;
        }
        if (image) {
            genreToUpdate.image = image;
        }
        const genreSaved = await genreToUpdate.save();
        if (!genreSaved) {
            res.status(500).send({ message: "Error al editar el género" });
            return;
        }
        res.send(genreSaved);
    } catch (error) {
        res.status(500).send({
            message: "Error al editar el género",
            error: error.message
        });
    }
};

exports.putGenreUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const genreToUpdate = await genre.findByPk(id);
        if (!genreToUpdate) {
            return res.status(404).send({ message: 'Género no encontrado' });
        }
        genreToUpdate.name = req.body.name;
        genreToUpdate.image = req.body.image;
        const genreSaved = await genreToUpdate.save();
        if (!genreSaved) {
            res.status(500).send({ message: "Error al editar el género" });
            return;
        }
        res.send(genreSaved);
    } catch (error) {
        res.status(500).send({
            message: "Error al editar el género",
            error: error.message
        });
    }
};

exports.deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const genreToDelete = await genre.findByPk(id);
        if (!genreToDelete) {
            return res.status(404).send({ message: 'Género no encontrado' });
        }
        await genreToDelete.destroy();
        res.status(204).send('');
    } catch (error) {
        res.status(500).send({
            message: "Error al eliminar el género",
            error: error.message
        });
    }
};

const validateGenreRequest = (req) => {
    const errors = {};

    if (!req.body.name) errors.name = "El nombre es requerido";

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    return {
        errors: null,
        genreData: {
            name: req.body.name
        }
    };
};