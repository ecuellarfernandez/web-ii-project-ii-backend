const db = require("../models");
const { handleFileUpload } = require("../utils/fileHandler");
const artist = db.artist;
const fs = require('fs');

exports.getArtistList = async (req, res) => {
    const artists = await artist.findAll({
        include: [
            'albums',
            'genres'
        ],
    });
    res.send(artists);
};

exports.getArtistById = async (req, res) => {
    try {
        const { id } = req.params;

        const artistData = await artist.findByPk(id, {
            include: [
                {
                    model: db.album,
                    as: 'albums',
                    include: [
                        {
                            model: db.song,
                            as: 'songs'
                        }
                    ]
                },
                {
                    model: db.genre,
                    as: 'genres'
                }
            ]
        });

        if (!artistData) {
            return res.status(404).send({ message: 'Artista no encontrado' });
        }

        res.send(artistData);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener el artista",
            error: error.message
        });
    }
};

exports.postArtistCreate = async (req, res) => {
    try {
        const imagePath = await handleFileUpload(req.files.image, 'artist');
        const artistData = {
            name: req.body.name,
            image: imagePath
        };

        const { errors } = validateArtistRequest({ body: artistData });
        if (errors) {
            fs.unlinkSync(imagePath);
            return res.status(400).send(errors);
        }

        const artistCreated = await artist.create(artistData);

        if (req.body.genreIds) {
            const genreIds = JSON.parse(req.body.genreIds);
            await artistCreated.setGenres(genreIds);
        }

        res.status(201).send(artistCreated);
    } catch (error) {
        res.status(500).send({
            message: "Error al crear el artista",
            error: error.message
        });
    }
};

exports.patchArtistUpdate = async (req, res) => {
    if (!req.body && !req.files) {
        return res.status(400).send({ message: "Petición inválida" });
    }

    const { id } = req.params;
    const artistToUpdate = await artist.findByPk(id);
    if (!artistToUpdate) {
        return res.status(404).send({ message: 'Artista no encontrado' });
    }

    const { name } = req.body;

    if (name) {
        artistToUpdate.name = name;
    }

    if (req.files && req.files.image) {
        try {
            const imagePath = await handleFileUpload(req.files.image, 'artist');
            if (artistToUpdate.image) {
                fs.unlinkSync(artistToUpdate.image);
            }
            artistToUpdate.image = imagePath;
        } catch (error) {
            return res.status(500).send({ message: "Error al subir la imagen", error: error.message });
        }
    }

    const artistSaved = await artistToUpdate.save();
    if (!artistSaved) {
        return res.status(500).send({ message: "Error al editar el artista" });
    }

    if (req.body.genreIds) {
        try {
            const genreIds = JSON.parse(req.body.genreIds); 
            await artistToUpdate.setGenres(genreIds);
        } catch (error) {
            return res.status(400).send({ message: "Error al actualizar los géneros", error: error.message });
        }
    }

    res.send(artistSaved);
};

exports.putArtistUpdate = async (req, res) => {
    const validationResponse = validateArtistRequest(req);
    if (validationResponse.errors) {
        res.status(400).send(validationResponse.errors);
        return;
    }
    const { id } = req.params;
    const body = validationResponse.artistData;

    const artistToUpdate = await artist.findByPk(id);
    if (!artistToUpdate) {
        return res.status(404).send({ message: 'Artista no encontrado' });
    }

    artistToUpdate.name = body.name;
    artistToUpdate.image = body.image;

    const artistSaved = await artistToUpdate.save();
    if (!artistSaved) {
        res.status(500).send({ message: "Error al editar el artista" });
        return;
    }

    if (req.body.genreIds) {
        const genreIds = JSON.parse(req.body.genreIds);
        await artistToUpdate.setGenres(genreIds);
    }

    res.send(artistSaved);
};

exports.deleteArtist = async (req, res) => {
    const { id } = req.params;
    const artistToDelete = await artist.findByPk(id);
    if (!artistToDelete) {
        return res.status(404).send({ message: 'Artista no encontrado' });
    }
    await artistToDelete.destroy();
    res.status(204).send('');
};

const validateArtistRequest = (req) => {
    if (!req.body) {
        return { errors: { message: "Petición inválida" } };
    }
    const { name, image } = req.body;
    const errors = {};

    if (!name) errors.name = "El nombre es requerido";
    if (!image) errors.image = "La imagen es requerida";

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    return {
        errors: null,
        artistData: {
            name,
            image
        }
    };
};